import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type ThreatEvent = {
  id: string;
  timestamp: string;
  threatType: 'Phishing' | 'Malware' | 'Intrusion' | 'Fraud';
  source: string;
  riskScore: number;
  details: string;
  status: 'Detected' | 'Investigating' | 'Mitigated' | 'Resolved';
  agent: 'Phishing & Malware' | 'Network Anomaly' | 'Fraud Detection' | 'URL Scanner' | 'File Analyzer';
};

export type LoggedEvent = {
  id: string;
  timestamp: string;
  agent: string;
  description: string;
};

export type Incident = {
  id: string;
  threatIds: string[];
  title: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  assignee?: string;
  summary: string;
  createdAt: Timestamp;
};

export type IncidentUpdate = {
  id: string;
  incidentId: string;
  timestamp: Timestamp;
  author: string;
  update: string;
  actionsTaken?: string[];
};
