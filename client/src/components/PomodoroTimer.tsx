import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePomodoroSettings } from "@/contexts/PomodoroSettingsContext";
import { useAuth } from "@/contexts/AuthContext"; // NEW → for per-user storage

export function PomodoroTimer() {
  const { t } = useLanguage();
  const { settings } = usePomodoroSettings();
  const { user } = useAuth();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const storageKey = `pomodoro_state_${user?.id || "guest"}`;

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const [animate, setAnimate] = useState(false); // NEW Animation

  // Load sound effect
  useEffect(() => {
    audioRef.current = new Audio("/sounds/finish.mp3"); // ضع الصوت في public/sounds
  }, []);

  // Load state with timestamps
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setTimeLeft(settings.workDuration * 60);
      return;
    }

    const { startTime, duration, isBreak: savedBreak, isRunning: savedRunning, sessions: savedSessions } =
      JSON.parse(saved);

    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);

    if (elapsed >= duration) {
      // Timer ended while away
      audioRef.current?.play();

      setIsBreak(!savedBreak);
      const newDuration = savedBreak
        ? settings.workDuration * 60
        : settings.shortBreak * 60;

      setTimeLeft(newDuration);
      setIsRunning(false);
    } else {
      setTimeLeft(duration - elapsed);
      setIsBreak(savedBreak);
      setIsRunning(savedRunning);
    }

    setSessions(savedSessions || 0);
  }, [user]);

  const saveState = (duration: number, running = isRunning, breakMode = isBreak) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        startTime: Date.now(),
        duration,
        isRunning: running,
        isBreak: breakMode,
        sessions,
      })
    );
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const n = prev - 1;
          saveState(prev);
          return n;
        });
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current!);
      audioRef.current?.play(); // NEW sound

      if (!isBreak) {
        const newSession = sessions + 1;
        setSessions(newSession);

        const longBreak = newSession % settings.cyclesBeforeLongBreak === 0;

        const breakDuration = longBreak
          ? settings.longBreak * 60
          : settings.shortBreak * 60;

        setIsBreak(true);
        setTimeLeft(breakDuration);
        saveState(breakDuration, false, true);
      } else {
        const workDuration = settings.workDuration * 60;
        setIsBreak(false);
        setTimeLeft(workDuration);
        saveState(workDuration, false, false);
      }

      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (!isRunning) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
      saveState(timeLeft, true, isBreak);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    const newDuration = settings.workDuration * 60;
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(newDuration);
    saveState(newDuration, false, false);
  };

  const skipBreak = () => {
    if (!isBreak) return;
    const newDuration = settings.workDuration * 60;
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(newDuration);
    saveState(newDuration, false, false);
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
        <div className={`relative flex items-center justify-center transition-all duration-500 ${animate ? "scale-110" : ""}`}>
          <svg className="w-64 h-64 transform -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
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
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
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

          {isBreak && (
            <Button variant="secondary" size="icon" onClick={skipBreak} className="h-12 w-12">
              <FastForward />
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("sessions")}: <span className="font-semibold">{sessions}</span>
        </p>

        <audio ref={audioRef} />
      </CardContent>
    </Card>
  );
}
