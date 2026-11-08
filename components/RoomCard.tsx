"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

const LEN = 6;

/** Homepage shortcut into the Party Room: open a room, or type a friend's
 * six-character code and jump straight to the "what's your name" step. */
export function RoomCard() {
  const router = useRouter();
  const [chars, setChars] = useState<string[]>(Array(LEN).fill(""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const code = chars.join("");

  function setFrom(index: number, raw: string) {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setError(null);
    if (!clean) {
      setChars((c) => c.map((ch, i) => (i === index ? "" : ch)));
      return;
    }
    // Typing or pasting fills forward from this box.
    setChars((c) => {
      const next = c.slice();
      for (let i = 0; i < clean.length && index + i < LEN; i++) next[index + i] = clean[i];
      return next;
    });
    boxes.current[Math.min(LEN - 1, index + clean.length)]?.focus();
  }

  async function join() {
    if (code.length !== LEN || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/rooms/${code}`, { cache: "no-store" });
      if (res.status === 404) {
        setError("No room with that code. Check it with your host.");
        return;
      }
      if (!res.ok) throw new Error("bad response");
      track("room_join_shortcut", { source: "home" });
      router.push(`/party?join=${code}`);
    } catch {
      setError("Couldn't reach that room. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative rounded-[1.75rem] border-[3px] border-slate-900 bg-white p-4 text-slate-900 shadow-[6px_6px_0_#0f172a] sm:p-5">
      <span aria-hidden className="absolute -top-5 right-6 flex -space-x-2">
        {["📺", "📱", "🎉"].map((e) => (
          <span key={e} className="grid h-9 w-9 place-items-center rounded-full border-2 border-slate-900 bg-yellow-300 text-base">
            {e}
          </span>
        ))}
      </span>
      <div className="grid items-center gap-4 sm:grid-cols-[auto_auto_1fr]">
        <div>
          <Link
            href="/party"
            onClick={() => track("room_create_shortcut", { source: "home" })}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-6 py-3 text-lg font-black shadow-[4px_4px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a] sm:w-auto"
          >
            Create a room
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <p className="mt-2 max-w-[15rem] text-xs font-semibold text-slate-600">
            Free. Put the code on the TV, everyone plays on their own phone.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:h-full sm:flex-col sm:justify-center" aria-hidden>
          <span className="h-px flex-1 bg-slate-300 sm:h-auto sm:w-px" />
          <span className="text-xs font-bold text-slate-500">or</span>
          <span className="h-px flex-1 bg-slate-300 sm:h-auto sm:w-px" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            join();
          }}
        >
          <p className="text-sm font-black">Join a friend&apos;s room</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5">
              {chars.map((ch, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  value={ch}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFrom(i, ch && v.length > 1 ? v.replace(ch, "") : v);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !ch && i > 0) boxes.current[i - 1]?.focus();
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    setFrom(0, e.clipboardData.getData("text"));
                  }}
                  onFocus={(e) => e.target.select()}
                  inputMode="text"
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={LEN}
                  aria-label={`Room code character ${i + 1}`}
                  className="h-12 w-10 rounded-xl border-[3px] border-slate-900 bg-white text-center font-mono text-xl font-black uppercase outline-none transition-colors focus:bg-yellow-100 focus:ring-2 focus:ring-sky-400 sm:w-11"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={code.length !== LEN || busy}
              className="inline-flex h-12 items-center gap-1.5 rounded-full border-[3px] border-slate-900 bg-sky-300 px-5 text-base font-black shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Join
            </button>
          </div>
          {error ? (
            <p className="mt-2 text-xs font-bold text-rose-600" role="alert">
              {error}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setHelpOpen((o) => !o)}
              className="mt-2 text-xs font-bold underline underline-offset-2"
              aria-expanded={helpOpen}
            >
              Where&apos;s the code?
            </button>
          )}
          {helpOpen && !error ? (
            <p className="mt-1 max-w-sm text-xs text-slate-600">
              It&apos;s the six letters and numbers in big type on the host&apos;s screen. Ask whoever opened the room.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
