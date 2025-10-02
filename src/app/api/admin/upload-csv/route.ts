import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-database';
import { getBrokerConfig, getFileTypeConfig } from '@/config/csvBrokerConfigs';
import { batchMatchNames, generateImportHash } from '@/lib/name-matcher';
import crypto from 'crypto';

interface ParsedCSVRow {
  name: string;
  clientId: string;
  date: string;
  status?: string;
  rawRow: Record<string, unknown>;
}

/**
 * Parse CSV content and extract relevant data based on broker config
 */
function parseCSV(
  csvContent: string,
  brokerId: string,
  fileType: 'conversions' | 'leads'
): ParsedCSVRow[] {
  const fileTypeConfig = getFileTypeConfig(brokerId, fileType);
  if (!fileTypeConfig) {
    throw new Error(`File type ${fileType} not supported for broker ${brokerId}`);
  }

  const lines = csvContent.split('\n').filter(line => line.trim());
  const skipRows = fileTypeConfig.skipRows || 0;

  // Parse header
  const headerLine = lines[skipRows];
  const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  // Find column indices
  const nameCol = headers.indexOf(fileTypeConfig.columns.name);
  const clientIdCol = fileTypeConfig.columns.clientId
    ? headers.indexOf(fileTypeConfig.columns.clientId)
    : -1;

  // Handle both 'date' and 'createdDate' fields
  const dateFieldName = 'date' in fileTypeConfig.columns
    ? (fileTypeConfig.columns as { date: string }).date
    : (fileTypeConfig.columns as { createdDate: string }).createdDate;
  const dateCol = headers.indexOf(dateFieldName);

  const statusCol = fileTypeConfig.columns.status
    ? headers.indexOf(fileTypeConfig.columns.status)
    : -1;

  if (nameCol === -1 || dateCol === -1) {
    throw new Error(
      `Required columns not found. Expected: ${fileTypeConfig.columns.name}, ${dateFieldName}`
    );
  }

  // Parse data rows
  const results: ParsedCSVRow[] = [];
  for (let i = skipRows + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));

    const name = values[nameCol];
    const clientId = clientIdCol !== -1 ? values[clientIdCol] : '';
    const date = values[dateCol];
    const status = statusCol !== -1 ? values[statusCol] : undefined;

    // Skip rows without name or date
    if (!name || !date) continue;

    // Create raw row object
    const rawRow: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      rawRow[header] = values[idx];
    });

    results.push({
      name,
      clientId,
      date,
      status,
      rawRow
    });
  }

  return results;
}

/**
 * Parse date according to broker's date format
 */
function parseDate(dateStr: string, format: string): Date {
  // Simple date parser - you might want to use a library like date-fns for production
  if (format === 'YYYY-MM-DD') {
    return new Date(dateStr);
  } else if (format === 'DD/MM/YYYY') {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  } else if (format === 'DD-MM-YYYY') {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  } else if (format.includes('HH:mm:ss')) {
    return new Date(dateStr);
  }

  // Fallback
  return new Date(dateStr);
}

