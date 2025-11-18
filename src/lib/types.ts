export type ThreatEvent = {
  id: string;
  timestamp: string;
  threatType: 'Phishing' | 'Malware' | 'Intrusion' | 'Fraud';
  source: string;
  riskScore: number;
  details: string;
  status: 'Detected' | 'Investigating' | 'Mitigated' | 'Resolved';
  agent: 'Phishing & Malware' | 'Network Anomaly' | 'Fraud Detection';
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type LoggedEvent = {
  id: string;
  timestamp: string;
  agent: string;
  description: string;
};
