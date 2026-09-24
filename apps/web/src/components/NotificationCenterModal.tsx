import React, { useState } from 'react';
import { Bell, X, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNavigate: (url?: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'NORMAL' | 'INFORMATIONAL'>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filter === 'ALL') return true;
    return n.priority === filter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notification Center</h2>
              <p className="text-xs text-slate-500">Actionable timeline alerts across Push, SMS & WhatsApp</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority Filter Tabs (Section 96) */}
        <div className="flex space-x-1.5 pt-3 pb-2 text-xs font-semibold">
          {(['ALL', 'CRITICAL', 'NORMAL', 'INFORMATIONAL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg border transition ${
                filter === tab
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 py-2 space-y-2.5 pr-1">
          {filtered.length > 0 ? (
            filtered.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.action_url) {
                    onNavigate(n.action_url);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                  n.priority === 'CRITICAL'
                    ? 'bg-rose-50/60 border-rose-200 hover:bg-rose-100/50'
                    : n.priority === 'NORMAL'
                    ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-100/40'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    n.priority === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : n.priority === 'NORMAL'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {n.priority} • {n.channel}
                  </span>
                  <span className="text-[10px] text-slate-400">{n.created_at}</span>
                </div>
                <h4 className="font-bold text-slate-900">{n.title}</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No notifications matching selected priority filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
