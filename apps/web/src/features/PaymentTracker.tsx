import React from 'react';
import { 
  CreditCard, CheckCircle2, Clock, AlertCircle, ArrowUpRight, 
  ShieldCheck, HelpCircle, Download, ExternalLink, Sparkles
} from 'lucide-react';
import { PaymentItem } from '../types';

interface PaymentTrackerProps {
  payments: PaymentItem[];
  onAskSaathi: (prompt: string) => void;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  payments,
  onAskSaathi,
}) => {
  const currentPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Direct Benefit Transfer (DBT) Tracker</h1>
              <p className="text-xs text-slate-500">
                Aadhaar-seeded bank account tracking powered by PFMS integration architecture.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onAskSaathi("Why is my scholarship payment pending?")}
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ask SAATHI about Payments</span>
        </button>
      </div>

      {/* Section 26: Main Payment Detail Card */}
      {currentPayment ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Academic Year {currentPayment.academic_year}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                ₹{currentPayment.amount.toLocaleString('en-IN')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Account: <strong className="text-slate-800 font-mono">{currentPayment.account_masked}</strong> (Aadhaar Seeded)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>DBT: {currentPayment.dbt_status}</span>
              </span>
            </div>
          </div>

          {/* Section 26: Visual Payment Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Disbursement Processing Pipeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl relative">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">✓</div>
                <p className="text-xs font-bold text-slate-900">Sanctioned</p>
                <p className="text-[11px] text-slate-500">Order #SANC-2026-9921</p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl relative">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">✓</div>
                <p className="text-xs font-bold text-slate-900">Payment Initiated</p>
                <p className="text-[11px] text-slate-500">PFMS Ref: {currentPayment.pfms_ref}</p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl relative">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">✓</div>
                <p className="text-xs font-bold text-slate-900">Bank Processing</p>
                <p className="text-[11px] text-slate-500">NPCI Aadhaar Bridge (ABPS)</p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl relative">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">✓</div>
                <p className="text-xs font-bold text-slate-900">DBT Credited</p>
                <p className="text-[11px] text-slate-500">Credited on {currentPayment.disbursement_date}</p>
              </div>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Unique Transaction Ref (UTR):</span>
              <span className="font-mono font-bold text-slate-900">{currentPayment.utr}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Disbursement Date:</span>
              <span className="font-semibold text-slate-800">{currentPayment.disbursement_date}</span>
            </div>
            <div>
              <span className="text-slate-500 block">PFMS Status:</span>
              <span className="font-semibold text-emerald-700">Settled & Confirmed</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No disbursements recorded yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Disbursements are initiated after successful verification and sanction by your District Welfare Officer.
          </p>
        </div>
      )}
    </div>
  );
};
