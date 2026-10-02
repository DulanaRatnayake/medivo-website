"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Height of the sticky site header — the pinned stage sits just below it. */
const HEADER_HEIGHT = 72;
/** Easing applied each frame towards the scroll target (0–1, higher = snappier). */
const EASE = 0.14;
/** Frames downloaded in parallel. */
const CONCURRENCY = 6;
/** Start downloading once the section is this close to the viewport… */
const PRELOAD_MARGIN = "200% 0px";
/** …or after this long regardless, so it is ready before the visitor arrives. */
const PRELOAD_DELAY_MS = 2500;
/** How much of the frame's edge (fraction of its size) is mirrored into a gap. */
const MIRROR_BAND = 0.14;
/** Edge band (fraction of frame height) re-extended every frame above/below it… */
const LIVE_BAND = 0.05;
/** …and how far that extension reaches (fraction of the drawn frame height). */
const LIVE_REACH = 0.2;
/** Canvas pixel density cap — beyond this the frames are being upscaled anyway. */
const MAX_DPR = 2;
/**
 * Canvas size cap (total pixels). Frames are at most 1280px wide, so a larger
 * canvas only costs fill-rate on 4K/5K screens without adding any sharpness;
 * CSS scales the canvas up to the stage for free.
 */
const MAX_CANVAS_PIXELS = 2560 * 1280;

interface ScrollSequenceProps {
  /** Folder (under /public) holding 001.webp … NNN.webp. See scripts/extract-scroll-frames.py. */
  framesPath: string;
  /** Optional lighter set of frames for screens ≤ 768px wide. */
  mobileFramesPath?: string;
  /** Number of frames in each folder. */
  frameCount: number;
  /** Still image shown instead of the animation when the user prefers reduced motion. */
  reducedMotionImage?: string;
  /** Scroll distance (in vh) over which the animation plays from start to end. */
  scrollLength?: number;
  /** Scroll distance (in vh) on portrait screens. */
  mobileScrollLength?: number;
  /**
   * Fraction of the frame (centred) that must always stay visible. The frame
   * is scaled to fill the stage unless that would crop into this area.
   */
  safeArea?: { width: number; height: number };
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
 * Coarse-to-fine load order: first and last frame, then every 32nd, 16th, …
 * so the whole scroll range is scrubbable almost immediately and simply gets
 * smoother as the remaining frames arrive.
 */
function loadOrder(count: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  const add = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  add(0);
  add(count - 1);
  for (let step = 32; step >= 1; step /= 2) {
    for (let i = 0; i < count; i += step) add(i);
  }
  return order;
}

/**
 * A pinned, full-viewport animation whose frame follows the scroll position.
 *
 * The outer section is `scrollLength` vh taller than the viewport; the stage
 * inside it is `position: sticky`, so it stays pinned for exactly that
 * distance and then scrolls away naturally. Frames are still images drawn to
 * a canvas (rather than a scrubbed <video>), which renders identically on
 * every device. Scroll progress is read in a requestAnimationFrame loop and
 * drawn directly — no React state changes while scrolling.
 */
export default function ScrollSequence({
  framesPath,
  mobileFramesPath,
  frameCount,
  reducedMotionImage,
  scrollLength = 300,
  mobileScrollLength = 200,
  safeArea,
  label,
}: ScrollSequenceProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const safeWidth = safeArea?.width ?? 0.56;
  const safeHeight = safeArea?.height ?? 0.86;

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!section || !stage || !canvas || !ctx) return;

