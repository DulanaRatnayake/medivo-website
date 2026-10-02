"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntroScreen
 * Plays the Medivo logo animation video fullscreen (white background)
 * on every hard page load / browser refresh.
 * Because the App Router only remounts layouts on actual navigation
 * events (not client-side route changes), this naturally replays on
 * refresh without replaying on internal link clicks.
 */
export default function IntroScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"playing" | "fading" | "done">("playing");

  useEffect(() => {
    // Prevent scroll while intro is active
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay blocked — skip straight to fade
      startFade();
    });

    const onEnded = () => startFade();
    video.addEventListener("ended", onEnded);

    // Hard safety cap — 10 s max
    const timeout = setTimeout(startFade, 10_000);

    return () => {
      video.removeEventListener("ended", onEnded);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startFade() {
    if (phase !== "playing") return; // guard against double-trigger
    setPhase("fading");
    setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 900);
  }

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="intro-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "fading" ? 0 : 1,
        transition:
          phase === "fading"
            ? "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
    >
      {/* ── Video: fills the screen on desktop, fits the width on phones/tablets
          (sizing lives in globals.css) ── */}
      <video
        ref={videoRef}
        src="/logo-animation.mp4"
        muted
        playsInline
        preload="auto"
        className="intro-video"
      />

      {/* ── Skip button ── */}
      <button
        onClick={startFade}
        aria-label="Skip intro"
        style={{
          position: "absolute",
          bottom: "2.25rem",
          right: "2.25rem",
          zIndex: 1,
          background: "transparent",
          border: "1px solid rgba(1, 31, 68, 0.22)",
          borderRadius: "2rem",
          padding: "0.5rem 1.25rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "rgba(1, 31, 68, 0.45)",
          cursor: "pointer",
          letterSpacing: "0.05em",
          transition: "color 0.2s ease, border-color 0.2s ease",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.color = "#02A9E7";
          el.style.borderColor = "#02A9E7";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.color = "rgba(1, 31, 68, 0.45)";
          el.style.borderColor = "rgba(1, 31, 68, 0.22)";
        }}
      >
        Skip ›
      </button>

      {/* ── Bottom progress bar ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(2, 169, 231, 0.12)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #02A9E7, #0BCEB7)",
            animation: "intro-progress 9s linear forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes intro-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
