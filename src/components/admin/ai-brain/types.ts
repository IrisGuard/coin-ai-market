
export interface AICommand {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
  command_type: string;
  is_active: boolean;
  created_at: string;
  priority: number;
  execution_timeout: number;
}

export interface NewCommandForm {
  name: string;
  description: string;
  code: string;
  category: string;
  command_type: string;
  priority: number;
  execution_timeout: number;
}
