import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Flame,
  GraduationCap,
  CheckSquare,
  BookOpen,
  BarChart3,
  Trophy,
  Lightbulb,
  Info,
  Settings,
  Dumbbell,
  Sparkles,
} from "lucide-react";

export function BottomNav() {
  const { t, dir } = useLanguage();
  const [location, setLocation] = useLocation();

  const navItems = [
    { title: t("dashboard"), url: "/", icon: LayoutDashboard },
    { title: t("worship"), url: "/worship", icon: Flame },
    { title: t("study"), url: "/study", icon: GraduationCap },
    { title: t("tasks"), url: "/tasks", icon: CheckSquare },
    { title: t("reading"), url: "/reading", icon: BookOpen },
    { title: t("statistics"), url: "/statistics", icon: BarChart3 },
    { title: t("achievements"), url: "/achievements", icon: Trophy },
    { title: t("motivation"), url: "/motivation", icon: Lightbulb },

    // التطوير
    { title: "التطوير", url: "/self-improvement", icon: Sparkles },

    // Gym
    { title: t("gym") || "Gym", url: "/gym", icon: Dumbbell },

    { title: t("about"), url: "/about", icon: Info },
    { title: t("settings"), url: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div
        className={`
          flex items-center gap-4 px-4 py-2
          overflow-x-auto no-scrollbar w-full
          ${dir === "rtl" ? "flex-row-reverse" : "flex-row"}
        `}
        style={{
          direction: dir === "rtl" ? "rtl" : "ltr",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {navItems.map((item) => {
          const isActive = location === item.url;

          return (
            <button
              key={item.url}
              onClick={() => setLocation(item.url)}
              className={`
                flex flex-col items-center justify-center
                min-w-[70px] flex-shrink-0
                py-1.5 px-2
                rounded-lg transition-all
                ${isActive ? "text-primary scale-110" : "text-muted-foreground"}
              `}
            >
              <item.icon
                className={`
                  h-6 w-6 mb-1 transition-all
                  ${isActive ? "scale-110" : ""}
                `}
              />
              <span className="text-[11px] font-medium text-center leading-tight">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