/**
 * POST /api/admin/upload-csv
 *
 * Upload and process broker CSV file
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const brokerId = formData.get('brokerId') as string;
    const fileType = formData.get('fileType') as 'conversions' | 'leads';

    // Validate inputs
    if (!file || !brokerId || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, brokerId, fileType' },
        { status: 400 }
      );
    }

    // Validate broker config exists
    const brokerConfig = getBrokerConfig(brokerId);
    if (!brokerConfig) {
      return NextResponse.json(
        { error: `Unknown broker: ${brokerId}` },
        { status: 400 }
      );
    }

    const fileTypeConfig = getFileTypeConfig(brokerId, fileType);
    if (!fileTypeConfig) {
      return NextResponse.json(
        { error: `File type ${fileType} not supported for broker ${brokerId}` },
        { status: 400 }
      );
    }

    // Read CSV file
    const csvContent = await file.text();

    // Generate file hash for deduplication
    const fileHash = crypto.createHash('md5').update(csvContent).digest('hex');

    // Check if this file was already uploaded
    const { data: existingImport } = await supabaseAdmin
      .from('conversion_imports')
      .select('id, created_at')
      .eq('file_hash', fileHash)
      .single();

    if (existingImport) {
      return NextResponse.json(
        {
          error: 'This file has already been uploaded',
          existingImportId: existingImport.id,
          uploadedAt: existingImport.created_at
        },
        { status: 409 }
      );
    }

    // Parse CSV
    let parsedRows: ParsedCSVRow[];
    try {
      parsedRows = parseCSV(csvContent, brokerId, fileType);
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'CSV parsing failed',
          details: parseError instanceof Error ? parseError.message : 'Unknown error'
        },
        { status: 400 }
      );
    }

    // Create import record
    const { data: importRecord, error: importError } = await supabaseAdmin
      .from('conversion_imports')
      .insert([{
        broker_id: brokerId,
        file_name: file.name,
        file_hash: fileHash,
        total_rows: parsedRows.length,
        upload_status: 'processing'
      }])
      .select()
      .single();

    if (importError || !importRecord) {
      console.error('Error creating import record:', importError);
      return NextResponse.json(
        { error: 'Failed to create import record' },
        { status: 500 }
      );
    }

    // Fetch all submissions for this broker within date range
    const earliestDate = new Date();
    earliestDate.setDate(earliestDate.getDate() - (brokerConfig.matchingRules.dateRangeDays + 30));

    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('user_submissions')
      .select('id, name, mobile, created_at, recommended_broker')
      .eq('recommended_broker', brokerId)
      .gte('created_at', earliestDate.toISOString());

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return NextResponse.json(
        { error: 'Failed to fetch submissions for matching' },
        { status: 500 }
      );
    }

    // Prepare batch matching input
    const batchInput = parsedRows.map(row => ({
      brokerName: row.name,
      brokerClientId: row.clientId,
      brokerDate: parseDate(row.date, fileTypeConfig.dateFormat).toISOString(),
      csvRowData: row.rawRow
    }));

    // Perform batch name matching
    const matchResults = batchMatchNames(
      batchInput,
      submissions || [],
      brokerId,
      {
        autoMatchThreshold: brokerConfig.matchingRules.autoMatchThreshold,
        reviewThreshold: brokerConfig.matchingRules.reviewThreshold,
        dateRangeDays: brokerConfig.matchingRules.dateRangeDays
      }
    );

    // Process auto-matched results
    const autoMatchedCount = matchResults.autoMatched.length;
    for (const match of matchResults.autoMatched) {
      const importHash = generateImportHash(
        match.input.brokerName,
        match.input.brokerClientId || '',
        match.input.brokerDate
      );

      // Update user_submissions with conversion data
      await supabaseAdmin
        .from('user_submissions')
        .update({
          broker_client_id: match.input.brokerClientId,
          conversion_status: 'converted',
          conversion_date: match.input.brokerDate,
          match_confidence: match.confidence,
          import_hash: importHash,
          fb_sync_status: 'pending' // Will be synced to Facebook later
        })
        .eq('id', match.match.submissionId);
    }

    // Add items needing review to manual_review_queue
    for (const review of matchResults.needsReview) {
      await supabaseAdmin
        .from('manual_review_queue')
        .insert([{
          import_id: importRecord.id,
          broker_id: brokerId,
          broker_name: review.input.brokerName,
          broker_client_id: review.input.brokerClientId,
          broker_conversion_date: review.input.brokerDate,
          potential_matches: review.alternativeMatches.map(alt => ({
            submission_id: alt.submissionId,
            name: alt.submissionName,
            mobile: alt.mobile,
            confidence: alt.confidence,
            created_at: alt.createdAt
          })),
          csv_row_data: review.input.csvRowData,
          review_status: 'pending'
        }]);
    }

    // Update import record with results
    await supabaseAdmin
      .from('conversion_imports')
      .update({
        matched_rows: autoMatchedCount,
        unmatched_rows: matchResults.noMatch.length,
        duplicate_rows: 0, // TODO: Track duplicates
        upload_status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', importRecord.id);

    return NextResponse.json({
      success: true,
      importId: importRecord.id,
      summary: {
        totalRows: parsedRows.length,
        autoMatched: autoMatchedCount,
        needsReview: matchResults.needsReview.length,
        noMatch: matchResults.noMatch.length
      },
      details: {
        autoMatched: matchResults.autoMatched.map(m => ({
          brokerName: m.input.brokerName,
          matchedName: m.match.submissionName,
          confidence: m.confidence,
          mobile: m.match.mobile.slice(-4) // Last 4 digits only
        })),
        needsReview: matchResults.needsReview.map(r => ({
          brokerName: r.input.brokerName,
          bestMatchName: r.bestMatch?.submissionName,
          confidence: r.confidence,
          alternativesCount: r.alternativeMatches.length
        })),
        noMatch: matchResults.noMatch.map(n => ({
          brokerName: n.input.brokerName,
          date: n.input.brokerDate
        }))
      }
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
