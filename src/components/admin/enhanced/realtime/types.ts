
export interface RealTimeMetrics {
  active_users: number;
  active_sessions: number;
  pending_transactions: number;
  system_alerts: number;
  performance_score: number;
  last_updated: string;
}

export interface DashboardStats {
  total_users: number;
  total_transactions: number;
  errors_24h: number;
  active_users: number;
}
