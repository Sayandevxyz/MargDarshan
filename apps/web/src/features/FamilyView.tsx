import React from 'react';
import { 
  Users, CheckCircle2, AlertTriangle, ArrowRight, Wallet, 
  Calendar, ShieldCheck, FileText, ChevronRight, HelpCircle
} from 'lucide-react';

interface FamilyViewProps {
  familyData: any | null;
  onSelectChild: (studentId: string) => void;
  onAskSaathi: (prompt: string) => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  familyData,
  onSelectChild,
  onAskSaathi,
}) => {
  const children = familyData?.children || [
    {
      student_id: 'p1',
      name: 'Ramesh Kumar',
      apaar_id: 'APAAR-2026-DEMO-001',
      class: 'B.Sc. Computer Science',
      relationship: 'Mother',
      application: {
        application_no: 'APP-DEMO-2026-00191',
        scheme_name: 'Post-Matric Scholarship',
        status: 'DISBURSED',
        current_stage: 'Scholarship Disbursed',
        health_score: 94,
        pending_action: 'None'
      },
      payment: {
        amount: '₹18,500',
        status: 'DISBURSED',
        utr: 'DEMO-UTR-98214'
      }
    },
    {
      student_id: 'p2',
      name: 'Anita Murmu',
      apaar_id: 'APAAR-2026-DEMO-002',
      class: 'Class 10',
      relationship: 'Mother',
      application: {
        application_no: 'APP-DEMO-2026-00192',
        scheme_name: 'Pre-Matric Scholarship',
        status: 'UNDER_REVIEW',
        current_stage: 'Officer Verification Review',
        health_score: 68,
        pending_action: 'Upload updated income certificate'
      },
      payment: {
        amount: '₹0',
        status: 'Pending Verification',
        utr: 'N/A'
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="p-1.5 bg-white/20 rounded-lg text-orange-300">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
              Parent & Family Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Family Portal: {familyData?.parent_name || 'Sita Devi'}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Consolidated overview of all children linked to your household. Track multiple scholarships simultaneously.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-right">
          <p className="text-[11px] text-slate-300">Linked Students</p>
          <p className="text-xl font-extrabold text-white">{children.length} Children</p>
        </div>
      </div>

      {/* Children Cards List (Section 27) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child: any) => {
          const isDisbursed = child.application?.status === 'DISBURSED';
          const isFlagged = child.application?.status === 'UNDER_REVIEW' || child.application?.status === 'ACTION_REQUIRED';

          return (
            <div 
              key={child.student_id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
            >
              <div>
                {/* Child Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {child.relationship || 'Ward'} • {child.class}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {child.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      {child.apaar_id}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 ${
                    isDisbursed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isFlagged
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {isDisbursed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ Disbursed</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{child.application.status}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Scheme & Stage */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Enrolled Scheme:</span>
                    <span className="font-bold text-slate-900">{child.application.scheme_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stage:</span>
                    <span className="font-semibold text-blue-800">{child.application.current_stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scholarship Health:</span>
                    <span className="font-bold text-emerald-700">{child.application.health_score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Disbursed Amount:</span>
                    <span className="font-extrabold text-slate-900">{child.payment.amount}</span>
                  </div>
                </div>

                {/* Pending Action Box */}
                {child.application.pending_action && child.application.pending_action !== 'None' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-amber-900 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending Action:</span>
                    </p>
                    <p className="text-amber-800">{child.application.pending_action}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onAskSaathi(`What is the payment status of ${child.name}?`)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask SAATHI about {child.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => onSelectChild(child.student_id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
