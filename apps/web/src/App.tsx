import React, { useState, useEffect } from 'react';
import { 
  Home, FileText, FolderLock, CreditCard, HelpCircle, 
  UserCheck, BarChart3, Users, Phone, School, ShieldCheck, 
  MessageSquare, Menu, X, Bell, Sparkles, ChevronRight, LogIn, Award
} from 'lucide-react';

import { Header } from './components/Header';
import { DemoControlPanel } from './components/DemoControlPanel';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { StudentDashboard } from './features/StudentDashboard';
import { DocumentWallet } from './features/DocumentWallet';
import { ApplicationFlow } from './features/ApplicationFlow';
import { EligibilityChecker } from './features/EligibilityChecker';
import { PaymentTracker } from './features/PaymentTracker';
import { OfficerQueue } from './features/OfficerQueue';
import { FamilyView } from './features/FamilyView';
import { MinistryAnalytics } from './features/MinistryAnalytics';
import { SaathiChatbot } from './features/SaathiChatbot';
import { MissedCallDemo } from './features/MissedCallDemo';
import { TeacherAssistedMode } from './features/TeacherAssistedMode';
import { GrievancesView } from './features/GrievancesView';

import { User, StudentProfile, Application, Scheme, DocumentItem, PaymentItem, ReviewQueueItem, UnreachedBeneficiary, NotificationItem, GrievanceItem, DemoPersonaId } from './types';
import { api, setAuthToken, clearAuthToken } from './services/api';

