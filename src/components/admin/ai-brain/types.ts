
export interface AICommand {
  id: string;
  name: string;
  description?: string;
  code: string;
  category: string;
  command_type: string;
  priority: number;
  execution_timeout: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  required_permissions?: string[];
  input_schema?: any;
  output_schema?: any;
  site_url?: string; // NEW: For website parsing
}

export interface NewCommandForm {
  name: string;
  description?: string;
  code: string;
  category: string;
  command_type: string;
  priority: number;
  execution_timeout: number;
  site_url?: string; // NEW: For website parsing
}
