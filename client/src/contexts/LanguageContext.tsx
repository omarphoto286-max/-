import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

// -----------------------------------------
// 🔥 NEW TRANSLATIONS ADDED (Gym + Self Improvement)
// -----------------------------------------

const translations = {
  en: {
    // ====== General ======
    welcome: "Welcome",
    greeting: "Peace be upon you",
    dashboard: "Dashboard",
    worship: "Worship & Dhikr",
    study: "Study & Lessons",
    tasks: "Tasks",
    reading: "Reading",
    statistics: "Statistics",
    achievements: "Achievements",
    motivation: "Motivation",
    about: "About",
    settings: "Settings",

    // ====== Auth ======
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    fullName: "Full Name",

    // ====== Worship ======
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    sunnah: "Sunnah",

    // ====== Tools ======
    dhikrCounter: "Dhikr Counter",
    pomodoroTimer: "Pomodoro Timer",
    prayerTracking: "Prayer Tracking",
    courseManagement: "Course Management",
    taskManagement: "Task Management",
    readingGoal: "Reading Goal",
    dailyVerse: "Daily Verse",
    wisdomQuote: "Wisdom of the Day",
    growthTree: "Growth Tree",

    start: "Start",
    pause: "Pause",
    reset: "Reset",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",

    theme: "Theme",
    language: "Language",
    gold: "Gold",
    green: "Green",
    dark: "Dark",

    export: "Export Data",
    import: "Import Data",
    resetData: "Reset Data",

    today: "Today",
    progress: "Progress",
    target: "Target",
    completed: "Completed",
    pending: "Pending",

    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",

    title: "Title",
    description: "Description",
    tags: "Tags",
    course: "Course",
    metric: "Metric",

    developer: "Developer",
    contact: "Contact",
    sessions: "Sessions",
    break: "Break",
    focus: "Focus",

    // -----------------------------
    // ⭐ NEW — Gym Page
    // -----------------------------
    gym: "Gym",
    gym_title: "Gym Progress",
    gym_add_exercise: "Add Exercise",
    gym_no_data: "No exercises added yet",
    gym_delete_confirm: "Are you sure you want to remove this exercise?",
    gym_weight: "Weight",
    gym_reps: "Reps",
    gym_sets: "Sets",

    // -----------------------------
    // ⭐ NEW — Self Improvement
    // -----------------------------
    selfImprovement: "Self Improvement",
    self_title: "Self-Improvement",
    self_daily_goals: "Daily Improvement Goals",
    self_add_goal: "Add Goal",
    self_no_goals: "No goals added yet",
    self_tips: "Daily Tips",
    self_habits: "Healthy Habits",
    self_quote: "Motivational Quote",
    self_progress: "Your Growth Tracking",
  },

  // ================================================================
  // ======================== ARABIC ================================
  // ================================================================
  ar: {
    // ====== General ======
    welcome: "مرحباً",
    greeting: "السلام عليكم يا",
    dashboard: "الرئيسية",
    worship: "العبادات والأذكار",
    study: "المذاكرة والدراسة",
    tasks: "المهام",
    reading: "القراءة",
    statistics: "الإحصائيات",
    achievements: "الإنجازات",
    motivation: "التحفيز",
    about: "عن التطبيق",
    settings: "الإعدادات",

    // ====== Auth ======
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم بالكامل",

    // ====== Worship ======
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    sunnah: "السنة",

    // ====== Tools ======
    dhikrCounter: "عداد الأذكار",
    pomodoroTimer: "مؤقت بومودورو",
    prayerTracking: "تتبع الصلوات",
    courseManagement: "إدارة المواد",
    taskManagement: "إدارة المهام",
    readingGoal: "هدف القراءة",
    dailyVerse: "آية اليوم",
    wisdomQuote: "حكمة اليوم",
    growthTree: "شجرة النمو",

    start: "ابدأ",
    pause: "إيقاف مؤقت",
    reset: "إعادة تعيين",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",

    theme: "المظهر",
    language: "اللغة",
    gold: "ذهبي",
    green: "أخضر",
    dark: "داكن",

    export: "تصدير البيانات",
    import: "استيراد البيانات",
    resetData: "إعادة تعيين البيانات",

    today: "اليوم",
    progress: "التقدم",
    target: "الهدف",
    completed: "مكتمل",
    pending: "قيد الانتظار",

    priority: "الأولوية",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",

    title: "العنوان",
    description: "الوصف",
    tags: "الوسوم",
    course: "المادة",
    metric: "المقياس",

    developer: "المطور",
    contact: "التواصل",
    sessions: "الجلسات",
    break: "استراحة",
    focus: "تركيز",

    // -----------------------------
    // ⭐ NEW — Gym Page
    // -----------------------------
    gym: "الجيم",
    gym_title: "تقدم الجيم",
    gym_add_exercise: "إضافة تمرين",
    gym_no_data: "لم يتم إضافة تمارين بعد",
    gym_delete_confirm: "هل أنت متأكد من حذف هذا التمرين؟",
    gym_weight: "الوزن",
    gym_reps: "التكرارات",
    gym_sets: "المجموعات",

    // -----------------------------
    // ⭐ NEW — Self Improvement
    // -----------------------------
    selfImprovement: "التطوير الذاتي",
    self_title: "صفحة التطوير الذاتي",
    self_daily_goals: "أهداف التطوير اليومية",
    self_add_goal: "إضافة هدف",
    self_no_goals: "لا توجد أهداف بعد",
    self_tips: "نصائح يومية",
    self_habits: "عادات صحية",
    self_quote: "اقتباس تحفيزي",
    self_progress: "تتبع تقدمك",
  },
};

// -------------------------------------------------------------

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    const root = document.documentElement;
    const dir = language === "ar" ? "rtl" : "ltr";
    root.setAttribute("dir", dir);
    root.setAttribute("lang", language);
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string =>
    translations[language][key as keyof typeof translations.en] || key;

  const dir = language === "ar" ? "rtl" : "ltr";

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
