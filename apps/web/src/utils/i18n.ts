export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (Hindi)', speechCode: 'hi-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bengali)', speechCode: 'bn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)', speechCode: 'ta-IN' },
  { code: 'gondi', name: 'Gondi', nativeName: 'गोंडी (Gondi)', speechCode: 'hi-IN' },
  { code: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)', speechCode: 'hi-IN' },
  { code: 'bhili', name: 'Bhili', nativeName: 'भीली (Bhili)', speechCode: 'hi-IN' },
];

export interface QuickActionItem {
  label: string;
  action: string;
}

export interface TranslationBundle {
  // Top Strip
  govIndia: string;
  mota: string;
  demoMode: string;
  dataSaverOn: string;
  
  // Brand Header
  unifiedPortal: string;
  tagline: string;
  accessibility: string;
  supportedLanguages: string;
  
  // Accessibility Dropdown
  simpleMode: string;
  simpleModeDesc: string;
  highContrast: string;
  highContrastDesc: string;
  largeText: string;
  largeTextDesc: string;
  lowBandwidth: string;
  lowBandwidthDesc: string;

  // Sidebar / Navigation
  studentDashboard: string;
  applyScholarship: string;
  documentWallet: string;
  payments: string;
  eligibilityChecker: string;
  grievances: string;
  missedCall: string;
  teacherAssisted: string;
  myChildren: string;
  paymentHistory: string;
  verificationQueue: string;
  districtCoverage: string;
  nationalAnalytics: string;
  inclusivityTools: string;
  
  // Floating Button & Quick UI
  askSaathi: string;
  logout: string;
  home: string;
  apply: string;
  wallet: string;
  pay: string;
  notifications: string;

  // Dashboard greeting & headers
  goodMorning: string;
  scholarshipHealth: string;
  actionRequired: string;
  allClear: string;
  activeApplications: string;
  totalSanctioned: string;
  digiLockerVerified: string;

  // SAATHI Chatbot
  saathiGreeting: string;
  saathiPlaceholder: string;
  saathiQuickActions: QuickActionItem[];
}

