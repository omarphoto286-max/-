import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type PomodoroSettings = {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  cyclesBeforeLongBreak: number;
  autoStart: boolean;
};

type PomodoroSettingsContextType = {
  settings: PomodoroSettings;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
};

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  cyclesBeforeLongBreak: 4,
  autoStart: false,
};

const SettingsContext = createContext<PomodoroSettingsContextType | undefined>(
  undefined
);

export const PomodoroSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem("pomodoro_settings");

    if (saved) {
      const parsed = JSON.parse(saved);

      // تصحيح القيم لو كانت Strings أو undefined
      return {
        workDuration: Number(parsed.workDuration) || 25,
        shortBreak: Number(parsed.shortBreak) || 5,
        longBreak: Number(parsed.longBreak) || 15,
        cyclesBeforeLongBreak: Number(parsed.cyclesBeforeLongBreak) || 4,
        autoStart: Boolean(parsed.autoStart),
      };
    }

    return defaultSettings;
  });

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("pomodoro_settings", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem("pomodoro_settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const usePomodoroSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("usePomodoroSettings must be used within PomodoroSettingsProvider");
  return context;
};
