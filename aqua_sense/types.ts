
export enum UserRole {
  MUNICIPAL_AUTHORITY = 'Municipal Water Authority',
  MAINTENANCE_ENGINEER = 'Maintenance Engineer',
  CONSUMER = 'Residential Consumer'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization: string;
}

export interface SensorData {
  timestamp: string;
  flowRate: number; // L/s
  pressure: number; // Bar
  acousticFreq: number; // Hz
  vibrationLevel: number; // m/s2
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface LeakReport {
  isLeakDetected: boolean;
  riskLevel: RiskLevel;
  confidence: number;
  predictedArea: string;
  analysisSummary: string;
  recommendedAction: string;
  timestamp: string;
}

export interface MaintenanceTicket {
  id: string;
  leakArea: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: RiskLevel;
  createdAt: string;
}
