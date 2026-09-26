"use client";

import { useEffect, useState } from "react";

const DEMOS = [
  {
    prompt: "Promote our Friday car wash special for Cape Town drivers.",
    caption:
      "Cape Town, your Friday shine is sorted 🚘✨ Book our wash special and roll into the weekend spotless.",
    whatsapp:
      "Friday plans? Let us handle the clean-up. Reply BOOK to reserve your car wash slot.",
  },
  {
    prompt: "Launch a weekend burger combo with a free drink.",
    caption:
      "Weekend hunger, handled 🍔 Grab our burger combo and enjoy a free drink while the offer lasts.",
    whatsapp:
      "Your weekend combo is ready 🍟 Reply ORDER and we’ll prepare yours.",
  },
];

const TYPE_SPEED = 34;

export default function AnimatedCampaignDemo() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [phase, setPhase] = useState<"typing" | "thinking" | "ready">("typing");
  const demo = DEMOS[demoIndex];

  useEffect(() => {
    let position = 0;

    const typeTimer = window.setInterval(() => {
      position += 1;
      setTypedPrompt(demo.prompt.slice(0, position));
      if (position >= demo.prompt.length) {
        window.clearInterval(typeTimer);
        setPhase("thinking");
      }
    }, TYPE_SPEED);

    return () => window.clearInterval(typeTimer);
  }, [demo.prompt]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const revealTimer = window.setTimeout(() => setPhase("ready"), 900);
    return () => window.clearTimeout(revealTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
    const nextTimer = window.setTimeout(() => {
      setTypedPrompt("");
      setPhase("typing");
      setDemoIndex((current) => (current + 1) % DEMOS.length);
    }, 5200);
    return () => window.clearTimeout(nextTimer);
  }, [phase]);

  return (
    <div className="relative mx-auto w-full max-w-xl" aria-label="Animated Marketa AI campaign example">
      <div className="absolute -inset-7 rounded-[2.75rem] bg-gradient-to-r from-blue-500/20 via-cyan-400/10 to-indigo-500/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#0b111c]/95 p-4 shadow-2xl shadow-blue-950/50 backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="ai-pulse flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">✦</span>
            <div>
              <p className="text-sm font-medium text-white">Marketa AI</p>
              <p className="text-xs text-emerald-400">● Brand context connected</p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 text-[11px] text-cyan-100/70">
            Live demo
          </span>
        </div>

        <div className="min-h-[21rem] space-y-5 py-6">
          <div className="ml-auto min-h-[4rem] max-w-[90%] rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600 to-cyan-600 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-blue-950/30">
            {typedPrompt}
            {phase === "typing" ? <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white" /> : null}
          </div>

          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-sm text-cyan-300">✦</span>
            <div className="min-w-0 flex-1">
              {phase === "thinking" ? (
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.035] px-4 py-5 text-sm text-slate-400">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="ai-thinking-dot" />
                    <span className="ai-thinking-dot [animation-delay:160ms]" />
                    <span className="ai-thinking-dot [animation-delay:320ms]" />
                  </span>
                  Building campaign
                </div>
              ) : phase === "ready" ? (
                <div className="ai-reveal rounded-2xl rounded-tl-md border border-cyan-300/15 bg-white/[0.035] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Campaign ready ✨</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/10 p-3">
                      <p className="text-xs font-medium text-white">📱 Social caption</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{demo.caption}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/10 p-3">
                      <p className="text-xs font-medium text-white">💬 WhatsApp promo</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{demo.whatsapp}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-blue-400/15 bg-blue-500/10 px-3 py-2 text-center text-xs font-medium text-blue-100">
                    Create branded poster →
                  </div>
                </div>
              ) : (
                <div className="h-16" />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="px-2 pb-4 text-sm text-slate-600">Ask Marketa to build your campaign...</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400">+</span>
            <span className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-medium text-white">Generate ↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}
