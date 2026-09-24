import React, { useState } from 'react';
import { 
  Sparkles, X, User, CheckCircle2, AlertTriangle, Users, 
  ShieldAlert, MessageSquare, Server, RefreshCw, FileText
} from 'lucide-react';
import { DemoPersonaId } from '../types';
import { api } from '../services/api';

interface DemoControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (personaId: DemoPersonaId) => void;
  activePersona: DemoPersonaId | null;
  onRefreshData: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  isOpen,
  onClose,
  onSelectPersona,
  activePersona,
  onRefreshData,
}) => {
  const [adapterMode, setAdapterMode] = useState<string>('NORMAL');
  const [isUpdatingAdapter, setIsUpdatingAdapter] = useState(false);
  const [adapterMsg, setAdapterMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdapterChange = async (mode: string) => {
    setIsUpdatingAdapter(true);
    try {
      await api.simulateAdapter('ALL', mode);
      setAdapterMode(mode);
      setAdapterMsg(`Adapters set to: ${mode}`);
      setTimeout(() => setAdapterMsg(null), 3000);
      onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingAdapter(false);
    }
  };

  const personas = [
    {
      id: 'student_1' as DemoPersonaId,
      title: 'Persona 1 — Clean Post-Matric',
      student: 'Ramesh Kumar (Mayurbhanj, Odisha)',
      scheme: 'Post-Matric Scholarship',
      outcome: 'Auto-verified (94%) & Disbursed (₹18,500)',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Demonstrates end-to-end auto verification across 5 adapters and DBT disbursement pipeline.'
    },
    {
      id: 'student_2' as DemoPersonaId,
      title: 'Persona 2 — Name Mismatch Review',
      student: 'Anita Murmu (Bastar, Chhattisgarh)',
      scheme: 'Pre-Matric Scholarship',
      outcome: 'Flagged 74% -> Officer Review Queue',
      icon: AlertTriangle,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Demonstrates RapidFuzz matching between UDISE+ and submitted name, and human officer review.'
    },
    {
      id: 'parent_1' as DemoPersonaId,
      title: 'Persona 3 — Parent Family View',
      student: 'Sita Devi (Mother of 2 ST students)',
      scheme: 'Family Dashboard',
      outcome: 'Consolidated view of Ramesh & Anita',
      icon: Users,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Single family dashboard tracking multiple children across different schemes & disbursement statuses.'
    },
    {
      id: 'conflict_student' as DemoPersonaId,
      title: 'Persona 4 — Scholarship Conflict',
      student: 'Arjun Hembram (Ranchi, Jharkhand)',
      scheme: 'Post-Matric (Active) -> Applying Top Class',
      outcome: 'Conflict Detection Alert Triggered',
      icon: ShieldAlert,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Demonstrates rule that ST students can only avail 1 scholarship; side-by-side scheme comparison.'
    },
    {
      id: 'hindi_student' as DemoPersonaId,
      title: 'Persona 5 — Hindi SAATHI AI',
      student: 'Meena Baski (Bastar, Chhattisgarh)',
      scheme: 'Post-Matric (Awaiting DBT)',
      outcome: 'Hindi Query: "मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?"',
      icon: MessageSquare,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Demonstrates localized Hindi NLU retrieval and DBT status explanation.'
    },
    {
      id: 'officer_1' as DemoPersonaId,
      title: 'Officer Role — Welfare Officer',
      student: 'Welfare Officer (Bastar / Mayurbhanj)',
      scheme: 'Officer Review Workspace',
      outcome: 'Access verification queue, fuzzy scores & decision tools',
      icon: User,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Review pending exceptions, examine evidence, approve, or request corrections.'
    },
    {
      id: 'admin_1' as DemoPersonaId,
      title: 'Ministry / Admin Role',
      student: 'Ministry Analyst (MoTA New Delhi)',
      scheme: 'National ST Analytics',
      outcome: 'Heatmap, Unreached Beneficiary Engine & Outreach',
      icon: Server,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'District coverage heatmap, unreached student detection from UDISE+, SMS campaigns.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Judges Demo Control Panel</h2>
              <p className="text-xs text-slate-500">
                1-Click Persona Loading & Mock Government API Simulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
          {/* Persona Selection */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Demo Scenario / Role (Section 54 & 105)
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {personas.map((p) => {
                const Icon = p.icon;
                const isSelected = activePersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPersona(p.id);
                      onClose();
                    }}
                    className={`text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${p.badgeColor} border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">{p.title}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{p.student}</p>
                      <p className="text-[11px] text-blue-700 font-semibold">{p.outcome}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{p.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* External Adapter Failure Simulator (Section 43 & 53) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-600" />
                  <span>External Government Source Simulator</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Simulate live UDISE+, DigiLocker, and UIDAI behaviors to show resilient fallback
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => handleAdapterChange('NORMAL')}
                disabled={isUpdatingAdapter}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  adapterMode === 'NORMAL'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ● Normal (Pass)
              </button>
              <button
                onClick={() => handleAdapterChange('MISMATCH')}
                disabled={isUpdatingAdapter}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  adapterMode === 'MISMATCH'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ● Mismatch (Flag)
              </button>
              <button
                onClick={() => handleAdapterChange('UNAVAILABLE')}
                disabled={isUpdatingAdapter}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  adapterMode === 'UNAVAILABLE'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ● Source Offline
              </button>
            </div>

            {adapterMsg && (
              <p className="text-xs text-blue-700 font-semibold mt-2 animate-in fade-in">
                ✓ {adapterMsg}
              </p>
            )}

            <p className="text-[11px] text-slate-500 italic mt-2">
              Notice: When "Source Offline" is active, MargDarshan queues the application for auto-retry and does NOT block or reject the student.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Team GravityX | MoTA Hackathon</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
