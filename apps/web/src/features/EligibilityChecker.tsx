import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, 
  HelpCircle, Sparkles, Building, Award, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

interface EligibilityCheckerProps {
  onApplyScheme: (schemeCode: string) => void;
  onAskSaathi: (prompt: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  onApplyScheme,
  onAskSaathi,
}) => {
  const [course, setCourse] = useState('Bachelor of Technology (B.Tech)');
  const [income, setIncome] = useState(140000);
  const [isST, setIsST] = useState(true);
  const [isPVTG, setIsPVTG] = useState(false);
  const [hasNetJrf, setHasNetJrf] = useState(false);
  const [hasForeignAdmission, setHasForeignAdmission] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [hasActiveScholarship, setHasActiveScholarship] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleRunCheck = async () => {
    setIsLoading(true);
    try {
      const res = await api.checkEligibility({
        current_class_or_course: course,
        family_income: Number(income),
        st_category: isST,
        is_pvtg: isPVTG,
        has_net_jrf: hasNetJrf,
        has_foreign_admission: hasForeignAdmission,
        has_disability: hasDisability,
        has_active_scholarship: hasActiveScholarship
      });
      setResult(res);
    } catch (err: any) {
      alert("Eligibility check failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-1">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Which Scholarship Can I Apply For?
            </h1>
            <p className="text-xs text-slate-500">
              Interactive MoTA Eligibility Advisor with automatic conflict detection.
            </p>
          </div>
        </div>
      </div>

      {/* Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Applicant Profile Details
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Class / Course of Study
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
              >
                <option value="Class 9">Class 9 (Secondary)</option>
                <option value="Class 10">Class 10 (Secondary)</option>
                <option value="Class 11 Science">Class 11 (Higher Secondary)</option>
                <option value="Class 12 Arts">Class 12 (Higher Secondary)</option>
                <option value="Bachelor of Arts (B.A.)">Bachelor of Arts (B.A.)</option>
                <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech - Premier IIT/NIT)</option>
                <option value="Ph.D. Research">Ph.D. Research (Doctoral)</option>
                <option value="Master of Science Overseas">Master's Degree (Overseas University)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Annual Family Income (from all sources): ₹{income.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="30000"
                max="900000"
                step="10000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹30,000</span>
                <span>₹2,50,000 (Pre/Post Limit)</span>
                <span>₹6,00,000 (Top Class)</span>
                <span>₹8,00,000+ (NOS)</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isST}
                  onChange={(e) => setIsST(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium">Belong to Scheduled Tribe (ST)</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPVTG}
                  onChange={(e) => setIsPVTG(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium">PVTG Community Member</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNetJrf}
                  onChange={(e) => setHasNetJrf(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium">Qualified UGC-NET / JRF</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasForeignAdmission}
                  onChange={(e) => setHasForeignAdmission(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium">Admitted to Foreign Univ</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg cursor-pointer sm:col-span-2">
                <input
                  type="checkbox"
                  checked={hasActiveScholarship}
                  onChange={(e) => setHasActiveScholarship(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium">Currently receiving an active Central / State Scholarship</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleRunCheck}
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            <span>Evaluate Scheme Eligibility</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="space-y-4">
          {result ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Section 25 Conflict Alert */}
              {result.has_conflict && result.conflict_details && (
                <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-purple-900 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-purple-700" />
                    <span>Section 25: Multi-Scholarship Conflict Notice</span>
                  </p>
                  <p className="text-purple-800">
                    You currently have: <strong>{result.conflict_details.current_scheme}</strong>. Under government rules, a student can only avail one scholarship at a time.
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {result.conflict_details.key_differences}
                  </p>
                </div>
              )}

              {/* Section 24 Disclaimer */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{result.disclaimer}</span>
              </div>

              {/* Eligible Schemes List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Potentially Applicable Schemes ({result.eligible_schemes.length})
                </h3>

                {result.eligible_schemes.map((s: any) => (
                  <div key={s.scheme_code} className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-slate-900">{s.scheme_name}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{s.estimated_benefit}</p>
                    </div>
                    <button
                      onClick={() => onApplyScheme(s.scheme_code)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap ml-3 transition"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}

                {result.ineligible_schemes.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Ineligible Schemes
                    </p>
                    <div className="space-y-2">
                      {result.ineligible_schemes.map((s: any) => (
                        <div key={s.scheme_code} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <span className="font-semibold text-slate-700">{s.scheme_name}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{s.reasons.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Enter your academic details</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click "Evaluate Scheme Eligibility" to view personalized Central MoTA scholarship matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
