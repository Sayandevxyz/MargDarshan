import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowUpRight, 
  HelpCircle, Eye, FileText, UserCheck, MessageSquare, RefreshCw, Sparkles, Building
} from 'lucide-react';
import { ReviewQueueItem } from '../types';
import { api } from '../services/api';

interface OfficerQueueProps {
  queue: ReviewQueueItem[];
  onRefresh: () => void;
  onAskSaathi: (prompt: string) => void;
}

export const OfficerQueue: React.FC<OfficerQueueProps> = ({
  queue,
  onRefresh,
  onAskSaathi,
}) => {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviewDetail, setReviewDetail] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleOpenReview = async (taskId: string) => {
    setSelectedReviewId(taskId);
    setIsLoadingDetail(true);
    try {
      const detail = await api.getOfficerReviewDetail(taskId);
      setReviewDetail(detail);
      setDecisionRemarks('');
    } catch (err) {
      alert("Failed to load review task details.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDecision = async (action: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION' | 'ESCALATE') => {
    if (action === 'REJECT' && !decisionRemarks.trim()) {
      alert("Section 22 Mandate: Remarks are required before rejecting an application.");
      return;
    }

    setIsSubmittingDecision(true);
    try {
      const res = await api.submitOfficerDecision(selectedReviewId!, action, decisionRemarks);
      setFeedbackMsg(`Action '${action}' applied successfully.`);
      setTimeout(() => {
        setFeedbackMsg(null);
        setSelectedReviewId(null);
        setReviewDetail(null);
        onRefresh();
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Failed to submit decision.");
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Officer Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Officer Verification Review Queue</h1>
              <p className="text-xs text-slate-500">
                Welfare Officer Workspace • Review automated exceptions, fuzzy match discrepancies, and manual verification tasks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            {queue.filter(q => q.status === 'PENDING').length} Pending Tasks
          </span>
          <button
            onClick={onRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section 21: Verification Review Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Application</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Issue</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Age</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                    {item.application_no}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.student_name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{item.student_apaar}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {item.issue}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
                      {item.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      item.confidence_val >= 0.90
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.confidence_val >= 0.60
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.confidence}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.age}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenReview(item.id)}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      [Review]
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 22: Officer Review Modal */}
      {selectedReviewId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {isLoadingDetail ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Loading application records & verification evidence...</span>
              </div>
            ) : reviewDetail ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Officer Manual Review
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      Review: {reviewDetail.student.name} ({reviewDetail.application_no})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Reason: <strong className="text-slate-800">{reviewDetail.reason}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReviewId(null)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Section 20 & 22: RapidFuzz Match Explanation Breakdown */}
                {reviewDetail.verification?.evidence?.fuzzy_breakdown && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          RapidFuzz Match Explanation
                        </span>
                      </div>
                      <span className="text-xs font-extrabold bg-blue-700 text-white px-2.5 py-0.5 rounded-full">
                        Overall: {reviewDetail.verification.confidence}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                        <span className="text-slate-500 block text-[10px]">Name Score (40%):</span>
                        <span className="font-extrabold text-blue-900 text-sm">
                          {reviewDetail.verification.evidence.fuzzy_breakdown.name_score}%
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                        <span className="text-slate-500 block text-[10px]">DOB Score (30%):</span>
                        <span className="font-extrabold text-emerald-700 text-sm">
                          {reviewDetail.verification.evidence.fuzzy_breakdown.dob_score}%
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                        <span className="text-slate-500 block text-[10px]">Guardian (15%):</span>
                        <span className="font-extrabold text-blue-900 text-sm">
                          {reviewDetail.verification.evidence.fuzzy_breakdown.guardian_score}%
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                        <span className="text-slate-500 block text-[10px]">Institution (15%):</span>
                        <span className="font-extrabold text-blue-900 text-sm">
                          {reviewDetail.verification.evidence.fuzzy_breakdown.institution_score}%
                        </span>
                      </div>
                    </div>

                    {/* Source Evidence Comparison */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-white rounded-lg p-3 border border-blue-100">
                      <div>
                        <span className="text-slate-500 font-medium">Submitted by Student:</span>
                        <p className="font-bold text-slate-900">{reviewDetail.verification.evidence.fuzzy_details?.submitted_name}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">UDISE+ / Central Registry Record:</span>
                        <p className="font-bold text-blue-800">{reviewDetail.verification.evidence.fuzzy_details?.source_name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Info & Institution Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500">APAAR ID:</span>
                    <p className="font-mono font-bold text-slate-800">{reviewDetail.student.apaar_id}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">District & State:</span>
                    <p className="font-semibold text-slate-800">{reviewDetail.student.district}, {reviewDetail.student.state}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Institution:</span>
                    <p className="font-semibold text-slate-800">{reviewDetail.student.institution}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Community Category:</span>
                    <p className="font-bold text-emerald-800">{reviewDetail.student.category} (Scheduled Tribe)</p>
                  </div>
                </div>

                {/* Section 23: Explainable Decision Remarks Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Officer Decision Remarks (Mandatory before rejection per Section 22):
                  </label>
                  <textarea
                    rows={2}
                    value={decisionRemarks}
                    onChange={(e) => setDecisionRemarks(e.target.value)}
                    placeholder="Enter justification, evidence cross-reference, or reason for rejection/correction..."
                    className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Section 23 Explainable Rejection Notice Preview */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wide text-amber-800">
                    Section 23 Transparency Standard:
                  </span>
                  <p className="text-[11px] text-slate-700">
                    Students will never simply receive a plain "REJECTED" status. If rejected, they receive: <strong>Why this happened</strong> + <strong>What they can do to fix it</strong> + a direct <strong>[Fix Issue]</strong> button.
                  </p>
                </div>

                {feedbackMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
                    ✓ {feedbackMsg}
                  </div>
                )}

                {/* Section 22 Buttons: Approve, Reject, Request Correction, Escalate */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleDecision('ESCALATE')}
                    disabled={isSubmittingDecision}
                    className="px-3.5 py-2 border border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-semibold rounded-xl transition"
                  >
                    Escalate to State
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDecision('REQUEST_CORRECTION')}
                      disabled={isSubmittingDecision}
                      className="px-3.5 py-2 border border-amber-400 text-amber-800 hover:bg-amber-50 text-xs font-semibold rounded-xl transition"
                    >
                      Request Correction
                    </button>

                    <button
                      onClick={() => handleDecision('REJECT')}
                      disabled={isSubmittingDecision}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                    >
                      Reject Application
                    </button>

                    <button
                      onClick={() => handleDecision('APPROVE')}
                      disabled={isSubmittingDecision}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Verification</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
