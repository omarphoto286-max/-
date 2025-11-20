import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Download, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// GymPage.tsx
// صفحة جاهزة لتتبع التمارين (LocalStorage) + رسم بياني للتقدّم

type WorkoutEntry = {
  id: string;
  userId?: string | null;
  name: string;
  sets: number;
  reps: number;
  weight: number; // kg
  date: string; // ISO yyyy-mm-dd
};

export default function GymPage() {
  const { user } = useAuth?.() ?? { user: null };
  const storageKey = `gym_log_${user?.id ?? "guest"}`;

  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [name, setName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(20);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setEntries(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load gym data:", e);
    }
  }, [storageKey]);

  // save when entries change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, storageKey]);

  const addEntry = () => {
    if (!name.trim()) return;
    const entry: WorkoutEntry = {
      id: crypto.randomUUID(),
      userId: user?.id ?? null,
      name: name.trim(),
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      date,
    };
    setEntries((s) => [entry, ...s]);
    setName("");
  };

  const removeEntry = (id: string) => {
    setEntries((s) => s.filter((e) => e.id !== id));
  };

  const resetAll = () => {
    if (!confirm("Reset all workout logs? This cannot be undone.")) return;
    setEntries([]);
  };

  // Export / Import
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gym-log-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          // minimal validation
          const ok = parsed.every(p => p && p.id && p.name && p.date);
          if (!ok) throw new Error("Invalid format");
          setEntries((prev) => [...parsed, ...prev]);
          alert("Imported successfully");
        } else {
          alert("Invalid file (expected an array)");
        }
      } catch (e) {
        alert("Failed to import: " + e);
      }
    };
    reader.readAsText(file);
  };

  // Chart data: aggregate daily volume = sum(sets*reps*weight)
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    // keep last 14 days by default
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0,10);
      map.set(key, 0);
    }

    for (const e of entries) {
      if (!map.has(e.date)) map.set(e.date, 0);
      const prev = map.get(e.date) ?? 0;
      map.set(e.date, prev + e.sets * e.reps * e.weight);
    }

    return Array.from(map.entries()).map(([date, volume]) => ({ date, volume }));
  }, [entries]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Hero */}
      <div className="flex gap-6 items-center">
        <div>
          <h1 className="text-3xl font-bold">Gym Tracker</h1>
          <p className="text-muted-foreground">Track workouts, view progress, and keep motivated.</p>
        </div>
        <img src="/mnt/data/d309903b-a91c-4f6d-aa12-eb20de60eaa9.png" alt="hero" className="w-32 h-20 object-contain rounded-md shadow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress (last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                  <YAxis />
                  <Tooltip formatter={(value:number) => `${value} vol`} />
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Workout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Exercise</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Bench Press" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Sets</Label>
                <Input type="number" value={sets} onChange={(e) => setSets(Number(e.target.value))} />
              </div>
              <div>
                <Label>Reps</Label>
                <Input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <Button onClick={addEntry} className="flex items-center gap-2"><Zap className="h-4 w-4" /> Add</Button>
              <Button variant="ghost" onClick={exportJSON} className="flex items-center gap-2"><Download className="h-4 w-4" /> Export</Button>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
                />
                <Button variant="ghost" className="flex items-center gap-2"><Upload className="h-4 w-4" /> Import</Button>
              </label>
            </div>

            <div className="text-sm text-muted-foreground">Entries saved to your browser (localStorage).</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.length === 0 ? (
            <p className="text-muted-foreground">No workouts yet.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-4 p-3 rounded bg-card">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-muted-foreground">{e.sets} x {e.reps} @ {e.weight}kg • {e.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => removeEntry(e.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4 gap-2">
            <Button variant="destructive" onClick={resetAll}>Reset All</Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">Tip: you can export your log and re-import it on another device.</div>
    </div>
  );
}