export const TRANSLATIONS: Record<string, TranslationBundle> = {
  en: {
    govIndia: 'Government of India | भारत सरकार',
    mota: 'Ministry of Tribal Affairs (MoTA) | जनजाति कार्य मंत्रालय',
    demoMode: 'DEMO MODE',
    dataSaverOn: 'Data Saver ON',
    unifiedPortal: 'Unified Portal',
    tagline: 'One student. One dashboard. One scholarship journey.',
    accessibility: 'Accessibility & Display',
    supportedLanguages: 'Supported Languages',
    simpleMode: 'Simple View',
    simpleModeDesc: 'Larger buttons & simplified cards',
    highContrast: 'High Contrast',
    highContrastDesc: 'Enhanced border visibility',
    largeText: 'Large Text',
    largeTextDesc: 'Increase base text size (+15%)',
    lowBandwidth: 'Low-Bandwidth Mode',
    lowBandwidthDesc: 'Disable animations, save mobile data',
    studentDashboard: 'Student Dashboard',
    applyScholarship: 'Apply Scholarship',
    documentWallet: 'Document Wallet',
    payments: 'DBT / Payments',
    eligibilityChecker: 'Eligibility Checker',
    grievances: 'Grievances & Help',
    missedCall: 'Missed-Call / SMS',
    teacherAssisted: 'Teacher Assisted',
    myChildren: 'My Children',
    paymentHistory: 'Payment History',
    verificationQueue: 'Verification Queue',
    districtCoverage: 'District Coverage',
    nationalAnalytics: 'National Analytics',
    inclusivityTools: 'Inclusivity Tools',
    askSaathi: 'Ask SAATHI AI',
    logout: 'Logout',
    home: 'Home',
    apply: 'Apply',
    wallet: 'Wallet',
    pay: 'Payments',
    notifications: 'Notifications',
    goodMorning: 'Good morning',
    scholarshipHealth: 'Scholarship Health',
    actionRequired: 'Action Required',
    allClear: 'All Clear',
    activeApplications: 'Active Applications',
    totalSanctioned: 'Total Sanctioned',
    digiLockerVerified: 'DigiLocker Verified',
    saathiGreeting: "Namaste! I am **SAATHI**, your scholarship assistance companion for Ministry of Tribal Affairs (MoTA) schemes.\n\nHow can I guide your scholarship journey today?",
    saathiPlaceholder: 'Ask in English, Hindi, Bengali, Tamil, Santali...',
    saathiQuickActions: [
      { label: "Why is my payment pending?", action: "PAYMENT_QUERY" },
      { label: "Application Status", action: "APP_STATUS" },
      { label: "Which scholarship can I apply for?", action: "CHECK_ELIGIBILITY" },
      { label: "Document Verification Status", action: "DOC_QUERY" }
    ]
  },

  bn: {
    govIndia: 'ভারত সরকার | Government of India',
    mota: 'জনজাতি বিষয়ক মন্ত্রালয় (MoTA) | Ministry of Tribal Affairs',
    demoMode: 'ডেমো মোড',
    dataSaverOn: 'ডাটা সেভার চালু',
    unifiedPortal: 'সমন্বিত পোর্টাল',
    tagline: 'এক ছাত্র। এক ড্যাশবোর্ড। এক স্কলারশিপ যাত্রা।',
    accessibility: 'অ্যাক্সেসিবিলিটি ও ডিসপ্লে সেটিংস',
    supportedLanguages: 'সমর্থিত ভাষাসমূহ',
    simpleMode: 'সহজ রূপ (Simple View)',
    simpleModeDesc: 'বড় বোতাম এবং সরলীকৃত কার্ড',
    highContrast: 'উচ্চ বৈসাদৃশ্য (High Contrast)',
    highContrastDesc: 'উন্নত দৃশ্যমানতা এবং স্পষ্ট বর্ডার',
    largeText: 'বড় ফন্ট (Large Text)',
    largeTextDesc: 'বেস ফন্ট সাইজ বৃদ্ধি (+১৫%)',
    lowBandwidth: 'কম ব্যান্ডউইথ মোড (Low Data)',
    lowBandwidthDesc: 'অ্যানিমেশন বন্ধ করে ডাটা বাঁচান',
    studentDashboard: 'শিক্ষার্থী ড্যাশবোর্ড',
    applyScholarship: 'স্কলারশিপ আবেদন',
    documentWallet: 'নথিপত্র ওয়ালেট',
    payments: 'ডিবিটি / পেমেন্ট ট্র্যাকার',
    eligibilityChecker: 'যোগ্যতা যাচাইকরণ',
    grievances: 'অভিযোগ ও সহায়তা',
    missedCall: 'মিসড-কল / এসএমএস সেবা',
    teacherAssisted: 'শিক্ষক সহায়তা মোড',
    myChildren: 'আমার সন্তানরা',
    paymentHistory: 'পেমেন্ট ইতিহাস',
    verificationQueue: 'যাচাইকরণ সারি',
    districtCoverage: 'জেলা কভারেজ',
    nationalAnalytics: 'জাতীয় অ্যানালিটিক্স',
    inclusivityTools: 'অন্তর্ভুক্তিমূলক টুলস',
    askSaathi: 'সাথী AI কে জিজ্ঞাসা করুন',
    logout: 'লগআউট',
    home: 'হোম',
    apply: 'আবেদন',
    wallet: 'ওয়ালেট',
    pay: 'পেমেন্ট',
    notifications: 'বিজ্ঞপ্তি',
    goodMorning: 'সুপ্রভাত',
    scholarshipHealth: 'স্কলারশিপ স্বাস্থ্য',
    actionRequired: 'পদক্ষেপ প্রয়োজন',
    allClear: 'সব ঠিক আছে',
    activeApplications: 'সক্রিয় আবেদনসমূহ',
    totalSanctioned: 'মোট মঞ্জুরীকৃত',
    digiLockerVerified: 'ডিজিলকার যাচাইকৃত',
    saathiGreeting: "নমস্কার! আমি **সাথী (SAATHI)**, জনজাতি বিষয়ক মন্ত্রকের (MoTA) স্কলারশিপ সহায়তা সঙ্গী।\n\nআজ আমি আপনার স্কলারশিপ যাত্রায় কীভাবে সাহায্য করতে পারি?",
    saathiPlaceholder: 'বাংলা, হিন্দি বা ইংরেজিতে প্রশ্ন জিজ্ঞাসা করুন...',
    saathiQuickActions: [
      { label: "আমার স্কলারশিপ পেমেন্ট কেন বাকি?", action: "PAYMENT_QUERY" },
      { label: "আবেদনের বর্তমান স্থিতি", action: "APP_STATUS" },
      { label: "আমি কোন স্কলারশিপ পেতে পারি?", action: "CHECK_ELIGIBILITY" },
      { label: "নথিপত্র যাচাইকরণ স্থিতি", action: "DOC_QUERY" }
    ]
  },

  hi: {
    govIndia: 'भारत सरकार | Government of India',
    mota: 'जनजाति कार्य मंत्रालय (MoTA) | Ministry of Tribal Affairs',
    demoMode: 'डेमो मोड',
    dataSaverOn: 'डेटा सेवर चालू',
    unifiedPortal: 'एकीकृत पोर्टल',
    tagline: 'एक छात्र। एक डैशबोर्ड। एक छात्रवृत्ति यात्रा।',
    accessibility: 'अभिगम्यता एवं प्रदर्शन सेटिंग्स',
    supportedLanguages: 'समर्थित भाषाएं',
    simpleMode: 'सरल दृश्य (Simple View)',
    simpleModeDesc: 'बड़े बटन और सरल कार्ड',
    highContrast: 'उच्च कंट्रास्ट (High Contrast)',
    highContrastDesc: 'स्पष्ट सीमाएं और बेहतर दृश्यता',
    largeText: 'बड़ा पाठ (Large Text)',
    largeTextDesc: 'टेक्स्ट का आकार बढ़ाएं (+15%)',
    lowBandwidth: 'कम डेटा मोड (Low Bandwidth)',
    lowBandwidthDesc: 'एनीमेशन बंद करें, डेटा बचाएं',
    studentDashboard: 'छात्र डैशबोर्ड',
    applyScholarship: 'छात्रवृत्ति आवेदन',
    documentWallet: 'दस्तावेज़ वॉलेट',
    payments: 'डीबीटी / भुगतान स्थिति',
    eligibilityChecker: 'पात्रता जांच',
    grievances: 'शिकायत निवारण',
    missedCall: 'मिस्ड-कॉल / एसएमएस सेवा',
    teacherAssisted: 'शिक्षक सहायता मोड',
    myChildren: 'मेरे बच्चे',
    paymentHistory: 'भुगतान इतिहास',
    verificationQueue: 'सत्यापन कतार',
    districtCoverage: 'ज़िला कवरेज',
    nationalAnalytics: 'राष्ट्रीय विश्लेषण',
    inclusivityTools: 'समावेशी उपकरण',
    askSaathi: 'साथी AI से पूछें',
    logout: 'लॉगआउट',
    home: 'होम',
    apply: 'आवेदन',
    wallet: 'वॉलेट',
    pay: 'भुगतान',
    notifications: 'सूचनाएं',
    goodMorning: 'सुप्रभात',
    scholarshipHealth: 'छात्रवृत्ति स्वास्थ्य',
    actionRequired: 'कार्रवाई आवश्यक',
    allClear: 'सब ठीक है',
    activeApplications: 'सक्रिय आवेदन',
    totalSanctioned: 'कुल स्वीकृत राशि',
    digiLockerVerified: 'डिजिलॉकर सत्यापित',
    saathiGreeting: "नमस्ते! मैं **साथी (SAATHI)** हूँ, जनजाति कार्य मंत्रालय (MoTA) की छात्रवृत्ति योजनाओं के लिए आपका डिजिटल सहायक।\n\nआज मैं आपकी छात्रवृत्ति यात्रा में क्या सहायता कर सकता हूँ?",
    saathiPlaceholder: 'हिन्दी, अंग्रेजी या अपनी भाषा में पूछें...',
    saathiQuickActions: [
      { label: "मेरी छात्रवृत्ति का भुगतान क्यों लंबित है?", action: "PAYMENT_QUERY" },
      { label: "आवेदन की वर्तमान स्थिति", action: "APP_STATUS" },
      { label: "मैं कौन सी छात्रवृत्ति के लिए पात्र हूँ?", action: "CHECK_ELIGIBILITY" },
      { label: "दस्तावेज़ सत्यापन स्थिति", action: "DOC_QUERY" }
    ]
  },

  ta: {
    govIndia: 'இந்திய அரசு | Government of India',
    mota: 'பழங்குடியினர் விவகார அமைச்சகம் (MoTA) | Ministry of Tribal Affairs',
    demoMode: 'டெமோ பயன்முறை',
    dataSaverOn: 'டேட்டா சேமிப்பு ஆன்',
    unifiedPortal: 'ஒருங்கிணைந்த போர்டல்',
    tagline: 'ஒரு மாணவர். ஒரு டாஷ்போர்டு. ஒரு உதவித்தொகை பயணம்.',
    accessibility: 'அணுகல்தன்மை அமைப்புகள்',
    supportedLanguages: 'ஆதரிக்கப்படும் மொழிகள்',
    simpleMode: 'எளிய பார்வை (Simple View)',
    simpleModeDesc: 'பெரிய பொத்தான்கள் மற்றும் எளிய வடிவமைப்பு',
    highContrast: 'அதிக மாறுபாடு (High Contrast)',
    highContrastDesc: 'மேம்பட்ட எல்லை தெரிவுநிலை',
    largeText: 'பெரிய எழுத்து (Large Text)',
    largeTextDesc: 'எழுத்து அளவை அதிகரி (+15%)',
    lowBandwidth: 'குறைந்த டேட்டா முறை',
    lowBandwidthDesc: 'அனிமேஷன்களை முடக்கு, டேட்டாவை சேமி',
    studentDashboard: 'மாணவர் டாஷ்போர்டு',
    applyScholarship: 'உதவித்தொகைக்கு விண்ணப்பிக்கவும்',
    documentWallet: 'ஆவணப் பணப்பை',
    payments: 'டிபிடி / பணம் செலுத்துதல்',
    eligibilityChecker: 'தகுதி சரிபார்ப்பு',
    grievances: 'புகார்கள் & உதவி',
    missedCall: 'மிஸ்டு-கால் / எஸ்எம்எஸ் சேவை',
    teacherAssisted: 'ஆசிரியர் உதவி முறை',
    myChildren: 'என் குழந்தைகள்',
    paymentHistory: 'பணம் செலுத்திய வரலாறு',
    verificationQueue: 'சரிபார்ப்பு வரிசை',
    districtCoverage: 'மாவட்ட கவரேஜ்',
    nationalAnalytics: 'தேசிய பகுப்பாய்வு',
    inclusivityTools: 'உள்ளடக்கல் கருவிகள்',
    askSaathi: 'சாதி AI-யிடம் கேளுங்கள்',
    logout: 'வெளியேறு',
    home: 'முகப்பு',
    apply: 'விண்ணப்பம்',
    wallet: 'பணப்பை',
    pay: 'பணம்',
    notifications: 'அறிவிப்புகள்',
    goodMorning: 'காலை வணக்கம்',
    scholarshipHealth: 'உதவித்தொகை நிலை',
    actionRequired: 'நடவடிக்கை தேவை',
    allClear: 'அனைத்தும் சரி',
    activeApplications: 'செயலில் உள்ள விண்ணப்பங்கள்',
    totalSanctioned: 'மொத்த அனுமதிக்கப்பட்ட தொகை',
    digiLockerVerified: 'டிஜிலாக்கர் சரிபார்க்கப்பட்டது',
    saathiGreeting: "வணக்கம்! நான் **சாதி (SAATHI)**, பழங்குடியினர் விவகார அமைச்சகத்தின் (MoTA) உதவித்தொகை வழிகாட்டி.\n\nஇன்று உங்கள் உதவித்தொகை பயணத்தில் நான் எவ்வாறு உதவ முடியும்?",
    saathiPlaceholder: 'தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள்...',
    saathiQuickActions: [
      { label: "என் உதவித்தொகை பணம் ஏன் நிலுவையில் உள்ளது?", action: "PAYMENT_QUERY" },
      { label: "விண்ணப்பத்தின் நிலை என்ன?", action: "APP_STATUS" },
      { label: "நான் எந்த உதவித்தொகைக்கு தகுதியுடையவர்?", action: "CHECK_ELIGIBILITY" },
      { label: "ஆவண சரிபார்ப்பு நிலை", action: "DOC_QUERY" }
    ]
  },

  santali: {
    govIndia: 'ᱥᱤᱧᱚᱛ ᱥᱚᱨᱠᱟᱨ | Government of India',
    mota: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱮᱯᱟᱨ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ (MoTA)',
    demoMode: 'ᱰᱮᱢᱚ ᱢᱚᱰ',
    dataSaverOn: 'ᱰᱟᱴᱟ ᱵᱟᱧᱪᱟᱣ ᱪᱟᱹᱞᱩ',
    unifiedPortal: 'ᱡᱚᱲᱟᱣ ᱯᱚᱨᱴᱟᱞ',
    tagline: 'ᱢᱤᱫ ᱜᱤᱫᱽᱨᱟᱹ᱾ ᱢᱤᱫ ᱰᱮᱥᱵᱚᱨᱰ᱾ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱥᱟᱸᱜᱷᱟᱨ᱾',
    accessibility: 'ᱥᱩᱵᱤᱫᱷᱟ ᱥᱮᱴᱤᱝᱥ',
    supportedLanguages: 'ᱥᱟᱯᱚᱨᱴ ᱯᱟᱹᱨᱥᱤ ᱠᱚ',
    simpleMode: 'ᱟᱞᱜᱟ ᱧᱮᱞ (Simple View)',
    simpleModeDesc: 'ᱢᱟᱨᱟᱝ ᱵᱚᱴᱚᱱ ᱟᱨ ᱟᱞᱜᱟ ᱠᱟᱨᱰ',
    highContrast: 'ᱪᱮᱛᱟᱱ ᱠᱚᱱᱴᱨᱟᱥᱴ (High Contrast)',
    highContrastDesc: 'ᱥᱟᱯᱷᱟ ᱜᱟᱨ ᱧᱮᱞᱚᱜ',
    largeText: 'ᱢᱟᱨᱟᱝ ᱚᱞ (Large Text)',
    largeTextDesc: 'ᱚᱞ ᱨᱮᱱᱟᱜ ᱥᱟᱭᱤᱡ ᱵᱟᱹᱲᱛᱤ (+᱑᱕%)',
    lowBandwidth: 'ᱠᱚᱢ ᱰᱟᱴᱟ ᱢᱚᱰ',
    lowBandwidthDesc: 'ᱰᱟᱴᱟ ᱵᱟᱧᱪᱟᱣ',
    studentDashboard: 'ᱜᱤᱫᱽᱨᱟᱹ ᱰᱮᱥᱵᱚᱨᱰ',
    applyScholarship: 'ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱵᱮᱫᱚᱱ',
    documentWallet: 'ᱠᱟᱜᱚᱡᱽ ᱣᱟᱞᱮᱴ',
    payments: 'DBT / ᱴᱟᱠᱟ ᱵᱷᱮᱡᱟ',
    eligibilityChecker: 'ᱡᱚᱜᱽᱭᱚᱛᱟ ᱯᱚᱨᱚᱠᱷ',
    grievances: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱜᱚᱲᱚ',
    missedCall: 'ᱢᱤᱥᱰ-ᱠᱚᱞ / SMS ᱥᱮᱵᱟ',
    teacherAssisted: 'ᱜᱩᱨᱩ ᱜᱚᱲᱚ ᱢᱚᱰ',
    myChildren: 'ᱤᱧᱨᱮᱱ ᱜᱤᱫᱽᱨᱟᱹ',
    paymentHistory: 'ᱴᱟᱠᱟ ᱱᱟᱜᱟᱢ',
    verificationQueue: 'ᱯᱚᱨᱚᱠᱷ ᱞᱟᱭᱤᱱ',
    districtCoverage: 'ᱦᱚᱱᱚᱛ ᱠᱚᱵᱷᱚᱨ',
    nationalAnalytics: 'ᱫᱤᱥᱚᱢ ᱞᱮᱠᱷᱟ',
    inclusivityTools: 'ᱥᱟᱱᱟᱢ ᱥᱩᱵᱤᱫᱷᱟ ᱴᱩᱞ',
    askSaathi: 'ᱥᱟᱛᱷᱤ AI ᱠᱩᱞᱤᱭᱮᱢ',
    logout: 'ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ',
    home: 'ᱚᱲᱟᱜ',
    apply: 'ᱟᱵᱮᱫᱚᱱ',
    wallet: 'ᱣᱟᱞᱮᱴ',
    pay: 'ᱴᱟᱠᱟ',
    notifications: 'ᱠᱷᱚᱵᱚᱨ',
    goodMorning: 'ᱡᱚᱦᱟᱨ',
    scholarshipHealth: 'ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱦᱟᱞᱚᱛ',
    actionRequired: 'ᱠᱟᱹᱢᱤ ᱞᱟᱹᱠᱛᱤ',
    allClear: 'ᱥᱟᱱᱟᱢ ᱴᱷᱤᱠ ᱜᱮᱭᱟ',
    activeApplications: 'ᱪᱟᱹᱞᱩ ᱟᱵᱮᱫᱚᱱ',
    totalSanctioned: 'ᱢᱚᱴ ᱧᱟᱢ ᱟᱠᱟᱱ',
    digiLockerVerified: 'ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱯᱚᱨᱚᱠᱷ ᱴᱷᱤᱠ',
    saathiGreeting: "ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ **ᱥᱟᱛᱷᱤ (SAATHI)**, ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱮᱯᱟᱨ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ (MoTA) ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ᱾\n\nᱛᱮᱦᱮᱧ ᱤᱧ ᱪᱮᱫ ᱜᱚᱲᱚᱢ ᱠᱷᱚᱡᱟ?",
    saathiPlaceholder: 'ᱠᱩᱞᱤ ᱢᱮ ᱥᱟᱱᱛᱟᱲᱤ, ᱵᱟᱝᱞᱟ ᱥᱮ ᱦᱤᱱᱫᱤ ᱛᱮ...',
    saathiQuickActions: [
      { label: "ᱤᱧᱟᱜ ᱴᱟᱠᱟ ᱪᱮᱫᱟᱜ ᱵᱟᱝ ᱦᱮᱡ ᱟᱠᱟᱱᱟ?", action: "PAYMENT_QUERY" },
      { label: "ᱟᱵᱮᱫᱚᱱ ᱦᱟᱞᱚᱛ ᱪᱮᱫ?", action: "APP_STATUS" },
      { label: "ᱤᱧ ᱪᱮᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱧᱟᱢᱟ?", action: "CHECK_ELIGIBILITY" },
      { label: "ᱠᱟᱜᱚᱡᱽ ᱯᱚᱨᱚᱠᱷ ᱦᱟᱞᱚᱛ", action: "DOC_QUERY" }
    ]
  },

  gondi: {
    govIndia: 'भारत सरकार | Government of India',
    mota: 'जनजाति कार्य मंत्रालय (MoTA)',
    demoMode: 'डेमो मोड',
    dataSaverOn: 'डेटा सेवर चालू',
    unifiedPortal: 'सकल पोर्टल',
    tagline: 'ओंद विद्यार्ति। ओंद डैशबोर्ड। ओंद छात्रवृत्ति यात्रा।',
    accessibility: 'सुलभ सेटिंग्स',
    supportedLanguages: 'समर्थित भाषा',
    simpleMode: 'सरल रूप',
    simpleModeDesc: 'पेद्दा बटन मत्ता सरल कार्ड',
    highContrast: 'अदिक कंट्रास्ट',
    highContrastDesc: 'सफा सीमा मत्ता दृश्यता',
    largeText: 'पेद्दा पाठ',
    largeTextDesc: 'अक्षरांग नाप अदिक कीम (+15%)',
    lowBandwidth: 'कमी डेटा मोड',
    lowBandwidthDesc: 'डेटा बचाय कीम',
    studentDashboard: 'विद्यार्थी डैशबोर्ड',
    applyScholarship: 'छात्रवृत्ति दरखास्त',
    documentWallet: 'कागद बटुआ',
    payments: 'डीबीटी / भुगतानी',
    eligibilityChecker: 'लायकी तपासणी',
    grievances: 'तकरार निवारण',
    missedCall: 'मिस्ड-कॉल / एसएमएस सेवा',
    teacherAssisted: 'मास्तर सहायता',
    myChildren: 'नावा पोरांग',
    paymentHistory: 'पईसा इतिहास',
    verificationQueue: 'तपासणी रांग',
    districtCoverage: 'ज़िला कव्हरेज',
    nationalAnalytics: 'राष्ट्रीय विश्लेषण',
    inclusivityTools: 'समस्त उपकरण',
    askSaathi: 'साथी AI से पुछा',
    logout: 'पीडा',
    home: 'लोन',
    apply: 'दरखास्त',
    wallet: 'बटुआ',
    pay: 'पईसा',
    notifications: 'सूचना',
    goodMorning: 'सेवा जोहार',
    scholarshipHealth: 'छात्रवृत्ति हाल',
    actionRequired: 'काम बाकी',
    allClear: 'सबे बेस आंद',
    activeApplications: 'चालू दरखास्तांग',
    totalSanctioned: 'मंजूर पईसा',
    digiLockerVerified: 'कागद तपासणी पक्का',
    saathiGreeting: "सेवा जोहार! नन्ना **साथी (SAATHI)** आंदोन, मोता (MoTA) छात्रवृत्ति सहायता साथी।\n\nनेन्डु मीवा बतल सहायता कीकन?",
    saathiPlaceholder: 'गोंडी, हिन्दी या अंग्रेजी ते पुछा...',
    saathiQuickActions: [
      { label: "नावा पईसा बारो बाकी आंद?", action: "PAYMENT_QUERY" },
      { label: "दरखास्त ना हाल बतल आंद?", action: "APP_STATUS" },
      { label: "नन्ना बोन छात्रवृत्ति लायक आंदोन?", action: "CHECK_ELIGIBILITY" },
      { label: "कागद तपासणी हाल", action: "DOC_QUERY" }
    ]
  },

  bhili: {
    govIndia: 'भारत सरकार | Government of India',
    mota: 'जनजाति कार्य मंत्रालय (MoTA)',
    demoMode: 'डेमो मोड',
    dataSaverOn: 'डेटा सेवर चालू',
    unifiedPortal: 'साझो पोर्टल',
    tagline: 'एक पोरा। एक डैशबोर्ड। एक छात्रवृत्ति सफर।',
    accessibility: 'सुगम सेटिंग्स',
    supportedLanguages: 'समर्थित भाषा',
    simpleMode: 'सीधो रूप',
    simpleModeDesc: 'बड़ा बटन ने सादा कार्ड',
    highContrast: 'तेज कंट्रास्ट',
    highContrastDesc: 'साफ किनारा ने दिखवाणु',
    largeText: 'बड़ा आखर',
    largeTextDesc: 'आखर नी साइज वधारो (+15%)',
    lowBandwidth: 'कम डेटा मोड',
    lowBandwidthDesc: 'डेटा बचाओ',
    studentDashboard: 'विद्यार्थी डैशबोर्ड',
    applyScholarship: 'छात्रवृत्ति अर्जी',
    documentWallet: 'कागजात बटुआ',
    payments: 'डीबीटी / पईसा',
    eligibilityChecker: 'लायकी जांच',
    grievances: 'शिकायत निवारण',
    missedCall: 'मिस्ड-कॉल / एसएमएस सेवा',
    teacherAssisted: 'मास्तर सहायता',
    myChildren: 'मारा पोरा',
    paymentHistory: 'पईसा नो इतिहास',
    verificationQueue: 'जांच नी लाइन',
    districtCoverage: 'जिल्लो कव्हरेज',
    nationalAnalytics: 'देश नो हिसाब',
    inclusivityTools: 'सहूलियत साधन',
    askSaathi: 'साथी AI नें पूंछो',
    logout: 'बार नीकलो',
    home: 'घर',
    apply: 'अर्जी',
    wallet: 'बटुआ',
    pay: 'पईसा',
    notifications: 'खबर',
    goodMorning: 'राम राम',
    scholarshipHealth: 'छात्रवृत्ति हाल',
    actionRequired: 'काम बाकी',
    allClear: 'बधु ठीक छे',
    activeApplications: 'चालू अर्जिया',
    totalSanctioned: 'मंजूर थयेला पईसा',
    digiLockerVerified: 'कागजात जांच पक्की',
    saathiGreeting: "राम राम! मु **साथी (SAATHI)** छुं, जनजाति मंत्रालय नी छात्रवृत्ति नी सेवा मां।\n\nआज मु तमारी काई मदद करी शकुं?",
    saathiPlaceholder: 'भीली, हिन्दी अथवा अंग्रेजी मां पूंछो...',
    saathiQuickActions: [
      { label: "मारा पईसा केम अटकेला छे?", action: "PAYMENT_QUERY" },
      { label: "अर्जी नी हाल काई छे?", action: "APP_STATUS" },
      { label: "मु केई छात्रवृत्ति सारू लायक छुं?", action: "CHECK_ELIGIBILITY" },
      { label: "कागजात जांच नी स्थिति", action: "DOC_QUERY" }
    ]
  }
};

export function getTranslation(lang: string = 'en'): TranslationBundle {
  return TRANSLATIONS[lang] || TRANSLATIONS['en'];
}
