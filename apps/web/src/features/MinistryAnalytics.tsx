import React, { useState } from 'react';
import { 
  BarChart3, MapPin, Users, Send, ShieldAlert, AlertTriangle, 
  CheckCircle2, Sparkles, TrendingUp, Building, ArrowUpRight, Search, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { UnreachedBeneficiary } from '../types';
import { api } from '../services/api';

interface MinistryAnalyticsProps {
  overviewData: any | null;
  coverageData: any[];
  unreachedData: UnreachedBeneficiary[];
  anomalies: any[];
  onRefresh: () => void;
  onAskSaathi: (prompt: string) => void;
}

export const MinistryAnalytics: React.FC<MinistryAnalyticsProps> = ({
  overviewData,
  coverageData,
  unreachedData,
  anomalies,
  onRefresh,
  onAskSaathi,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [targetBlock, setTargetBlock] = useState('Tribal Block 1');
  const [campaignTitle, setCampaignTitle] = useState('Pre-Matric School Outreach Drive 2026');
  const [isDispatching, setIsDispatching] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState<string | null>(null);

  const kpis = overviewData?.kpis || {
    total_enrolled_st_students: 450,
    scholarship_applicants: 350,
    total_applications: 350,
    verified: 290,
    flagged_for_review: 45,
    sanctioned: 265,
    disbursed: 240,
    unreached_beneficiaries: 100
  };

  const projections = overviewData?.performance_projections || {
    auto_verification_rate: '84.6%',
    manual_review_rate: '15.4%',
    average_verification_time: '2.4 days',
    document_reuse_rate: '71.2%',
    chatbot_resolution_rate: '88.5%'
  };

  // Scheme Breakdown Chart Data
  const schemeChartData = [
    { name: 'Pre-Matric', count: 120, fill: '#1d4ed8' },
    { name: 'Post-Matric', count: 155, fill: '#0d7a57' },
    { name: 'Top Class', count: 45, fill: '#ea580c' },
    { name: 'NFST', count: 20, fill: '#7c3aed' },
    { name: 'NOS', count: 10, fill: '#0891b2' },
  ];

  const handleLaunchCampaign = async () => {
    setIsDispatching(true);
    try {
      const res = await api.createOutreach(campaignTitle, selectedDistrict === 'All' ? 'Bastar' : selectedDistrict, targetBlock, 50);
      setCampaignSuccess(res.message);
      setTimeout(() => {
        setCampaignSuccess(null);
        setCampaignModalOpen(false);
        onRefresh();
      }, 2000);
    } catch (err: any) {
      alert("Failed to create campaign.");
    } finally {
      setIsDispatching(false);
    }
  };

  const filteredUnreached = unreachedData.filter(u => {
    const matchesDist = selectedDistrict === 'All' || u.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.apaar_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDist && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Ministry of Tribal Affairs — National ST Analytics
              </h1>
              <p className="text-xs text-slate-500">
                Consolidated scholarship coverage, unreached beneficiary detection, and verification operations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCampaignModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Launch Outreach Campaign</span>
          </button>
        </div>
      </div>

      {/* Section 40: Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enrolled ST</p>
          <p className="text-lg font-black text-slate-900 mt-1">{kpis.total_enrolled_st_students}</p>
          <span className="text-[10px] text-slate-400">UDISE+ / AISHE</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applicants</p>
          <p className="text-lg font-black text-blue-700 mt-1">{kpis.scholarship_applicants}</p>
          <span className="text-[10px] text-blue-500">77.7% Participation</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Auto-Verified</p>
          <p className="text-lg font-black text-emerald-700 mt-1">{kpis.verified}</p>
          <span className="text-[10px] text-emerald-600">Conf &ge; 90%</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Flagged/Review</p>
          <p className="text-lg font-black text-amber-700 mt-1">{kpis.flagged_for_review}</p>
          <span className="text-[10px] text-amber-600">Officer Queue</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sanctioned</p>
          <p className="text-lg font-black text-indigo-700 mt-1">{kpis.sanctioned}</p>
          <span className="text-[10px] text-indigo-500">State Approved</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disbursed (DBT)</p>
          <p className="text-lg font-black text-emerald-800 mt-1">{kpis.disbursed}</p>
          <span className="text-[10px] text-emerald-600">₹44.8L Paid</span>
        </div>
        <div className="bg-orange-50 p-3.5 rounded-xl border border-orange-200 shadow-sm">
          <p className="text-[10px] font-bold text-orange-900 uppercase tracking-wider">Unreached ST</p>
          <p className="text-lg font-black text-orange-700 mt-1">{kpis.unreached_beneficiaries}</p>
          <span className="text-[10px] text-orange-600 font-semibold">Priority Gap</span>
        </div>
      </div>

      {/* Impact & Performance Metrics (Section 66 & 97) */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center space-x-1.5 text-orange-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Operational Impact & Efficiency Projections
            </span>
          </div>
          <span className="text-[10px] text-slate-300 italic">
            *Synthetic benchmark projection for demonstration
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div>
            <p className="text-slate-400 text-[11px]">Auto-Verification Rate</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{projections.auto_verification_rate}</p>
            <p className="text-[10px] text-slate-300">Passing &ge; 90% threshold</p>
          </div>
          <div>
            <p className="text-slate-400 text-[11px]">Manual Review Rate</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">{projections.manual_review_rate}</p>
            <p className="text-[10px] text-slate-300">Fuzzy score 60-89%</p>
          </div>
          <div>
            <p className="text-slate-400 text-[11px]">Avg Processing SLA</p>
            <p className="text-xl font-black text-white mt-0.5">{projections.average_verification_time}</p>
            <p className="text-[10px] text-slate-300">Down from 28+ days</p>
          </div>
          <div>
            <p className="text-slate-400 text-[11px]">Document Reuse Rate</p>
            <p className="text-xl font-black text-orange-400 mt-0.5">{projections.document_reuse_rate}</p>
            <p className="text-[10px] text-slate-300">Saved repetitive re-uploads</p>
          </div>
          <div>
            <p className="text-slate-400 text-[11px]">SAATHI Resolution</p>
            <p className="text-xl font-black text-blue-300 mt-0.5">{projections.chatbot_resolution_rate}</p>
            <p className="text-[10px] text-slate-300">Without human escalation</p>
          </div>
        </div>
      </div>

      {/* Grid: Section 41 Heatmap & Section 43 Fraud/Anomaly Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Section 41 Interactive District Coverage Heatmap */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Section 41: District Scholarship Coverage Heatmap</span>
              </h2>
              <p className="text-xs text-slate-500">
                Comparison of enrolled ST students against active scholarship claims
              </p>
            </div>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Districts</option>
              <option value="Bastar">Bastar (Chhattisgarh)</option>
              <option value="Mayurbhanj">Mayurbhanj (Odisha)</option>
              <option value="Ranchi">Ranchi (Jharkhand)</option>
              <option value="Koraput">Koraput (Odisha)</option>
              <option value="Gadchiroli">Gadchiroli (Maharashtra)</option>
            </select>
          </div>

          {/* District Bars */}
          <div className="mt-5 space-y-4">
            {coverageData.map((d) => (
              <div 
                key={d.district}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/70 transition"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span>{d.district} ({d.state})</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      d.risk === 'High' ? 'bg-rose-100 text-rose-800' : d.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {d.risk} Outreach Priority
                    </span>
                  </div>
                  <span className="text-slate-900 font-extrabold">{d.coverage_pct}% Coverage</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      d.coverage_pct < 50 ? 'bg-rose-500' : d.coverage_pct < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${d.coverage_pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Enrolled: {d.enrolled}</span>
                  <span>Scholarship Applicants: {d.applicants}</span>
                  <span className="font-semibold text-orange-700">Unreached: {d.enrolled - d.applicants}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Section 43 Fraud / Anomaly Detection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Section 43: Anomaly Engine
              </h3>
              <p className="text-[11px] text-slate-500">Duplicate hash & repeat certificate cross-check</p>
            </div>
          </div>

          <div className="space-y-3">
            {anomalies.map((a, i) => (
              <div key={i} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                    <span>{a.label || 'Potential anomaly'}</span>
                  </span>
                  <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                    Risk: {a.risk}
                  </span>
                </div>
                <p className="text-slate-700 text-xs">{a.reason}</p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Action: {a.action}</span>
                  <span className="text-slate-400 italic">Prototype Heuristic</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 39 & 42: Unreached Beneficiary Detection & Outreach List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-700" />
              <span>Section 39 & 42: Unreached Beneficiary Detection List</span>
            </h2>
            <p className="text-xs text-slate-500">
              Students identified in UDISE+ school registries with <strong>NO</strong> active scholarship application.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search unreached student or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">APAAR ID</th>
                <th className="py-3 px-3">School Name (UDISE+)</th>
                <th className="py-3 px-3">District / Block</th>
                <th className="py-3 px-3">Suggested Scheme</th>
                <th className="py-3 px-3 text-right">Outreach Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnreached.slice(0, 10).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {u.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {u.apaar_id}
                  </td>
                  <td className="py-3 px-3 text-slate-800">
                    {u.school_name}
                  </td>
                  <td className="py-3 px-3">
                    {u.district} • {u.block}
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-800">
                    {u.suggested_scheme}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setTargetBlock(u.block);
                        setCampaignModalOpen(true);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-2.5 py-1 rounded-lg shadow-sm transition"
                    >
                      Simulate SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outreach Campaign Modal (Section 42: Simulate SMS) */}
      {campaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Create Outreach Campaign (Section 42)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dispatches multi-lingual push alerts and SMS simulation to unreached ST students.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target District</label>
                <input
                  type="text"
                  value={selectedDistrict === 'All' ? 'Bastar' : selectedDistrict}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Block</label>
                <input
                  type="text"
                  value={targetBlock}
                  onChange={(e) => setTargetBlock(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-800">Simulated SMS Preview:</span>
                <p className="text-slate-600 italic">
                  "[MargDarshan / MoTA] Dear Student, you are eligible for the Pre-Matric ST Scholarship. Visit your school headmaster or margdarshan.gov.in to claim your grant."
                </p>
              </div>

              {campaignSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold">
                  ✓ {campaignSuccess}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setCampaignModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchCampaign}
                disabled={isDispatching}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1"
              >
                {isDispatching && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Send SMS Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
