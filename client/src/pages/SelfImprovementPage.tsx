import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain,
  Dumbbell,
  Heart,
  BookOpen,
  Sparkles,
  Target,
} from "lucide-react";

export default function SelfImprovementPage() {
  const { t, dir } = useLanguage();

  const sections = [
    {
      titleKey: "self_mind",
      icon: Brain,
      descKey: "self_mind_desc",
    },
    {
      titleKey: "self_body",
      icon: Dumbbell,
      descKey: "self_body_desc",
    },
    {
      titleKey: "self_heart",
      icon: Heart,
      descKey: "self_heart_desc",
    },
    {
      titleKey: "self_faith",
      icon: BookOpen,
      descKey: "self_faith_desc",
    },
    {
      titleKey: "self_habits",
      icon: Target,
      descKey: "self_habits_desc",
    },
    {
      titleKey: "self_inspiration",
      icon: Sparkles,
      descKey: "self_inspiration_desc",
    },
  ];

  return (
    <div
      className="min-h-screen pb-24 bg-gradient-to-br from-background to-muted/30"
      style={{ direction: dir }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center py-10"
      >
        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          {t("self_title")}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          {t("self_quote")}
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 max-w-4xl mx-auto">
        {sections.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-card shadow-lg border border-border hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-7 h-7 text-primary" />
                <h2 className="text-xl font-bold">{t(sec.titleKey)}</h2>
              </div>
              <p className="text-muted-foreground">{t(sec.descKey)}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Motivation Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 px-5 max-w-xl mx-auto"
      >
        <div className="p-6 bg-primary/10 rounded-2xl text-center border border-primary/20">
          <h3 className="text-2xl font-bold mb-2 text-primary">
            {t("self_daily_boost")}
          </h3>
          <p className="text-primary-foreground/80 text-lg">
            {t("self_daily_boost_text")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
