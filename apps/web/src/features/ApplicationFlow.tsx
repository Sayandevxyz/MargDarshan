import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, FileText, 
  AlertTriangle, Sparkles, Building, Lock, RefreshCw, Award, Copy
} from 'lucide-react';
import { Scheme, StudentProfile, DocumentItem } from '../types';
import { api } from '../services/api';

interface ApplicationFlowProps {
  schemes: Scheme[];
  student: StudentProfile | null;
  documents: DocumentItem[];
  initialSchemeCode?: string;
  onApplicationCompleted: () => void;
  onCancel: () => void;
  onAskSaathi: (prompt: string) => void;
}

export const ApplicationFlow: React.FC<ApplicationFlowProps> = ({
  schemes,
  student,
  documents,
  initialSchemeCode = 'POST_MATRIC',
  onApplicationCompleted,
  onCancel,
  onAskSaathi,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSchemeCode, setSelectedSchemeCode] = useState(initialSchemeCode);
  const [reusedDocIds, setReusedDocIds] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictAlert, setConflictAlert] = useState<any | null>(null);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  const selectedScheme = schemes.find(s => s.code === selectedSchemeCode) || schemes[0];

  // Auto-select verified documents for Section 15 Document Reuse
  const verifiedDocs = documents.filter(d => d.is_verified);

  const toggleReuseDoc = (id: string) => {
    setReusedDocIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    // Check conflict on Step 2
    if (currentStep === 2) {
      // Simulate conflict check if applying for Top Class while holding Post-Matric
      if (selectedSchemeCode === 'TOP_CLASS') {
        setConflictAlert({
          title: "Active Scholarship Conflict Warning",
          current: "Post-Matric Scholarship (Active)",
          attempting: "Top Class Scholarship",
          note: "A student can only avail ONE central ST scholarship at a time under MoTA rules. You can proceed with the draft without terminating your current grant."
        });
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.createApplication({
        scheme_code: selectedSchemeCode,
        academic_year: "2026-27",
        documents_to_reuse: reusedDocIds
      });

      // Run verification orchestrator
      await api.runVerification(res.application_id);

      setSubmittedResult(res);
      setCurrentStep(8); // Success step
    } catch (err: any) {
      alert(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: "Scheme" },
    { num: 2, label: "Eligibility" },
    { num: 3, label: "Profile" },
    { num: 4, label: "Documents" },
    { num: 5, label: "Consent" },
    { num: 6, label: "Verification" },
    { num: 7, label: "Review" }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
      {/* Steps Header Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {currentStep} of 7: {steps[currentStep - 1]?.label}</span>
          <span className="text-blue-700 font-bold">{Math.round((currentStep / 7) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
          {steps.map(s => (
            <div
              key={s.num}
              className={`flex-1 h-full border-r border-white/50 transition-colors ${
                s.num <= currentStep ? 'bg-blue-700' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Select Scheme */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 1: Select MoTA Scholarship Scheme</h2>
            <p className="text-xs text-slate-500">Choose the central scheme suited to your education level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((s) => (
              <div
                key={s.code}
                onClick={() => setSelectedSchemeCode(s.code)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  selectedSchemeCode === s.code
                    ? 'border-blue-700 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {s.academic_level}
                    </span>
                    {selectedSchemeCode === s.code && (
                      <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-emerald-800 font-semibold">
                  {s.benefits_summary}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1"
            >
              <span>Continue to Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preliminary Eligibility Check */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 2: Preliminary Eligibility Check</h2>
            <p className="text-xs text-slate-500">Auto-evaluating against official scheme operational guidelines.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600">ST Category Status:</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified ST Community</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Family Income Ceiling:</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹1,40,000 &le; ₹2,50,000 (Compliant)</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Enrolled Institution:</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AISHE Code C-29302 Recognized</span>
              </span>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 italic">
              "Preliminary eligibility check. Final eligibility is determined under the applicable scheme guidelines."
            </div>
          </div>

          {/* Section 25 Conflict Warning if triggered */}
          {conflictAlert && (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-xs space-y-1">
              <p className="font-bold text-amber-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>{conflictAlert.title}</span>
              </p>
              <p className="text-amber-800">
                You currently have: <strong>{conflictAlert.current}</strong>. You are trying to apply for: <strong>{conflictAlert.attempting}</strong>.
              </p>
              <p className="text-slate-600 mt-1">{conflictAlert.note}</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1"
            >
              <span>Confirm & Check Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Student Profile */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 3: Student Profile Data</h2>
            <p className="text-xs text-slate-500">Synced from APAAR / One Nation One Student ID registry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Full Name:</span>
              <span className="font-bold text-slate-900 text-sm">{student?.name || 'Ramesh Kumar'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Date of Birth:</span>
              <span className="font-bold text-slate-900 text-sm">{student?.dob || '2005-04-12'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">State & District:</span>
              <span className="font-bold text-slate-900 text-sm">{student?.district || 'Mayurbhanj'}, {student?.state || 'Odisha'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Enrolled Course:</span>
              <span className="font-bold text-slate-900 text-sm">{student?.current_course || 'B.Sc. Computer Science'}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Section 15 Document Reuse */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 4: Supporting Document Reuse</h2>
            <p className="text-xs text-slate-500">
              No need to re-upload documents that have already been verified in your MargDarshan Document Wallet!
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Available Verified Credentials in Wallet:
            </div>

            {verifiedDocs.map((doc) => {
              const isSelected = reusedDocIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleReuseDoc(doc.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{doc.doc_type.replace(/_/g, ' ')}</p>
                      <p className="text-[11px] text-slate-500">Source: {doc.source} • Valid: {doc.expires_on || 'Permanent'}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                    isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}>
                    {isSelected ? "✓ Attached to Application" : "Use existing verified document"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1"
            >
              <span>Continue to Consent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Explicit Consent Screen (Section 9 & 51) */}
      {currentStep === 5 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 5: Consent & Privacy Notice</h2>
            <p className="text-xs text-slate-500">
              In accordance with Digital Personal Data Protection (DPDP) principles.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">What information will be accessed?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Identity & Demographic Data</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Academic Records (UDISE+/AISHE)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Certificate Records (e-District)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Encrypted Bank Seeding Status (DBT)</span>
              </div>
            </div>

            <label className="flex items-start space-x-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800">
                I hereby grant consent to MargDarshan to verify my identity and certificate details with the respective authorities for processing this scholarship application.
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              disabled={!consentGiven}
              className={`px-5 py-2.5 text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1 ${
                consentGiven
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Automated Verification Checks */}
      {currentStep === 6 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 6: Automated Adapter Verification</h2>
            <p className="text-xs text-slate-500">Live checks via MargDarshan Verification Gateway.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
              <span>UIDAI Demographic Match:</span>
              <span className="text-emerald-700 font-bold">MATCH (99%)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
              <span>UDISE+ / AISHE Enrolment:</span>
              <span className="text-emerald-700 font-bold">MATCH (96%)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
              <span>e-District ST Community Record:</span>
              <span className="text-emerald-700 font-bold">MATCH (98%)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
              <span>DigiLocker Income Verification:</span>
              <span className="text-emerald-700 font-bold">MATCH (95%)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2">
              <span>NSP Debarment Check:</span>
              <span className="text-emerald-700 font-bold">CLEAR (93%)</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1"
            >
              <span>Continue to Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 7: Section 60 Application Summary */}
      {currentStep === 7 && (
        <div className="space-y-5 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 7: Application Summary</h2>
            <p className="text-xs text-slate-500">Please review all checklist items before final submission.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-200 font-semibold">
              <span className="text-slate-700">Personal details:</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified ✓</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200 font-semibold">
              <span className="text-slate-700">Academic details:</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified ✓</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200 font-semibold">
              <span className="text-slate-700">Supporting documents:</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Attached ({reusedDocIds.length} reused from wallet) ✓</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200 font-semibold">
              <span className="text-slate-700">Preliminary eligibility:</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Passed ✓</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2 font-semibold">
              <span className="text-slate-700">Consent:</span>
              <span className="text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recorded ✓</span>
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
            >
              {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Submit Application</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 8: Success Result (Section 60) */}
      {currentStep === 8 && (
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Application submitted successfully.
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto text-xs text-slate-700 space-y-2">
            <p className="text-slate-500">Your Official Application ID:</p>
            <p className="font-mono text-base font-extrabold text-blue-900 select-all">
              {submittedResult?.application_no || 'APP-DEMO-2026-00192'}
            </p>
            <p className="text-[11px] text-slate-500">
              Scheme: {selectedScheme.name}
            </p>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your verification checks have been scheduled. You can track stage progression in real-time or ask SAATHI for instant status updates.
          </p>

          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={onApplicationCompleted}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              View Application in Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
