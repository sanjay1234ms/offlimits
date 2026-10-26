"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Smartphone, Users } from "lucide-react";
import { SKIN_META, type Skin } from "@/lib/werewolf";
import { primeAudio } from "@/lib/audio";
import { WolfLocal } from "./WolfLocal";
import { rememberHost, wolfPid } from "./WolfRoom";

type Mode = "local" | "room";

/** Werewolf / Mafia launcher: pick the skin and how you're playing. */
export function WolfGame({ defaultSkin = "werewolf" }: { defaultSkin?: Skin }) {
  const router = useRouter();
  const [skin, setSkin] = useState<Skin>(defaultSkin);
  const [mode, setMode] = useState<Mode>("local");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      setName(localStorage.getItem("ol-wolf-name") ?? "");
      const m = localStorage.getItem("ol-wolf-mode");
      if (m === "room" || m === "local") setMode(m);
    } catch {
      /* ignore */
    }
  }, []);

  function pickMode(m: Mode) {
    setMode(m);
    primeAudio();
    try {
      localStorage.setItem("ol-wolf-mode", m);
    } catch {
      /* ignore */
    }
  }

  async function create() {
    const n = name.trim().slice(0, 16);
    if (!n) return setErr("Add your name first.");
    setBusy(true);
    setErr("");
    try {
      localStorage.setItem("ol-wolf-name", n);
      const res = await fetch("/api/wolf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skin, pid: wolfPid(), name: n }),
      });
      const out = (await res.json()) as { code?: string; hostToken?: string };
      if (!res.ok || !out.code || !out.hostToken) throw new Error("create");
      rememberHost(out.code, out.hostToken);
      router.push(`/wolf/${out.code}`);
    } catch {
      setErr("Couldn't create a room. Try again in a moment.");
      setBusy(false);
    }
  }

  function join() {
    const c = code.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (c.length !== 6) return setErr("Room codes are 6 characters.");
    router.push(`/wolf/${c}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1" role="group" aria-label="Theme">
          {(["werewolf", "mafia"] as Skin[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={skin === s}
              onClick={() => setSkin(s)}
              className={`rounded-full px-4 py-2 text-sm font-black transition-colors ${skin === s ? "bg-white text-slate-900" : "text-muted hover:text-foreground"}`}
            >
              {SKIN_META[s].emoji} {SKIN_META[s].title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="How are you playing?">
          {(
            [
              { id: "local", icon: Smartphone, label: "One phone", sub: "Phone in the middle" },
              { id: "room", icon: Users, label: "Party Room", sub: "Everyone's phone" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => pickMode(m.id)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-left transition-all ${
                mode === m.id ? "border-accent bg-accent/15" : "border-white/10 bg-white/5 hover:border-white/25"
              }`}
            >
              <m.icon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block text-sm font-black text-foreground">{m.label}</span>
                <span className="block text-[11px] font-semibold text-muted">{m.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {mode === "local" ? (
        <WolfLocal key={skin} skin={skin} />
      ) : (
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/10 p-6 text-white sm:p-10"
          style={{ background: "radial-gradient(120% 90% at 85% 0%, rgba(124,58,237,0.45), transparent 60%), linear-gradient(180deg, #050816, #1b1446)" }}
        >
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-3xl">👑</p>
              <h3 className="mt-2 text-xl font-black">Host a room</h3>
              <p className="mt-1 text-sm text-white/70">
                Everyone joins on their own phone and gets a secret role. Your phone narrates out loud and runs the game, and you play too.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                className="mt-4 w-full rounded-2xl border-2 border-white/15 bg-white/10 px-4 py-3 font-bold text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
              <button type="button" onClick={create} disabled={busy} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-black text-slate-900 disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Create a {SKIN_META[skin].title} room
              </button>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-3xl">🔑</p>
              <h3 className="mt-2 text-xl font-black">Join a room</h3>
              <p className="mt-1 text-sm text-white/70">Got a code from the host? Enter it here, or just open the invite link they sent.</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="ROOM CODE"
                aria-label="Room code"
                className="mt-4 w-full rounded-2xl border-2 border-white/15 bg-white/10 px-4 py-3 text-center font-mono text-xl font-black tracking-[0.3em] text-white outline-none placeholder:text-white/30 focus:border-white/50"
                onKeyDown={(e) => e.key === "Enter" && join()}
              />
              <button type="button" onClick={join} className="mt-3 w-full rounded-2xl bg-white/20 py-3.5 font-black text-white hover:bg-white/30">
                Join
              </button>
            </div>
          </div>
          {err ? <p className="mt-4 text-center text-sm font-bold text-red-300">{err}</p> : null}
        </div>
      )}
    </div>
  );
}
