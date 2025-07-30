export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  incident_type: 'phishing' | 'malware' | 'data_breach' | 'unauthorized_access' | 'suspicious_activity' | 'other';
  description: string;
  date_occurred: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  reporter_id: string;
  reporter_name: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  file_attachments?: string[];
  admin_notes?: string;
}

export interface AuditLog {
  id: string;
  incident_id: string;
  action: string;
  performed_by: string;
  details: string;
  timestamp: string;
}