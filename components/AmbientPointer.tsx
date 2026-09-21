"use client";

import { useEffect, useRef } from "react";

export default function AmbientPointer() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!glowRef.current) return;
        glowRef.current.style.transform = `translate3d(${event.clientX - 160}px, ${event.clientY - 160}px, 0)`;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-80 w-80 rounded-full bg-violet-500/10 blur-[90px] md:block"
    />
  );
}