    const frames: (HTMLImageElement | undefined)[] = new Array(frameCount);
    let cancelled = false;
    let started = false;
    let loaded = 0;
    let raf = 0;
    let target = 0; // scroll progress, 0–1
    let current = 0; // eased progress actually displayed
    let drawnKey = "";
    let backgroundDrawn = false;
    // Where a frame is drawn on the canvas (device pixels).
    let box: { x: number; y: number; w: number; h: number } | null = null;
    // Copy of the static fill, and a scratch surface, for `extendVertically`.
    const backdrop = document.createElement("canvas");
    const backdropCtx = backdrop.getContext("2d");
    const liveEdge = document.createElement("canvas");
    const liveEdgeCtx = liveEdge.getContext("2d");

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - stage.offsetHeight;
      if (distance <= 0) return 0;
      return Math.min(1, Math.max(0, (HEADER_HEIGHT - rect.top) / distance));
    };

    /** Nearest frame that has finished loading, searching outwards from `i`. */
    const nearestLoaded = (i: number) => {
      for (let d = 0; d < frameCount; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    /**
     * Scale the frame to fill the stage, but never so far that the safe area
     * (where the product is) gets cropped. On very wide or very tall stages
     * that leaves a gap, which `drawBackground` fills.
     */
    const layout = (img: HTMLImageElement) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.min(
        Math.max(canvas.width / iw, canvas.height / ih),
        canvas.width / (iw * safeWidth),
        canvas.height / (ih * safeHeight)
      );
      // Whole pixels, so the frame's edges stay crisp against the fill.
      const w = Math.round(iw * scale);
      const h = Math.round(ih * scale);
      box = {
        x: Math.round((canvas.width - w) / 2),
        y: Math.round((canvas.height - h) / 2),
        w,
        h,
      };
    };

    /**
     * Fill any gap beside the frame using the frame's own edges, so the fill
     * matches exactly on every screen (a hard-coded CSS colour would not).
     *
     * Two layers: a smooth gradient made from a few averaged edge samples,
     * then the frame's edge band mirrored outwards on top, fading into that
     * gradient. The mirrored band carries the same fine texture as the frame,
     * which hides the join completely.
     */
    const drawBackground = (img: HTMLImageElement) => {
      if (!box) return;
      const { x, y, w, h } = box;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = w / iw;
      const SAMPLES = 16;
      const edge = Math.max(2, Math.round(Math.min(iw, ih) * 0.01));
      const scratch = document.createElement("canvas");
      const sctx = scratch.getContext("2d");
      if (!sctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      /** `horizontal`: gap is left/right of the frame. `far`: right or bottom side. */
      const mirror = (horizontal: boolean, far: boolean) => {
        const gap = horizontal ? x : y;
        const srcLength = Math.min(
          gap / scale,
          (horizontal ? iw : ih) * MIRROR_BAND
        );
        const length = Math.max(1, Math.round(srcLength * scale));
        const pw = horizontal ? length : w;
        const ph = horizontal ? h : length;
        scratch.width = pw; // also resets the context state
        scratch.height = ph;

        sctx.save();
        if (horizontal) {
          sctx.translate(pw, 0);
          sctx.scale(-1, 1);
          sctx.drawImage(img, far ? iw - srcLength : 0, 0, srcLength, ih, 0, 0, pw, ph);
        } else {
          sctx.translate(0, ph);
          sctx.scale(1, -1);
          sctx.drawImage(img, 0, far ? ih - srcLength : 0, iw, srcLength, 0, 0, pw, ph);
        }
        sctx.restore();

        // Fade the band out with distance from the frame.
        const fade = horizontal
          ? sctx.createLinearGradient(far ? pw : 0, 0, far ? 0 : pw, 0)
          : sctx.createLinearGradient(0, far ? ph : 0, 0, far ? 0 : ph);
        fade.addColorStop(0, "rgba(0,0,0,0)");
        fade.addColorStop(0.7, "#000");
        sctx.globalCompositeOperation = "destination-in";
        sctx.fillStyle = fade;
        sctx.fillRect(0, 0, pw, ph);

        ctx.drawImage(
          scratch,
          horizontal ? (far ? x + w : x - pw) : x,
          horizontal ? y : far ? y + h : y - ph
        );
      };

      if (x > 0) {
        scratch.width = 1;
        scratch.height = SAMPLES;
        sctx.drawImage(img, 0, 0, edge, ih, 0, 0, 1, SAMPLES);
        ctx.drawImage(scratch, 0, y, x, h);
        sctx.drawImage(img, iw - edge, 0, edge, ih, 0, 0, 1, SAMPLES);
        ctx.drawImage(scratch, x + w, y, canvas.width - x - w, h);
        mirror(true, false);
        mirror(true, true);
      }
      if (y > 0) {
        scratch.width = SAMPLES;
        scratch.height = 1;
        sctx.drawImage(img, 0, 0, iw, edge, 0, 0, SAMPLES, 1);
        ctx.drawImage(scratch, x, 0, w, y);
        sctx.drawImage(img, 0, ih - edge, iw, edge, 0, 0, SAMPLES, 1);
        ctx.drawImage(scratch, x, y + h, w, canvas.height - y - h);
        mirror(false, false);
        mirror(false, true);
      }
      // High-quality resampling is only worth it for this one-off fill; left
      // on, it makes every frame draw several times more expensive.
      ctx.imageSmoothingQuality = "low";
    };

    /**
     * The left/right edges of the frames never change, but the top/bottom
     * edges do (the product's shadow reaches the bottom edge mid-animation),
     * so a fill drawn once would show a line there. When there is a gap
     * above/below the frame, re-extend the current frame's edge into it on
     * every draw, fading out into the static fill.
     */
    const extendVertically = (img: HTMLImageElement) => {
      if (!box || box.y <= 0 || !backdropCtx || !liveEdgeCtx) return;
      const { x, y, w, h } = box;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const srcLength = ih * LIVE_BAND;
      const length = Math.max(1, Math.min(y, Math.round(h * LIVE_REACH)));

      for (const far of [false, true]) {
        // Restore the static fill first so the fades don't accumulate.
        const gapY = far ? y + h : 0;
        const gapH = far ? canvas.height - (y + h) : y;
        ctx.drawImage(backdrop, 0, gapY, canvas.width, gapH, 0, gapY, canvas.width, gapH);

        liveEdge.width = w; // also resets the context state
        liveEdge.height = length;
        liveEdgeCtx.save();
        liveEdgeCtx.translate(0, length);
        liveEdgeCtx.scale(1, -1);
        liveEdgeCtx.drawImage(img, 0, far ? ih - srcLength : 0, iw, srcLength, 0, 0, w, length);
        liveEdgeCtx.restore();

        const fade = liveEdgeCtx.createLinearGradient(0, far ? length : 0, 0, far ? 0 : length);
        fade.addColorStop(0, "rgba(0,0,0,0)");
        fade.addColorStop(0.55, "rgba(0,0,0,0.45)");
        fade.addColorStop(1, "#000");
        liveEdgeCtx.globalCompositeOperation = "destination-in";
        liveEdgeCtx.fillStyle = fade;
        liveEdgeCtx.fillRect(0, 0, w, length);

        ctx.drawImage(liveEdge, x, far ? y + h : y - length);
      }
    };

    const render = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${current})`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - current * 12));
      }
      if (loaded === 0) return;

      // Blend the two frames either side of the exact position so motion
      // stays smooth between frames; fall back to the nearest loaded frame
      // while the sequence is still downloading.
      const position = current * (frameCount - 1);
      const lower = Math.floor(position);
      const upper = Math.min(frameCount - 1, lower + 1);
      const blend = Math.round((position - lower) * 20) / 20;

      let base = lower;
      let overlay = -1;
      if (frames[lower] && frames[upper] && blend > 0 && upper !== lower) {
        overlay = upper;
      } else {
        base = nearestLoaded(Math.round(position));
      }
      const baseImg = frames[base];
      if (!baseImg) return;

      const key = `${base}:${overlay}:${overlay < 0 ? 0 : blend}`;
      if (key === drawnKey) return;
      drawnKey = key;

      if (!box) layout(baseImg);
      if (!box) return;
      if (!backgroundDrawn) {
        // Prefer the first frame: the product is well clear of its edges.
        drawBackground(frames[0] ?? baseImg);
        backgroundDrawn = true;
        if (box.y > 0 && backdropCtx) {
          backdrop.width = canvas.width;
          backdrop.height = canvas.height;
          backdropCtx.drawImage(canvas, 0, 0);
        }
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(baseImg, box.x, box.y, box.w, box.h);
      const overlayImg = frames[overlay];
      if (overlayImg) {
        ctx.globalAlpha = blend;
        ctx.drawImage(overlayImg, box.x, box.y, box.w, box.h);
        ctx.globalAlpha = 1;
      }
      extendVertically(overlayImg && blend >= 0.5 ? overlayImg : baseImg);
    };

    const tick = () => {
      raf = 0;
      const diff = target - current;
      current = Math.abs(diff) < 0.0005 ? target : current + diff * EASE;
      render();
      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      target = readProgress();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const cssPixels = Math.max(1, stage.clientWidth * stage.clientHeight);
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        MAX_DPR,
        Math.sqrt(MAX_CANVAS_PIXELS / cssPixels)
      );
      const width = Math.round(stage.clientWidth * dpr);
      const height = Math.round(stage.clientHeight * dpr);
      if (width === canvas.width && height === canvas.height) return;
      canvas.width = width; // also clears the canvas
      canvas.height = height;
      box = null;
      backgroundDrawn = false;
      drawnKey = "";
      requestTick();
    };

    /* ── Frame loading ── */

    const startLoading = () => {
      if (started || cancelled) return;
      started = true;
      const base =
        mobileFramesPath && window.matchMedia("(max-width: 768px)").matches
          ? mobileFramesPath
          : framesPath;
      const order = loadOrder(frameCount);
      let next = 0;
      let settled = 0;

      const pump = () => {
        if (cancelled) return;
        let active = next - settled;
        while (active < CONCURRENCY && next < order.length) {
          const index = order[next++];
          active++;
          const img = new window.Image();
          img.decoding = "async";
          img.onload = async () => {
            // Decode off the main thread now, so the first time this frame is
            // drawn doesn't stall the scroll.
            try {
              await img.decode();
            } catch {
              // Decoding lazily on first draw still works.
            }
            settled++;
            if (cancelled) return;
            frames[index] = img;
            if (index === 0 && loaded > 0) {
              // Background was drawn from another frame; redo it from this one.
              backgroundDrawn = false;
              drawnKey = "";
            }
            if (++loaded === 1) {
              // Jump straight to the right frame rather than easing in from 0.
              current = target = readProgress();
              setStatus("ready");
            }
            requestTick();
            pump();
          };
          img.onerror = () => {
            settled++;
            if (cancelled) return;
            if (settled === order.length && loaded === 0) setStatus("error");
            pump();
          };
          img.src = `${base}/${String(index + 1).padStart(3, "0")}.webp`;
        }
      };
      pump();
    };

    const visibility = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) startLoading();
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    visibility.observe(section);
    const preloadTimer = window.setTimeout(startLoading, PRELOAD_DELAY_MS);

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(stage);
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    resize();
    requestTick();

    return () => {
      cancelled = true;
      visibility.disconnect();
      sizeObserver.disconnect();
      window.clearTimeout(preloadTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
    };
  }, [
    reducedMotion,
    framesPath,
    mobileFramesPath,
    frameCount,
    safeWidth,
    safeHeight,
  ]);

  if (reducedMotion) {
    return (
      <section aria-label={label} className="scroll-video scroll-video--static">
        <div className="scroll-video__stage">
          {reducedMotionImage && (
            <Image
              src={reducedMotionImage}
              alt={label}
              fill
              sizes="100vw"
              className="scroll-video__still"
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
        <canvas ref={canvasRef} className="scroll-video__canvas" aria-hidden />

        {status === "loading" && (
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
