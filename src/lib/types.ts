export type ThreatEvent = {
  id: string;
  timestamp: string;
  threatType: 'Phishing' | 'Malware' | 'Intrusion' | 'Fraud';
  source: string;
  riskScore: number;
  details: string;
  status: 'Detected' | 'Investigating' | 'Mitigated' | 'Resolved';
  agent: 'Phishing & Malware' | 'Network Anomaly' | 'Incident Response' | 'Fraud Detection';
};

export type User = {
  id: string;
  name: string;
  email: string;
};
