import React, { useState } from 'react';
import { HelpCircle, PlusCircle, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GrievanceItem } from '../types';
import { api } from '../services/api';

interface GrievancesViewProps {
  grievances: GrievanceItem[];
  onRefresh: () => void;
  onAskSaathi: (prompt: string) => void;
}

export const GrievancesView: React.FC<GrievancesViewProps> = ({
  grievances,
  onRefresh,
  onAskSaathi,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [issueType, setIssueType] = useState('Payment Pending');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    try {
      await api.submitGrievance({ issue_type: issueType, description });
      setDescription('');
      setShowCreateModal(false);
      onRefresh();
    } catch (err) {
      alert("Failed to lodge grievance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Grievance Redressal Center (Section 38)
              </h1>
              <p className="text-xs text-slate-500">
                Lodge formal inquiries to the District Welfare Officer with 48h SLA response.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise New Grievance</span>
        </button>
      </div>

      {/* Grievances List */}
      <div className="space-y-3">
        {grievances.length > 0 ? (
          grievances.map((g) => (
            <div key={g.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {g.ticket_id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{g.issue_type}</h3>
                  <p className="text-xs text-slate-500">Submitted on {g.created_at}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {g.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {g.description}
              </p>
              {g.resolution_remarks && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-bold">Officer Resolution: </span>{g.resolution_remarks}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No grievances filed. Click "Raise New Grievance" or ask SAATHI to create one automatically.
          </div>
        )}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              File a Formal Scholarship Grievance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Directly routed to the designated District / State Welfare Officer.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                >
                  <option value="Payment Pending">Payment Pending / DBT Delay</option>
                  <option value="Verification Delayed">Verification Delayed Beyond SLA</option>
                  <option value="Document Discrepancy">Document Discrepancy / Rejection Appeal</option>
                  <option value="Institution Issue">School / College Attestation Issue</option>
                  <option value="Other">Other Operational Concern</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your issue clearly..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Grievance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
