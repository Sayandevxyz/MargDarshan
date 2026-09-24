import React, { useState } from 'react';
import { Phone, MessageSquare, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const MissedCallDemo: React.FC = () => {
  const [appNo, setAppNo] = useState('APP-DEMO-2026-00192');
  const [response, setResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const res = await api.checkSmsStatus(appNo);
      setResponse(res);
    } catch (err) {
      alert("SMS service simulation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-1">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Section 84: Missed-Call & SMS Status Simulation
            </h1>
            <p className="text-xs text-slate-500">
              Inclusivity feature: Demonstrates offline access for students and parents without smartphones or data connectivity.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Enter Demo Application ID or Mobile:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={appNo}
              onChange={(e) => setAppNo(e.target.value)}
              placeholder="e.g. APP-DEMO-2026-00192"
              className="flex-1 text-xs border border-slate-300 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCheck}
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              [Check Status]
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Simulates a missed-call or toll-free SMS trigger: <strong>Toll-free SMS: 1800-MOTA-MD (1800-6682-63)</strong>
          </p>
        </div>

        {/* SMS Phone Screen Simulation */}
        {response && (
          <div className="mt-4 p-5 bg-slate-900 text-slate-100 rounded-2xl shadow-xl max-w-sm mx-auto border-4 border-slate-700 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
              <span>SMS from: MD-GOVIND</span>
              <span>SIM 1</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-emerald-400 space-y-1.5">
              <p className="font-bold text-white">MargDarshan SMS Gateway:</p>
              <p>Scheme: <strong>{response.scheme_name}</strong></p>
              <p>Stage: <strong>{response.stage}</strong></p>
              <p>Next Action: <strong>{response.next_action}</strong></p>
            </div>

            <p className="text-[10px] text-slate-400 text-center pt-1">
              Delivered in under 3 seconds via National SMS Gateway
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
