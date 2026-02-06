
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

export interface AssetMetadata {
  assetId: string;
  zone: string;
  installedYear: string;
  materialType: string;
  lastInspection: string;
}

export interface AIDiagnosis {
  leakProbability: number;
  vibrationAnomaly: string;
  pressureDeviation: string;
  acousticSignature: string;
}

export interface TimelineEntry {
  id: string;
  status: string;
  timestamp: string;
  description: string;
}

export interface MaintenanceTicket {
  id: string;
  leakArea: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Scheduled' | 'Overdue';
  priority: RiskLevel;
  createdAt: string;
  dueDate?: string;
  issueType?: string;
  assetMetadata?: AssetMetadata;
  aiDiagnosis?: AIDiagnosis;
  timeline?: TimelineEntry[];
}

export interface PredictiveAlert {
  id: string;
  assetId: string;
  location: string;
  severity: RiskLevel;
  confidence: number;
  etaToFailure: string;
  issueType: string;
}

export interface AssetHealth {
  name: string;
  type: string;
  healthScore: number;
  status: string;
}

export interface ConsumptionTrend {
  date: string;
  North: number;
  South: number;
  East: number;
  West: number;
}

export interface ZoneBillingData {
  id: string;
  name: string;
  suppliedVolume: number;
  billedVolume: number;
  revenue: number;
  population: number;
  leakageLossEstimate: number;
}
