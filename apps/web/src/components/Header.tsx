import React, { useState } from 'react';
import { 
  Bell, Globe, Eye, Zap, Volume2, ShieldCheck, UserCheck, 
  Sparkles, LogOut, CheckCircle, ChevronDown, Layers
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  activeLanguage: string;
  onLanguageChange: (lang: string) => void;
  simpleMode: boolean;
  onToggleSimpleMode: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  largeText: boolean;
  onToggleLargeText: () => void;
  dataSaver: boolean;
  onToggleDataSaver: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenDemoPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  activeLanguage,
  onLanguageChange,
  simpleMode,
  onToggleSimpleMode,
  highContrast,
  onToggleHighContrast,
  largeText,
  onToggleLargeText,
  dataSaver,
  onToggleDataSaver,
  unreadCount,
  onOpenNotifications,
  onOpenDemoPanel,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [a11yMenuOpen, setA11yMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', active: true },
    { code: 'hi', name: 'हिन्दी (Hindi)', active: true },
    { code: 'bn', name: 'বাংলা (Bengali)', active: false },
    { code: 'ta', name: 'தமிழ் (Tamil)', active: false },
    { code: 'gondi', name: 'गोंडी (Gondi)', active: false },
    { code: 'santali', name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)', active: false },
    { code: 'bhili', name: 'भीली (Bhili)', active: false },
  ];

  const handleSelectLang = (code: string, isActive: boolean) => {
    if (!isActive) {
      alert("This language is currently being added. Please continue in English or Hindi.");
      return;
    }
    onLanguageChange(code);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-colors duration-200">
      {/* Official Government of India Top Strip */}
      <div className="bg-[#0b1d3a] text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>भारत सरकार | Government of India</span>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300 font-medium">जनजाति कार्य मंत्रालय | Ministry of Tribal Affairs (MoTA)</span>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          {/* Subtle Demo Mode Badge (Section 73) */}
          <button
            onClick={onOpenDemoPanel}
            className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-semibold transition"
            title="Click to toggle judges demo control panel"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DEMO MODE</span>
          </button>

          {/* Low Bandwidth Data Saver Indicator */}
          {dataSaver && (
            <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1">
              <Zap className="w-2.5 h-2.5" />
              <span>Data Saver ON</span>
            </span>
          )}

          <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">Team GravityX</span>
        </div>
      </div>

      {/* Main Navigation Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Emblem Motif */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white font-bold shadow-md border border-blue-800">
            <span className="text-xl text-orange-400">MD</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Marg<span className="text-orange-600">Darshan</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                Unified Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {activeLanguage === 'hi' 
                ? 'एक मंच। प्रत्येक छात्रवृत्ति यात्रा।'
                : 'One student. One dashboard. One scholarship journey.'}
            </p>
          </div>
        </div>

        {/* Right Action Icons: Language, Accessibility, Notifications, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Accessibility Settings Dropdown (Section 47 & 82) */}
          <div className="relative">
            <button
              onClick={() => setA11yMenuOpen(!a11yMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition border border-slate-200 flex items-center space-x-1"
              title="Accessibility & Display Settings"
              aria-label="Accessibility options"
            >
              <Eye className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-medium hidden md:inline">Accessibility</span>
            </button>

            {a11yMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                  Accessibility & UX Options
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <label className="flex items-center justify-between cursor-pointer p-1 hover:bg-slate-50 rounded">
                    <div>
                      <p className="font-semibold text-slate-900">Simple Mode</p>
                      <p className="text-[11px] text-slate-500">Larger buttons & simplified copy</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={simpleMode}
                      onChange={onToggleSimpleMode}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-1 hover:bg-slate-50 rounded">
                    <div>
                      <p className="font-semibold text-slate-900">High Contrast</p>
                      <p className="text-[11px] text-slate-500">Enhanced border visibility</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={onToggleHighContrast}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-1 hover:bg-slate-50 rounded">
                    <div>
                      <p className="font-semibold text-slate-900">Large Text</p>
                      <p className="text-[11px] text-slate-500">Increase base text size (+15%)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={largeText}
                      onChange={onToggleLargeText}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-1 hover:bg-slate-50 rounded">
                    <div>
                      <p className="font-semibold text-slate-900">Low-Bandwidth Mode</p>
                      <p className="text-[11px] text-slate-500">Disable animations, save mobile data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={dataSaver}
                      onChange={onToggleDataSaver}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector (Section 9 & 34) */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition border border-slate-200 flex items-center space-x-1.5"
              title="Select Language"
              aria-label="Language selection"
            >
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold">
                {activeLanguage === 'hi' ? 'हिन्दी' : 'English'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Supported Languages
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLang(l.code, l.active)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      activeLanguage === l.code ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.name}</span>
                    {l.active ? (
                      activeLanguage === l.code && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded">Soon</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell (Section 36 & 61) */}
          <button
            onClick={onOpenNotifications}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition border border-slate-200 relative"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* User Profile Badge or Login */}
          {user ? (
            <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] text-blue-600 font-medium capitalize">{user.role.toLowerCase()}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenDemoPanel}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
