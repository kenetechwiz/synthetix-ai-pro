export type NavPage = 'dashboard' | 'agents' | 'analytics' | 'settings';

export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface ActivityLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  agentName: string;
  message: string;
  latencyMs: number;
  tokens?: number;
}

export type AgentStatus = 'active' | 'paused';

export interface AIAgent {
  id: string;
  name: string;
  codeName: string;
  version: string;
  family: string;
  status: AgentStatus;
  uptime: string;
  requestsServed: number;
  errorRate: number;
  avgLatencyMs: number;
  temperature: number;
  maxTokens: number;
  description: string;
  role: string;
  badgeColor: string;
}

export type EndpointPriority = 'all' | 'high' | 'errors';

export interface ApiEndpointTelemetry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  priority: 'high' | 'normal' | 'critical';
  requests24h: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  errorRate: number; // percentage, e.g. 0.12%
  status: 'healthy' | 'degraded' | 'alert';
}

export interface UserSettings {
  profileName: string;
  email: string;
  organization: string;
  role: string;
  notifyOnSpikes: boolean;
  notifyOnErrors: boolean;
  dailyDigest: boolean;
  rateLimitPerMin: number;
  environment: 'production' | 'staging' | 'development';
}

export interface ApiKeyData {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
