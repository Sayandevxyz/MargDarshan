const BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('margdarshan_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('margdarshan_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('margdarshan_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Request failed';
    try {
      const err = await response.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (identifier: string) => request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  }),
  verifyOtp: (identifier: string, otp: string) => request<any>('/auth/otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp })
  }),
  demoLogin: (persona_id: string) => request<any>('/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ persona_id })
  }),

  // Student
  getStudentProfile: () => request<any>('/students/me'),
  getMyApplications: () => request<any[]>('/students/me/applications'),
  getMyDocuments: () => request<any[]>('/students/me/documents'),
  getMyPayments: () => request<any[]>('/students/me/payments'),
  getHealthScore: () => request<any>('/students/me/health-score'),
  giveConsent: () => request<any>('/students/me/consent', { method: 'POST' }),

  // Applications
  createApplication: (data: { scheme_code: string; academic_year?: string; documents_to_reuse?: string[] }) =>
    request<any>('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getApplicationDetails: (id: string) => request<any>(`/applications/${id}`),
  getDelayPrediction: (id: string) => request<any>(`/applications/${id}/predictive-delay`),

  // Documents
  uploadDocument: (formData: FormData) => {
    const token = getAuthToken();
    return fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    });
  },
  checkQuality: (data: { blur_score?: number; is_cropped?: boolean; is_empty?: boolean }) => {
    const fd = new FormData();
    if (data.blur_score !== undefined) fd.append('blur_score', String(data.blur_score));
    if (data.is_cropped !== undefined) fd.append('is_cropped', String(data.is_cropped));
    if (data.is_empty !== undefined) fd.append('is_empty', String(data.is_empty));
    return fetch(`${BASE_URL}/documents/quality-check`, { method: 'POST', body: fd }).then(r => r.json());
  },
  verifyDocument: (id: string) => request<any>(`/documents/${id}/verify`, { method: 'POST' }),

  // Verification & Orchestrator
  getVerificationStatus: (appId: string) => request<any>(`/verification/${appId}`),
  runVerification: (application_id: string) => request<any>('/verification/run', {
    method: 'POST',
    body: JSON.stringify({ application_id })
  }),

  // Officer
  getOfficerReviews: () => request<any[]>('/officer/reviews'),
  getOfficerReviewDetail: (id: string) => request<any>(`/officer/reviews/${id}`),
  submitOfficerDecision: (id: string, action: string, remarks: string) =>
    request<any>(`/officer/reviews/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ action, remarks })
    }),

  // Analytics
  getAnalyticsOverview: () => request<any>('/analytics/overview'),
  getCoverage: () => request<any[]>('/analytics/coverage'),
  getUnreached: () => request<any[]>('/beneficiaries/unreached'),
  getAnomalies: () => request<any[]>('/analytics/anomalies'),
  getAuditLogs: () => request<any[]>('/analytics/audit-logs'),
  createOutreach: (title: string, district: string, block: string, count: number) =>
    request<any>('/analytics/outreach', {
      method: 'POST',
      body: JSON.stringify({ title, district, block, count })
    }),

  // SAATHI Chat
  sendChatMessage: (message: string, language: string = 'en') =>
    request<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language })
    }),

  // Public / Utils
  getSchemes: () => request<any[]>('/schemes'),
  checkEligibility: (data: any) => request<any>('/eligibility/check', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getFamilyChildren: () => request<any>('/family/my-children'),
  checkSmsStatus: (application_no: string) => request<any>('/sms/status', {
    method: 'POST',
    body: JSON.stringify({ application_no })
  }),
  simulateAdapter: (source_name: string, mode: string) =>
    request<any>('/demo/simulate-adapter', {
      method: 'POST',
      body: JSON.stringify({ source_name, mode })
    }),
  getNotifications: () => request<any[]>('/notifications'),
  getGrievances: () => request<any[]>('/grievances'),
  submitGrievance: (data: { issue_type: string; description: string }) =>
    request<any>('/grievances', { method: 'POST', body: JSON.stringify(data) }),
  checkHealth: () => request<any>('/health'),
};
