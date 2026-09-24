import React, { useState } from 'react';
import { 
  Bell, Globe, Eye, Zap, Volume2, ShieldCheck, UserCheck, 
  Sparkles, LogOut, CheckCircle, ChevronDown, Layers
} from 'lucide-react';
import { User } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n';

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

  const t = getTranslation(activeLanguage);
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === activeLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSelectLang = (code: string) => {
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
            <span>{t.govIndia}</span>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300 font-medium">{t.mota}</span>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          {/* Subtle Demo Mode Badge (Section 73) */}
          <button
            onClick={onOpenDemoPanel}
            className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-semibold transition"
            title="Click to toggle judges demo control panel"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t.demoMode}</span>
          </button>

          {/* Low Bandwidth Data Saver Indicator */}
          {dataSaver && (
            <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1">
              <Zap className="w-2.5 h-2.5" />
              <span>{t.dataSaverOn}</span>
            </span>
          )}

          <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">Team GravityX</span>
        </div>
      </div>

      {/* Main Navigation Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Official MargDarshan App Logo */}
          <div className="relative group">
            <img 
              src="/logo.png" 
              alt="MargDarshan Logo" 
              className="w-11 h-11 rounded-2xl shadow-md border border-slate-200/80 object-cover bg-white p-0.5 hover:scale-105 transition-transform duration-200" 
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Marg<span className="text-orange-600">Darshan</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {t.unifiedPortal}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.tagline}
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
              title={t.accessibility}
              aria-label={t.accessibility}
            >
              <Eye className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-medium hidden md:inline">{t.accessibility}</span>
            </button>

            {a11yMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                  {t.accessibility}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <label className="flex items-center justify-between cursor-pointer p-1 hover:bg-slate-50 rounded">
                    <div>
                      <p className="font-semibold text-slate-900">{t.simpleMode}</p>
                      <p className="text-[11px] text-slate-500">{t.simpleModeDesc}</p>
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
                      <p className="font-semibold text-slate-900">{t.highContrast}</p>
                      <p className="text-[11px] text-slate-500">{t.highContrastDesc}</p>
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
                      <p className="font-semibold text-slate-900">{t.largeText}</p>
                      <p className="text-[11px] text-slate-500">{t.largeTextDesc}</p>
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
                      <p className="font-semibold text-slate-900">{t.lowBandwidth}</p>
                      <p className="text-[11px] text-slate-500">{t.lowBandwidthDesc}</p>
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
              title={t.supportedLanguages}
              aria-label={t.supportedLanguages}
            >
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold">
                {currentLang.nativeName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  {t.supportedLanguages}
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLang(l.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      activeLanguage === l.code ? 'font-bold text-blue-700 bg-blue-50/70' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.nativeName}</span>
                    {activeLanguage === l.code && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
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
