export type UserRole = 'STUDENT' | 'PARENT' | 'OFFICER' | 'INSTITUTION' | 'ADMIN' | 'MINISTRY_ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile?: any;
}

export interface StudentProfile {
  id: string;
  apaar_id: string;
  name: string;
  dob: string;
  gender: string;
  category: string;
  state: string;
  district: string;
  mobile: string;
  email?: string;
  language: string;
  current_course: string;
  family_income: number;
  pvtg_status: boolean;
  disability: boolean;
  institution_name: string;
}

export interface Scheme {
  id: string;
  code: 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS';
  name: string;
  description: string;
  target_audience: string;
  academic_level: string;
  max_income?: number;
  benefits_summary: string;
  is_active: boolean;
  rules?: any;
}

export interface StageEvent {
  stage: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FLAGGED' | 'FAILED';
  timestamp: string;
  actor: string;
  remarks: string;
}

export interface Application {
  id: string;
  application_no: string;
  scheme_id: string;
  scheme_code: string;
  scheme_name: string;
  academic_year: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFICATION' | 'ACTION_REQUIRED' | 'UNDER_REVIEW' | 'VERIFIED' | 'SANCTIONED' | 'PAYMENT_PROCESSING' | 'DISBURSED' | 'REJECTED' | 'WITHDRAWN';
  current_stage: string;
  health_score: number;
  deficiency_count: number;
  submitted_at: string;
  stages: StageEvent[];
}

export interface DocumentItem {
  id: string;
  doc_type: string;
  original_filename: string;
  file_size_bytes: number;
  source: string;
  issued_on?: string;
  expires_on?: string;
  document_hash: string;
  is_verified: boolean;
  extracted_data: Record<string, any>;
  created_at: string;
}

export interface PaymentItem {
  id: string;
  application_id: string;
  amount: number;
  academic_year: string;
  dbt_status: 'SANCTIONED' | 'PAYMENT_INITIATED' | 'BANK_PROCESSING' | 'DISBURSED' | 'FAILED';
  utr: string;
  disbursement_date: string;
  account_masked: string;
  pfms_ref: string;
}

export interface ReviewQueueItem {
  id: string;
  application_id: string;
  application_no: string;
  student_name: string;
  student_apaar: string;
  district: string;
  issue: string;
  source: string;
  confidence: string;
  confidence_val: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'PENDING' | 'RESOLVED' | 'ESCALATED';
  age: string;
  created_at: string;
}

export interface UnreachedBeneficiary {
  id: string;
  apaar_id: string;
  name: string;
  dob: string;
  gender: string;
  school_name: string;
  district: string;
  block: string;
  state: string;
  source: string;
  suggested_scheme: string;
  contact_available: boolean;
  suggested_action: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: 'CRITICAL' | 'NORMAL' | 'INFORMATIONAL';
  channel: 'PUSH' | 'SMS' | 'WHATSAPP' | 'EMAIL';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface GrievanceItem {
  id: string;
  ticket_id: string;
  student_id: string;
  issue_type: string;
  description: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLOSED';
  resolution_remarks?: string;
  created_at: string;
  updated_at: string;
}

export type DemoPersonaId = 
  | 'student_1' 
  | 'student_2' 
  | 'parent_1' 
  | 'conflict_student' 
  | 'hindi_student' 
  | 'officer_1' 
  | 'admin_1';
