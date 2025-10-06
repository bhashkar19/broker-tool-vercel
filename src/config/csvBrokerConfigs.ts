/**
 * Broker CSV Configuration System
 *
 * This file defines how to parse CSV files from different brokers.
 * Each broker may have different column names, date formats, and file types.
 *
 * To add a new broker:
 * 1. Add a new entry to BROKER_CSV_CONFIGS
 * 2. Define the column mappings
 * 3. Specify date format and matching rules
 * 4. No code changes required!
 */

export interface BrokerCSVConfig {
  // Broker identification
  brokerId: string;
  brokerName: string;

  // CSV file types this broker provides
  fileTypes: {
    conversions?: {
      description: string;
      columns: {
        name: string;           // Column name in CSV for customer name
        clientId: string;       // Column name for broker's client ID
        date: string;           // Column name for conversion/account opening date
        status?: string;        // Optional: column for account status
      };
      dateFormat: string;       // e.g., 'YYYY-MM-DD', 'DD/MM/YYYY'
      skipRows?: number;        // Number of header rows to skip (default: 0)
    };
    leads?: {
      description: string;
      columns: {
        name: string;
        leadId: string;
        clientId?: string;      // May be empty for non-converters
        createdDate: string;
        status?: string;
      };
      dateFormat: string;
      skipRows?: number;
    };
  };

  // Matching rules
  matchingRules: {
    nameConfidenceThreshold: number;    // Min confidence to consider a match (60-100)
    autoMatchThreshold: number;         // Auto-approve if >= this (typically 90)
    reviewThreshold: number;            // Manual review if >= this (typically 70)
    dateRangeDays: number;              // Search window before conversion date
  };

  // Data validation
  validation?: {
    nameMinLength?: number;
    nameMaxLength?: number;
    clientIdPattern?: RegExp;
  };
}

// Zerodha Configuration
const zerodhaConfig: BrokerCSVConfig = {
  brokerId: 'zerodha',
  brokerName: 'Zerodha',

  fileTypes: {
    conversions: {
      description: 'Zerodha Account Openings (Mapped Clients)',
      columns: {
        name: 'Name',
        clientId: 'Client-ID',
        date: 'Mapped-on',
        status: 'Equity eSigned'
      },
      dateFormat: 'YYYY-MM-DD',
      skipRows: 0
    },
    leads: {
      description: 'Zerodha Leads Report',
      columns: {
        name: 'full_name',
        leadId: 'lead_id',
        clientId: 'client_id',
        createdDate: 'lead_creation_time',
        status: 'status'
      },
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      skipRows: 0
    }
  },

  matchingRules: {
    nameConfidenceThreshold: 60,
    autoMatchThreshold: 90,
    reviewThreshold: 70,
    dateRangeDays: 30
  },

  validation: {
    nameMinLength: 2,
    nameMaxLength: 100,
    clientIdPattern: /^[A-Z0-9]{6}$/  // Zerodha client IDs are 6 chars
  }
};

// Angel One Configuration
const angelOneConfig: BrokerCSVConfig = {
  brokerId: 'angel_one',
  brokerName: 'Angel One',

  fileTypes: {
    conversions: {
      description: 'Angel One Combined Report (Leads + Conversions)',
      columns: {
        name: 'client_name',
        clientId: 'account_id',
        date: 'registration_date',
        status: 'account_status' // Used to detect: 'lead'/'pending' = lead, others = converted
      },
      dateFormat: 'DD/MM/YYYY',
      skipRows: 0
    }
  },

  matchingRules: {
    nameConfidenceThreshold: 60,
    autoMatchThreshold: 85,      // Slightly lower due to potential name variations
    reviewThreshold: 70,
    dateRangeDays: 30
  },

  validation: {
    nameMinLength: 2,
    nameMaxLength: 100
  }
};

// Upstox Configuration (Example - adjust based on actual CSV format)
const upstoxConfig: BrokerCSVConfig = {
  brokerId: 'upstox',
  brokerName: 'Upstox',

  fileTypes: {
    conversions: {
      description: 'Upstox Conversions Report',
      columns: {
        name: 'Customer Name',
        clientId: 'Client Code',
        date: 'Account Opening Date'
      },
      dateFormat: 'DD-MM-YYYY',
      skipRows: 1  // Upstox might have a header row
    }
  },

  matchingRules: {
    nameConfidenceThreshold: 60,
    autoMatchThreshold: 90,
    reviewThreshold: 70,
    dateRangeDays: 30
  }
};

// Groww Configuration (Example)
const growwConfig: BrokerCSVConfig = {
  brokerId: 'groww',
  brokerName: 'Groww',

  fileTypes: {
    conversions: {
      description: 'Groww Account Activations',
      columns: {
        name: 'name',
        clientId: 'user_id',
        date: 'activated_on'
      },
      dateFormat: 'YYYY-MM-DD',
      skipRows: 0
    }
  },

  matchingRules: {
    nameConfidenceThreshold: 60,
    autoMatchThreshold: 90,
    reviewThreshold: 70,
    dateRangeDays: 30
  }
};

// ICICI Direct Configuration (Example)
const iciciDirectConfig: BrokerCSVConfig = {
  brokerId: 'icici_direct',
  brokerName: 'ICICI Direct',

  fileTypes: {
    conversions: {
      description: 'ICICI Direct New Accounts',
      columns: {
        name: 'CLIENT_NAME',
        clientId: 'CLIENT_CODE',
        date: 'ACCOUNT_OPEN_DATE'
      },
      dateFormat: 'DD/MM/YYYY',
      skipRows: 0
    }
  },

  matchingRules: {
    nameConfidenceThreshold: 60,
    autoMatchThreshold: 90,
    reviewThreshold: 70,
    dateRangeDays: 30
  }
};

// Export all broker configs
export const BROKER_CSV_CONFIGS: Record<string, BrokerCSVConfig> = {
  zerodha: zerodhaConfig,
  angel_one: angelOneConfig,
  upstox: upstoxConfig,
  groww: growwConfig,
  icici_direct: iciciDirectConfig
  // Add more brokers here - no code changes needed!
};

// Helper functions
export function getBrokerConfig(brokerId: string): BrokerCSVConfig | null {
  return BROKER_CSV_CONFIGS[brokerId] || null;
}

export function getAllBrokerIds(): string[] {
  return Object.keys(BROKER_CSV_CONFIGS);
}

export function getAllBrokerConfigs(): BrokerCSVConfig[] {
  return Object.values(BROKER_CSV_CONFIGS);
}

// Validate if a broker supports a specific file type
export function brokerSupportsFileType(
  brokerId: string,
  fileType: 'conversions' | 'leads'
): boolean {
  const config = getBrokerConfig(brokerId);
  return config?.fileTypes[fileType] !== undefined;
}

// Get file type configuration
export function getFileTypeConfig(
  brokerId: string,
  fileType: 'conversions' | 'leads'
): BrokerCSVConfig['fileTypes']['conversions'] | BrokerCSVConfig['fileTypes']['leads'] | null {
  const config = getBrokerConfig(brokerId);
  if (!config) return null;
  return config.fileTypes[fileType] || null;
}