export const App: React.FC = () => {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSaathiOpen, setIsSaathiOpen] = useState(false);
  const [saathiPrompt, setSaathiPrompt] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accessibility & Display settings
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [simpleMode, setSimpleMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  // App Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [officerQueue, setOfficerQueue] = useState<ReviewQueueItem[]>([]);
  const [familyData, setFamilyData] = useState<any | null>(null);
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [coverageData, setCoverageData] = useState<any[]>([]);
  const [unreachedData, setUnreachedData] = useState<UnreachedBeneficiary[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [activePersona, setActivePersona] = useState<DemoPersonaId | null>('student_1');

  // Application flow trigger
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<string>('POST_MATRIC');

  // Initial load
  useEffect(() => {
    handleSelectPersona('student_1');
  }, []);

  // Sync a11y classes to body
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('data-saver', dataSaver);
  }, [highContrast, largeText, dataSaver]);

  const loadAllData = async () => {
    try {
      const [schs, notifs] = await Promise.all([
        api.getSchemes(),
        api.getNotifications()
      ]);
      setSchemes(schs);
      setNotifications(notifs);

      // Load user-specific datasets
      const [stu, apps, docs, pays, grvs] = await Promise.all([
        api.getStudentProfile().catch(() => null),
        api.getMyApplications().catch(() => []),
        api.getMyDocuments().catch(() => []),
        api.getMyPayments().catch(() => []),
        api.getGrievances().catch(() => [])
      ]);

      if (stu) setStudentProfile(stu);
      setApplications(apps);
      setDocuments(docs);
      setPayments(pays);
      setGrievances(grvs);

      // Load analytics and officer queue
      const [ov, cov, unr, anom, queue, fam] = await Promise.all([
        api.getAnalyticsOverview().catch(() => null),
        api.getCoverage().catch(() => []),
        api.getUnreached().catch(() => []),
        api.getAnomalies().catch(() => []),
        api.getOfficerReviews().catch(() => []),
        api.getFamilyChildren().catch(() => null)
      ]);
      setOverviewData(ov);
      setCoverageData(cov);
      setUnreachedData(unr);
      setAnomalies(anom);
      setOfficerQueue(queue);
      setFamilyData(fam);
    } catch (err) {
      console.error("Error loading portal data:", err);
    }
  };

  const handleSelectPersona = async (personaId: DemoPersonaId) => {
    try {
      const res = await api.demoLogin(personaId);
      setAuthToken(res.access_token);
      setCurrentUser(res.user);
      setActivePersona(personaId);

      // Route persona to default screen
      if (personaId === 'officer_1') {
        setActiveTab('officer_queue');
      } else if (personaId === 'admin_1') {
        setActiveTab('analytics');
      } else if (personaId === 'parent_1') {
        setActiveTab('family');
      } else {
        setActiveTab('home');
      }

      await loadAllData();

      // If Persona 5 (Hindi Student), open SAATHI with pre-loaded Hindi query!
      if (personaId === 'hindi_student') {
        setActiveLanguage('hi');
        setSaathiPrompt("मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?");
        setIsSaathiOpen(true);
      }
    } catch (err) {
      console.error("Failed demo login:", err);
    }
  };

  const handleApplyScheme = (code: string) => {
    setSelectedSchemeForApply(code);
    setActiveTab('apply');
  };

  const handleTriggerSaathi = (prompt?: string) => {
    if (prompt) setSaathiPrompt(prompt);
    setIsSaathiOpen(true);
  };

  const handleLogout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setStudentProfile(null);
    setActiveTab('home');
  };

  // Determine current navigation tabs based on Role (Section 7 RBAC & Section 56)
  const isOfficer = currentUser?.role === 'OFFICER';
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'MINISTRY_ANALYST';
  const isParent = currentUser?.role === 'PARENT';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Official Header */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        simpleMode={simpleMode}
        onToggleSimpleMode={() => setSimpleMode(!simpleMode)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        largeText={largeText}
        onToggleLargeText={() => setLargeText(!largeText)}
        dataSaver={dataSaver}
        onToggleDataSaver={() => setDataSaver(!dataSaver)}
        unreadCount={notifications.filter(n => !n.is_read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDemoPanel={() => setIsDemoPanelOpen(true)}
      />

      {/* Main Body with Sidebar / Desktop Navigation */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar (Section 94) */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1 sticky top-20">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              {currentUser ? `${currentUser.role} Workspace` : 'Navigation'}
            </div>

            {/* Student Navigation Items (Section 56) */}
            {!isOfficer && !isAdmin && !isParent && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'home' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Student Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('apply')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'apply' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Apply Scholarship</span>
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'documents' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FolderLock className="w-4 h-4" />
                  <span>Document Wallet</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'payments' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>DBT / Payments</span>
                </button>

                <button
                  onClick={() => setActiveTab('eligibility')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'eligibility' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Eligibility Checker</span>
                </button>

                <button
                  onClick={() => setActiveTab('grievances')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'grievances' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Grievances</span>
                </button>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Inclusivity Tools
                </div>

                <button
                  onClick={() => setActiveTab('sms_simulation')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'sms_simulation' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Missed-Call / SMS</span>
                </button>

                <button
                  onClick={() => setActiveTab('teacher_assisted')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'teacher_assisted' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <School className="w-4 h-4 text-blue-600" />
                  <span>Teacher Assisted</span>
                </button>
              </>
            )}

            {/* Parent Navigation Items */}
            {isParent && (
              <>
                <button
                  onClick={() => setActiveTab('family')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'family' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>My Children</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'payments' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payment History</span>
                </button>
              </>
            )}

            {/* Officer Navigation Items */}
            {isOfficer && (
              <>
                <button
                  onClick={() => setActiveTab('officer_queue')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'officer_queue' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verification Queue</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'analytics' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>District Coverage</span>
                </button>
              </>
            )}

            {/* Admin / Ministry Navigation Items */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'analytics' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>National Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab('officer_queue')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition ${
                    activeTab === 'officer_queue' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Review Tasks</span>
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Main Content View Switcher */}
        <main className="flex-1 min-w-0 pb-16 md:pb-6">
          {activeTab === 'home' && (
            <StudentDashboard
              student={studentProfile}
              applications={applications}
              schemes={schemes}
              onApplyScheme={handleApplyScheme}
              onOpenDocuments={() => setActiveTab('documents')}
              onOpenPayments={() => setActiveTab('payments')}
              onAskSaathi={handleTriggerSaathi}
              simpleMode={simpleMode}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentWallet
              documents={documents}
              onRefresh={loadAllData}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'apply' && (
            <ApplicationFlow
              schemes={schemes}
              student={studentProfile}
              documents={documents}
              initialSchemeCode={selectedSchemeForApply}
              onApplicationCompleted={() => {
                setActiveTab('home');
                loadAllData();
              }}
              onCancel={() => setActiveTab('home')}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'eligibility' && (
            <EligibilityChecker
              onApplyScheme={handleApplyScheme}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentTracker
              payments={payments}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'officer_queue' && (
            <OfficerQueue
              queue={officerQueue}
              onRefresh={loadAllData}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'family' && (
            <FamilyView
              familyData={familyData}
              onSelectChild={(id) => setActiveTab('home')}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'analytics' && (
            <MinistryAnalytics
              overviewData={overviewData}
              coverageData={coverageData}
              unreachedData={unreachedData}
              anomalies={anomalies}
              onRefresh={loadAllData}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'grievances' && (
            <GrievancesView
              grievances={grievances}
              onRefresh={loadAllData}
              onAskSaathi={handleTriggerSaathi}
            />
          )}

          {activeTab === 'sms_simulation' && (
            <MissedCallDemo />
          )}

          {activeTab === 'teacher_assisted' && (
            <TeacherAssistedMode
              onStartAssistedFlow={(apaar) => {
                setActiveTab('apply');
              }}
            />
          )}
        </main>
      </div>

      {/* Persistent SAATHI Floating Button (Section 95) */}
      <button
        onClick={() => handleTriggerSaathi()}
        className="fixed bottom-18 md:bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs py-3 px-4 rounded-full shadow-xl flex items-center space-x-2 border-2 border-white/20 transition-all hover:scale-105"
        title="Open SAATHI AI Scholarship Companion"
      >
        <MessageSquare className="w-4 h-4 text-orange-400" />
        <span>💬 SAATHI</span>
      </button>

      {/* Mobile Bottom Navigation (Section 94) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 flex justify-around text-[10px] font-semibold text-slate-600 shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 ${activeTab === 'home' ? 'text-blue-700 font-bold' : ''}`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex flex-col items-center py-1 ${activeTab === 'apply' ? 'text-blue-700 font-bold' : ''}`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Scholarships</span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex flex-col items-center py-1 ${activeTab === 'documents' ? 'text-blue-700 font-bold' : ''}`}
        >
          <FolderLock className="w-4 h-4 mb-0.5" />
          <span>Documents</span>
        </button>
        <button
          onClick={() => handleTriggerSaathi()}
          className="flex flex-col items-center py-1 text-orange-600 font-bold"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>SAATHI</span>
        </button>
        <button
          onClick={() => setIsDemoPanelOpen(true)}
          className="flex flex-col items-center py-1 text-amber-700 font-bold"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Demo</span>
        </button>
      </nav>

      {/* Slide-in / Drawer Modals */}
      <SaathiChatbot
        isOpen={isSaathiOpen}
        onClose={() => setIsSaathiOpen(false)}
        onOpenApplication={() => setActiveTab('home')}
        onOpenPayment={() => setActiveTab('payments')}
        onOpenDocuments={() => setActiveTab('documents')}
        onOpenGrievance={() => setActiveTab('grievances')}
        onCheckEligibility={() => setActiveTab('eligibility')}
        initialPrompt={saathiPrompt}
      />

      <DemoControlPanel
        isOpen={isDemoPanelOpen}
        onClose={() => setIsDemoPanelOpen(false)}
        onSelectPersona={handleSelectPersona}
        activePersona={activePersona}
        onRefreshData={loadAllData}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onNavigate={(url) => {
          if (url?.includes('payments')) setActiveTab('payments');
          else if (url?.includes('applications')) setActiveTab('home');
          else if (url?.includes('documents')) setActiveTab('documents');
        }}
      />

      {/* Footer (Section 5 & 51) */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-200">
              MargDarshan — Ministry of Tribal Affairs (MoTA)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Developed by Team GravityX • Prototype Mock for Demonstration Purposes. Digital Personal Data Protection (DPDP) Act, 2023 Architecture Aligned.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="hover:text-slate-300">National Scholarship Portal (NSP Mock)</span>
            <span>•</span>
            <span className="hover:text-slate-300">UDISE+ Registry</span>
            <span>•</span>
            <span className="hover:text-slate-300">DigiLocker</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
