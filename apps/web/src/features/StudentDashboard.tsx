import React from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, 
  FileText, ExternalLink, Zap, HelpCircle, ChevronRight, Sparkles, Building, Award
} from 'lucide-react';
import { StudentProfile, Application, Scheme } from '../types';
import { getTranslation } from '../utils/i18n';

interface StudentDashboardProps {
  student: StudentProfile | null;
  applications: Application[];
  schemes: Scheme[];
  onApplyScheme: (schemeCode: string) => void;
  onOpenDocuments: () => void;
  onOpenPayments: () => void;
  onAskSaathi: (prompt?: string) => void;
  simpleMode: boolean;
  activeLanguage?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  applications,
  schemes,
  onApplyScheme,
  onOpenDocuments,
  onOpenPayments,
  onAskSaathi,
  simpleMode,
  activeLanguage = 'en',
}) => {
  const t = getTranslation(activeLanguage);
  const currentApp = applications.length > 0 ? applications[0] : null;

  // Determine health score and pending action state
  const healthScore = currentApp ? currentApp.health_score : 87;
  const isActionRequired = currentApp?.status === 'ACTION_REQUIRED' || currentApp?.status === 'UNDER_REVIEW';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Headline (Section 10) */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium mb-2">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>Ministry of Tribal Affairs | ST Welfare Portal</span>
            </span>
            <h1 className={`${simpleMode ? 'text-3xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight`}>
              {t.goodMorning}, {student?.name || 'Rahul'} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              APAAR ID: <span className="font-mono text-orange-300">{student?.apaar_id || 'APAAR-2026-DEMO-001'}</span> | {student?.district || 'Mayurbhanj'}, {student?.state || 'Odisha'}
            </p>
          </div>

          {/* Quick Stats or Health Badge */}
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15">
            <div>
              <p className="text-xs text-slate-300 font-medium">{t.scholarshipHealth}</p>
              <p className="text-2xl font-black text-emerald-400">{healthScore}/100</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-500/20 text-xs font-bold text-emerald-300">
              {healthScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Current Scholarship Card & Section 13 Pending Action Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Current Active Scholarship & Visual Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Scholarship Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Current Scholarship (2026–27)
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {currentApp?.scheme_name || 'Post-Matric Scholarship for ST Students'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Application No: <span className="font-mono font-medium text-slate-700">{currentApp?.application_no || 'APP-DEMO-2026-00191'}</span>
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                currentApp?.status === 'DISBURSED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentApp?.status === 'UNDER_REVIEW'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : currentApp?.status === 'ACTION_REQUIRED'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {currentApp?.status || 'VERIFIED'}
              </span>
            </div>

            {/* Verification Progress Tracker */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Verification & Cross-Check Progress</span>
                <span className="text-blue-700 font-bold">
                  {currentApp?.status === 'DISBURSED' || currentApp?.status === 'VERIFIED' ? '5/5 completed' : '3/5 completed'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentApp?.status === 'DISBURSED' || currentApp?.status === 'VERIFIED'
                      ? 'w-full bg-emerald-500'
                      : 'w-3/5 bg-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Section 12 Visual Timeline */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Application Journey Timeline
              </h3>

              <div className="relative border-l-2 border-slate-200 ml-3 space-y-5 pl-5">
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px]">✓</div>
                  <p className="text-xs font-bold text-slate-900">Application Submitted</p>
                  <p className="text-[11px] text-slate-500">24 Aug 2026 • Student Portal</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px]">✓</div>
                  <p className="text-xs font-bold text-slate-900">Identity & Demographic Verified</p>
                  <p className="text-[11px] text-slate-500">24 Aug 2026 • UIDAI & APAAR Gateway</p>
                </div>

                <div className="relative">
                  {currentApp?.status === 'UNDER_REVIEW' || currentApp?.status === 'ACTION_REQUIRED' ? (
                    <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center text-white text-[10px]">⚠</div>
                  ) : (
                    <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px]">✓</div>
                  )}
                  <p className="text-xs font-bold text-slate-900">
                    {currentApp?.status === 'UNDER_REVIEW' 
                      ? 'Demographic Variation Pending Review' 
                      : currentApp?.status === 'ACTION_REQUIRED'
                      ? 'Income Certificate Pending Correction'
                      : 'Document & Caste Certificate Verified'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentApp?.status === 'UNDER_REVIEW' 
                      ? '74% match • Forwarded to Welfare Officer' 
                      : 'DigiLocker & State e-District'}
                  </p>
                </div>

                <div className="relative">
                  <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full ring-4 flex items-center justify-center text-white text-[10px] ${
                    currentApp?.status === 'DISBURSED' || currentApp?.status === 'SANCTIONED'
                      ? 'bg-emerald-500 ring-emerald-100'
                      : 'bg-slate-300 ring-slate-100'
                  }`}>
                    {currentApp?.status === 'DISBURSED' || currentApp?.status === 'SANCTIONED' ? '✓' : '○'}
                  </div>
                  <p className="text-xs font-bold text-slate-900">Sanction Approved</p>
                  <p className="text-[11px] text-slate-500">
                    {currentApp?.status === 'DISBURSED' || currentApp?.status === 'SANCTIONED'
                      ? 'Sanction Order #SANC-2026-9921'
                      : 'Awaiting completion of previous step'}
                  </p>
                </div>

                <div className="relative">
                  <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full ring-4 flex items-center justify-center text-white text-[10px] ${
                    currentApp?.status === 'DISBURSED'
                      ? 'bg-emerald-500 ring-emerald-100'
                      : 'bg-slate-300 ring-slate-100'
                  }`}>
                    {currentApp?.status === 'DISBURSED' ? '✓' : '○'}
                  </div>
                  <p className="text-xs font-bold text-slate-900">Direct Benefit Transfer (DBT)</p>
                  <p className="text-[11px] text-slate-500">
                    {currentApp?.status === 'DISBURSED'
                      ? '₹18,500 credited via PFMS • UTR: DEMO-UTR-98214'
                      : 'Scheduled upon sanction'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Section 13 Pending Action Engine & Quick Tools */}
        <div className="space-y-6">
          {/* Section 13: Pending Action Engine Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pending Action Engine
              </h3>
            </div>

            {isActionRequired ? (
              <div className="mt-4 space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-900">What is wrong?</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Your income certificate expired on 31 March 2026.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-800">Why does it matter?</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    A valid current financial year income certificate is mandatory to confirm non-creamy eligibility.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-900">What should the student do?</p>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Upload a valid 2026-27 income certificate from Tehsildar or e-District.
                  </p>
                </div>

                <div className="pt-2 flex flex-col space-y-2">
                  <button
                    onClick={onOpenDocuments}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                  >
                    <span>Fix now: Upload Document</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onAskSaathi("How do I update my expired income certificate?")}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Need help? Ask SAATHI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">You're all caught up!</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  No action is required on your scholarship profile at this time. All verified credentials are up to date.
                </p>
                <button
                  onClick={onOpenPayments}
                  className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                >
                  <span>View Payment History</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Assistance Banner with SAATHI */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">🤖</span>
              <div>
                <h4 className="text-xs font-bold text-blue-900">SAATHI Assistant</h4>
                <p className="text-[11px] text-blue-700">Always available for scholarship queries</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask questions about eligibility, payment dates, or document requirements in English or Hindi.
            </p>
            <button
              onClick={() => onAskSaathi("Why is my scholarship payment pending?")}
              className="mt-3 w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-1"
            >
              <span>Ask: "Why is my payment pending?"</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 11 & 58: Five MoTA Scheme Cards */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Explore Ministry of Tribal Affairs (MoTA) Scholarships
            </h2>
            <p className="text-xs text-slate-500">
              All 5 Central schemes for Scheduled Tribe students available in one unified dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <div 
              key={scheme.code} 
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {scheme.academic_level}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Scheme"></span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3">
                  {scheme.name}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center text-slate-600">
                    <span className="font-semibold text-slate-800 w-24">Income Limit:</span>
                    <span>{scheme.max_income ? `Up to ₹${(scheme.max_income / 100000).toFixed(1)} Lakhs/yr` : 'No ceiling'}</span>
                  </div>
                  <div className="flex items-start text-slate-600">
                    <span className="font-semibold text-slate-800 w-24 shrink-0">Main Benefit:</span>
                    <span className="text-emerald-700 font-medium line-clamp-1">{scheme.benefits_summary}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onAskSaathi(`Tell me more about ${scheme.name}`)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Learn more
                </button>
                <button
                  onClick={() => onApplyScheme(scheme.code)}
                  className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition flex items-center space-x-1"
                >
                  <span>Apply / Check</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
