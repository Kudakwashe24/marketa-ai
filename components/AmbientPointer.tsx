"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  cyan: boolean;
};

export default function AmbientPointer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -1_000, y: -1_000, active: false });
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canvas = canvasRef.current;

    if (!canvas || coarsePointer) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    const createParticles = () => {
      const count = Math.min(44, Math.max(22, Math.floor(width / 42)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: index % 7 === 0 ? 1.8 : 1.1,
        cyan: index % 5 === 0,
      }));
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const drawLine = (
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      opacity: number,
      cyan = false
    ) => {
      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.strokeStyle = cyan
        ? `rgba(34, 211, 238, ${opacity})`
        : `rgba(59, 130, 246, ${opacity})`;
      context.lineWidth = 0.75;
      context.stroke();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -12) particle.x = width + 12;
          if (particle.x > width + 12) particle.x = -12;
          if (particle.y < -12) particle.y = height + 12;
          if (particle.y > height + 12) particle.y = -12;
        }

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex++) {
          const next = particles[nextIndex];
          const distance = Math.hypot(particle.x - next.x, particle.y - next.y);

          if (distance < 125) {
            drawLine(
              particle.x,
              particle.y,
              next.x,
              next.y,
              (1 - distance / 125) * 0.1
            );
          }
        }

        if (pointerRef.current.active) {
          const pointerDistance = Math.hypot(
            particle.x - pointerRef.current.x,
            particle.y - pointerRef.current.y
          );

          if (pointerDistance < 190) {
            drawLine(
              particle.x,
              particle.y,
              pointerRef.current.x,
              pointerRef.current.y,
              (1 - pointerDistance / 190) * 0.34,
              particle.cyan
            );
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.cyan
          ? "rgba(103, 232, 249, 0.34)"
          : "rgba(125, 211, 252, 0.38)";
        context.fill();
      });

      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };

      if (cursorRef.current) {
        cursorRef.current.classList.remove("opacity-0");
        cursorRef.current.style.transform = `translate3d(${event.clientX - 6}px, ${event.clientY - 6}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${event.clientX - 160}px, ${event.clientY - 160}px, 0)`;
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      cursorRef.current?.classList.add("opacity-0");
    };

    const handlePointerEnter = () => {
      cursorRef.current?.classList.remove("opacity-0");
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.documentElement.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      document.documentElement.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 640);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] hidden opacity-70 md:block"
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[3] hidden h-80 w-80 rounded-full bg-cyan-500/10 blur-[90px] will-change-transform md:block"
      />
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-3 w-3 rounded-full border border-cyan-200/80 bg-cyan-400/50 opacity-0 shadow-[0_0_18px_rgba(34,211,238,0.9)] transition-opacity md:block"
      />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        data-tooltip="Back to top"
        className={`ai-tooltip fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/25 bg-[#0d1520]/90 text-cyan-200 shadow-[0_10px_40px_rgba(8,145,178,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-110 hover:border-cyan-300/60 hover:text-white ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        ↑
      </button>
    </>
  );
}
