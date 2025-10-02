import crypto from 'crypto';

/**
 * Facebook Conversions API Client
 *
 * Sends server-side conversion events to Facebook for better ad optimization.
 * This bypasses ad blockers and provides more accurate tracking.
 *
 * Setup required:
 * 1. Create Facebook App at https://developers.facebook.com/
 * 2. Get Pixel ID (already have: 1069181438510520)
 * 3. Generate System User Access Token
 * 4. Add to .env.local:
 *    FACEBOOK_CONVERSION_API_ACCESS_TOKEN=your_token_here
 */

// Environment variables
const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1069181438510520';
const ACCESS_TOKEN = process.env.FACEBOOK_CONVERSION_API_ACCESS_TOKEN;
const API_VERSION = 'v18.0';
const API_URL = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

/**
 * SHA256 hash function for user data (privacy compliance)
 */
function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Normalize phone number to E.164 format
 * Example: "9876543210" -> "+919876543210"
 */
function normalizePhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Add +91 country code if not present
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }

  return `+${cleaned}`;
}

/**
 * User data for Advanced Matching
 */
interface UserData {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

/**
 * Facebook Conversion Event
 */
interface ConversionEvent {
  event_name: string;              // 'Purchase', 'Lead', etc.
  event_time: number;              // Unix timestamp
  event_source_url?: string;       // URL where event occurred
  user_data: {
    ph?: string[];                 // SHA256 hashed phone numbers
    em?: string[];                 // SHA256 hashed emails
    fn?: string[];                 // SHA256 hashed first name
    ln?: string[];                 // SHA256 hashed last name
    ct?: string[];                 // SHA256 hashed city
    st?: string[];                 // SHA256 hashed state
    country?: string[];            // SHA256 hashed country
    zp?: string[];                 // SHA256 hashed zip code
    fbc?: string;                  // Facebook click ID cookie (_fbc)
    fbp?: string;                  // Facebook browser ID cookie (_fbp)
    client_ip_address?: string;    // User's IP address
    client_user_agent?: string;    // User's user agent
  };
  custom_data?: {
    value?: number;                // Purchase value
    currency?: string;             // Currency code (INR)
    content_name?: string;         // Product/Broker name
    content_category?: string;     // Category
    broker_id?: string;            // Custom parameter
  };
  action_source: string;           // 'website', 'email', etc.
  event_id?: string;               // Deduplication ID
}

/**
 * Send conversion event to Facebook Conversions API
 */
export async function sendConversionEvent(params: {
  eventName: string;
  eventTime: Date;
  userData: UserData;
  fbclid?: string;
  fbp?: string;
  customData?: {
    value?: number;
    currency?: string;
    contentName?: string;
    contentCategory?: string;
    brokerId?: string;
  };
  eventSourceUrl?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  eventId?: string;
}): Promise<{ success: boolean; error?: string }> {

  // Check if access token is configured
  if (!ACCESS_TOKEN) {
    console.error('Facebook Conversion API access token not configured');
    return {
      success: false,
      error: 'Access token not configured. Set FACEBOOK_CONVERSION_API_ACCESS_TOKEN in .env'
    };
  }

  try {
    // Prepare user data with SHA256 hashing
    const hashedUserData: ConversionEvent['user_data'] = {};

    if (params.userData.phone) {
      const normalized = normalizePhone(params.userData.phone);
      hashedUserData.ph = [sha256(normalized)];
    }

    if (params.userData.email) {
      hashedUserData.em = [sha256(params.userData.email.toLowerCase().trim())];
    }

    if (params.userData.firstName) {
      hashedUserData.fn = [sha256(params.userData.firstName.toLowerCase().trim())];
    }

    if (params.userData.lastName) {
      hashedUserData.ln = [sha256(params.userData.lastName.toLowerCase().trim())];
    }

    if (params.userData.city) {
      hashedUserData.ct = [sha256(params.userData.city.toLowerCase().trim())];
    }

    if (params.userData.state) {
      hashedUserData.st = [sha256(params.userData.state.toLowerCase().trim())];
    }

    if (params.userData.country) {
      hashedUserData.country = [sha256(params.userData.country.toLowerCase().trim())];
    }

    if (params.userData.zipCode) {
      hashedUserData.zp = [sha256(params.userData.zipCode.trim())];
    }

    // Add Facebook cookies if available
    if (params.fbclid) {
      hashedUserData.fbc = `fb.1.${Date.now()}.${params.fbclid}`;
    }

    if (params.fbp) {
      hashedUserData.fbp = params.fbp;
    }

    if (params.clientIpAddress) {
      hashedUserData.client_ip_address = params.clientIpAddress;
    }

    if (params.clientUserAgent) {
      hashedUserData.client_user_agent = params.clientUserAgent;
    }

    // Generate event ID for deduplication (if not provided)
    const eventId = params.eventId || `${params.eventName}_${params.userData.phone || 'unknown'}_${params.eventTime.getTime()}`;

    // Prepare the event
    const event: ConversionEvent = {
      event_name: params.eventName,
      event_time: Math.floor(params.eventTime.getTime() / 1000), // Unix timestamp
      event_source_url: params.eventSourceUrl || 'https://findbroker.paisowala.com',
      user_data: hashedUserData,
      action_source: 'website',
      event_id: eventId
    };

    // Add custom data if provided
    if (params.customData) {
      event.custom_data = {
        value: params.customData.value,
        currency: params.customData.currency || 'INR',
        content_name: params.customData.contentName,
        content_category: params.customData.contentCategory,
        broker_id: params.customData.brokerId
      };
    }

    // Send to Facebook Conversions API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [event],
        access_token: ACCESS_TOKEN,
        test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE // Optional: for testing
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook Conversions API error:', result);
      return {
        success: false,
        error: result.error?.message || 'Failed to send event to Facebook'
      };
    }

    console.log('Facebook Conversions API success:', {
      eventName: params.eventName,
      eventId,
      eventsReceived: result.events_received,
      fbTraceId: result.fbtrace_id
    });

    return { success: true };

  } catch (error) {
    console.error('Error sending to Facebook Conversions API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send Purchase event for confirmed conversion
 *
 * This should be called AFTER CSV confirms the user actually opened an account.
 */
export async function sendPurchaseEvent(params: {
  name: string;
  phone: string;
  email?: string;
  brokerId: string;
  brokerClientId: string;
  conversionDate: Date;
  fbclid?: string;
  value?: number; // Commission value
}): Promise<{ success: boolean; error?: string }> {

  // Split name into first and last name
  const nameParts = params.name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || '';

  return sendConversionEvent({
    eventName: 'Purchase',
    eventTime: params.conversionDate,
    userData: {
      phone: params.phone,
      email: params.email,
      firstName,
      lastName,
      country: 'in' // India
    },
    fbclid: params.fbclid,
    customData: {
      value: params.value || 500, // Default estimated commission
      currency: 'INR',
      contentName: params.brokerId,
      contentCategory: 'broker_account_opening',
      brokerId: params.brokerId
    },
    eventId: `purchase_${params.brokerClientId}_${params.conversionDate.getTime()}`
  });
}

/**
 * Sync all pending conversions to Facebook
 *
 * This should be run periodically (e.g., every hour) to sync approved conversions.
 */
export async function syncPendingConversions(
  submissions: Array<{
    id: number;
    name: string;
    mobile: string;
    recommended_broker: string;
    broker_client_id?: string;
    conversion_date?: string;
    fb_click_id?: string;
    fb_sync_status?: string;
  }>
): Promise<{
  synced: number;
  failed: number;
  errors: Array<{ id: number; error: string }>;
}> {

  let synced = 0;
  let failed = 0;
  const errors: Array<{ id: number; error: string }> = [];

  for (const submission of submissions) {
    if (
      submission.fb_sync_status === 'pending' &&
      submission.broker_client_id &&
      submission.conversion_date
    ) {
      const result = await sendPurchaseEvent({
        name: submission.name,
        phone: submission.mobile,
        brokerId: submission.recommended_broker,
        brokerClientId: submission.broker_client_id,
        conversionDate: new Date(submission.conversion_date),
        fbclid: submission.fb_click_id
      });

      if (result.success) {
        synced++;
        // Update sync status in database (caller should do this)
      } else {
        failed++;
        errors.push({
          id: submission.id,
          error: result.error || 'Unknown error'
        });
      }
    }
  }

  return { synced, failed, errors };
}
