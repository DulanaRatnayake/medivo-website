"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Height of the sticky site header — the pinned stage sits just below it. */
const HEADER_HEIGHT = 72;
/** Easing applied each frame towards the scroll target (0–1, higher = snappier). */
const EASE = 0.14;
/** Skip seeks smaller than this (seconds) — roughly half a frame at 24fps. */
const MIN_SEEK_DELTA = 1 / 48;
/** Start downloading once the section is this close to the viewport. */
const PRELOAD_MARGIN = "150% 0px";

interface ScrollVideoProps {
  /** Desktop video (served from /public). Encode with frequent keyframes — see scripts/encode-scroll-video.py. */
  src: string;
  /** Optional lighter rendition for small screens. */
  mobileSrc?: string;
  /** Frame shown while the video loads. */
  poster?: string;
  /** Still image shown instead of the animation when the user prefers reduced motion. */
  reducedMotionImage?: string;
  /** Scroll distance (in vh) over which the video plays from start to end. */
  scrollLength?: number;
  /** Scroll distance (in vh) on screens ≤ 768px wide. */
  mobileScrollLength?: number;
  /** Accessible description of what the animation shows. */
  label: string;
}

/* ── prefers-reduced-motion as an external store (no setState in effects) ── */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

/**
 * A pinned, full-viewport video whose playhead follows the scroll position.
 *
 * The outer section is `scrollLength` vh taller than the viewport; the stage
 * inside it is `position: sticky`, so it stays pinned for exactly that
 * distance and then scrolls away naturally. Scroll progress is read in a
 * requestAnimationFrame loop and written straight to `video.currentTime` and
 * the progress bar — no React state changes while scrolling.
 */
export default function ScrollVideo({
  src,
  mobileSrc,
  poster,
  reducedMotionImage,
  scrollLength = 300,
  mobileScrollLength = 200,
  label,
}: ScrollVideoProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!section || !stage || !video) return;

    let frame = 0;
    let target = 0; // scroll progress, 0–1
    let current = 0; // eased progress actually displayed
    let duration = 0;
    let lastSeek = -1;
    let pendingSeek: number | null = null;
    let objectUrl: string | null = null;
    const abort = new AbortController();

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - stage.offsetHeight;
      if (distance <= 0) return 0;
      return Math.min(1, Math.max(0, (HEADER_HEIGHT - rect.top) / distance));
    };

    const seek = (time: number) => {
      if (Math.abs(time - lastSeek) < MIN_SEEK_DELTA) return;
      // Don't queue seeks while the decoder is busy — keep only the latest.
      if (video.seeking) {
        pendingSeek = time;
        return;
      }
      lastSeek = time;
      video.currentTime = time;
    };

    const render = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${current})`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - current * 12));
      }
      if (duration > 0) {
        // Stop just short of the end: seeking to exactly `duration` can show a blank frame.
        seek(current * Math.max(0, duration - 0.05));
      }
    };

    const tick = () => {
      frame = 0;
      const diff = target - current;
      current = Math.abs(diff) < 0.0005 ? target : current + diff * EASE;
      render();
      if (current !== target) frame = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      target = readProgress();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onSeeked = () => {
      if (pendingSeek === null) return;
      const next = pendingSeek;
      pendingSeek = null;
      seek(next);
    };

    const onMetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    const onLoaded = () => {
      onMetadata();
      // Some mobile browsers (notably iOS Safari) won't paint seeked frames
      // until the element has been played once. Muted inline play is
      // normally allowed; if it's blocked we simply carry on seeking.
      video
        .play()
        .then(() => video.pause())
        .catch(() => {})
        .finally(() => {
          lastSeek = -1;
          current = target = readProgress();
          render();
          setStatus("ready");
        });
    };

    const onError = () => setStatus("error");

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    // Load only when the section approaches. The whole file is fetched into
    // memory first so every seek is served locally instead of as a network
    // range request — this is what makes scrubbing feel instant.
    const load = () => {
      setStatus("loading");
      const url =
        mobileSrc && window.matchMedia("(max-width: 768px)").matches
          ? mobileSrc
          : src;
      fetch(url, { signal: abort.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          video.src = objectUrl;
        })
        .catch(() => {
          if (abort.signal.aborted) return;
          video.src = url; // fall back to streaming the file directly
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    observer.observe(section);
    requestTick();

    return () => {
      observer.disconnect();
      abort.abort();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.removeAttribute("src");
      video.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [reducedMotion, src, mobileSrc]);

  if (reducedMotion) {
    return (
      <section aria-label={label} className="scroll-video scroll-video--static">
        <div className="scroll-video__stage">
          {(reducedMotionImage ?? poster) && (
            <Image
              src={(reducedMotionImage ?? poster)!}
              alt={label}
              fill
              sizes="100vw"
              className="scroll-video__media"
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="scroll-video"
      style={
        {
          "--sv-length": `${scrollLength}vh`,
          "--sv-length-mobile": `${mobileScrollLength}vh`,
        } as React.CSSProperties
      }
    >
      <div ref={stageRef} className="scroll-video__stage">
        <video
          ref={videoRef}
          className="scroll-video__media"
          poster={poster}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
        />

        {(status === "loading" || status === "idle") && (
          <div className="scroll-video__loader" aria-hidden />
        )}

        <div ref={hintRef} className="scroll-video__hint" aria-hidden>
          Scroll to explore
          <span className="scroll-video__hint-arrow" />
        </div>

        <div className="scroll-video__progress" aria-hidden>
          <div ref={barRef} className="scroll-video__progress-bar" />
        </div>
      </div>
    </section>
  );
}
