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
    <nav
      className="
        fixed bottom-3 left-1/2 -translate-x-1/2 z-50
        w-[92%] max-w-[500px]
        bg-white/10 backdrop-blur-xl
        border border-white/20 shadow-2xl
        rounded-3xl
        px-4 py-2
      "
      style={{
        direction: dir,
      }}
    >
      <div
        className={`
          flex items-center gap-4 overflow-x-auto no-scrollbar
          ${dir === "rtl" ? "flex-row-reverse" : "flex-row"}
        `}
      >
        {navItems.map((item) => {
          const isActive = location === item.url;

          return (
            <button
              key={item.url}
              onClick={() => setLocation(item.url)}
              className={`
                flex flex-col items-center justify-center
                min-w-[64px]
                px-2 py-1.5
                transition-all duration-300
                active:scale-95
                rounded-xl relative
                ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }
              `}
            >
              {/* Glow behind active icon */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-lg -z-10 animate-pulse"></div>
              )}

              {/* Icon */}
              <item.icon
                className={`
                  h-6 w-6 mb-1 transition-all duration-300
                  ${isActive ? "scale-125 drop-shadow-lg" : "opacity-80"}
                `}
              />

              {/* Label */}
              <span
                className={`
                  text-[11px] font-medium transition-opacity duration-300
                  ${isActive ? "opacity-100" : "opacity-70"}
                `}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
