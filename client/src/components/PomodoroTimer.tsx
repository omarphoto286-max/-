import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePomodoroSettings } from "@/contexts/PomodoroSettingsContext";

export function PomodoroTimer() {
  const { t } = useLanguage();
  const { settings } = usePomodoroSettings();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // استخدم workDuration بدل settings.focus
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro");
    if (saved) {
      const data = JSON.parse(saved);

      setTimeLeft(Number(data.timeLeft) || settings.workDuration * 60);
      setIsRunning(Boolean(data.isRunning));
      setIsBreak(Boolean(data.isBreak));
      setSessions(Number(data.sessions) || 0);
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem(
      "pomodoro",
      JSON.stringify({ timeLeft, isRunning, isBreak, sessions })
    );
  }, [timeLeft, isRunning, isBreak, sessions]);

  // When settings change → reset timer
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(
        (isBreak ? settings.shortBreak : settings.workDuration) * 60
      );
    }
  }, [settings]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(
        () => setTimeLeft((prev) => prev - 1),
        1000
      );
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (!isBreak) {
        // Focus session finished
        const newSession = sessions + 1;
        setSessions(newSession);

        const longBreakNow =
          newSession % settings.cyclesBeforeLongBreak === 0;

        setIsBreak(true);
        setTimeLeft(
          (longBreakNow ? settings.longBreak : settings.shortBreak) * 60
        );
      } else {
        // Break finished
        setIsBreak(false);
        setTimeLeft(settings.workDuration * 60);
      }

      setIsRunning(false);
    }

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isBreak, sessions, settings]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(settings.workDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const total = isBreak
    ? settings.shortBreak * 60
    : settings.workDuration * 60;

  const progress = ((total - timeLeft) / total) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">{t("pomodoroTimer")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              {isBreak ? t("break") : t("focus")}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="default" size="icon" onClick={toggleTimer} className="h-12 w-12">
            {isRunning ? <Pause /> : <Play />}
          </Button>

          <Button variant="outline" size="icon" onClick={resetTimer} className="h-12 w-12">
            <RotateCcw />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("sessions")}: <span className="font-semibold">{sessions}</span>
        </p>
      </CardContent>
    </Card>
  );
}
