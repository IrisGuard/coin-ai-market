
export interface MockDataViolation {
  id: string;
  file_path: string;
  line_number: number;
  violation_type: 'math_random' | 'mock_string' | 'demo_string' | 'placeholder_string' | 'sample_string' | 'fake_string';
  violation_content: string;
  detected_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'ignored';
  resolved_at?: string;
  resolved_by?: string;
}

export interface SecurityScanResult {
  id: string;
  scan_id: string;
  scan_type: 'manual' | 'automated' | 'pre_commit';
  total_files_scanned: number;
  violations_found: number;
  scan_duration_ms: number;
  scan_started_at: string;
  scan_completed_at: string;
  initiated_by: string;
  scan_status: 'running' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
}

export interface MockDataScanConfig {
  enabled: boolean;
  patterns: {
    math_random: boolean;
    mock_strings: boolean;
    demo_strings: boolean;
    placeholder_strings: boolean;
    sample_strings: boolean;
    fake_strings: boolean;
  };
  file_extensions: string[];
  excluded_paths: string[];
  severity_levels: {
    math_random: 'low' | 'medium' | 'high' | 'critical';
    mock_strings: 'low' | 'medium' | 'high' | 'critical';
    demo_strings: 'low' | 'medium' | 'high' | 'critical';
    placeholder_strings: 'low' | 'medium' | 'high' | 'critical';
    sample_strings: 'low' | 'medium' | 'high' | 'critical';
    fake_strings: 'low' | 'medium' | 'high' | 'critical';
  };
}
