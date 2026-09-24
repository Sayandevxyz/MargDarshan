import React, { useState } from 'react';
import { School, UserCheck, ShieldCheck, Key, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface TeacherAssistedModeProps {
  onStartAssistedFlow: (studentApaar: string) => void;
}

export const TeacherAssistedMode: React.FC<TeacherAssistedModeProps> = ({
  onStartAssistedFlow,
}) => {
  const [teacherId, setTeacherId] = useState('TEA-OD-MAYUR-4921');
  const [studentApaar, setStudentApaar] = useState('APAAR-2026-DEMO-002');
  const [tempOtp, setTempOtp] = useState('');
  const [sessionActive, setSessionActive] = useState(false);

  const handleAuthorize = () => {
    if (tempOtp === '123456' || tempOtp === '000000') {
      setSessionActive(true);
    } else {
      alert("Please enter student demo authorization OTP: 123456");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-1">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Section 83: School & Teacher Assisted Application Mode
            </h1>
            <p className="text-xs text-slate-500">
              Empowering tribal school teachers and headmasters to assist students while enforcing temporary zero-trust consent.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
          <p className="font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Section 83 Privacy Guardrail:</span>
          </p>
          <p className="text-slate-600">
            A teacher can assist a student in completing an application. However, the teacher does NOT automatically gain permanent access to the student's private identity records. A temporary 15-minute consent session is generated.
          </p>
        </div>

        {!sessionActive ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teacher / Master AISHE ID</label>
              <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student APAAR ID to Assist</label>
              <input
                type="text"
                value={studentApaar}
                onChange={(e) => setStudentApaar(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student Consent OTP (Demo: 123456)
              </label>
              <input
                type="text"
                value={tempOtp}
                onChange={(e) => setTempOtp(e.target.value)}
                placeholder="Enter 123456"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono"
              />
            </div>

            <button
              onClick={handleAuthorize}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Authorize Temporary Assistance Session</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-900">
                Temporary Assisted Session Active (Valid for 15 minutes)
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Assisting Student: <strong>Anita Murmu (APAAR-2026-DEMO-002)</strong>
              </p>
            </div>
            <button
              onClick={() => onStartAssistedFlow(studentApaar)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              Proceed to Application Draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
