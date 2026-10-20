"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type SwipeDirection = -1 | 1;

export interface SwipeCardHandle {
  /** Throw the card off-screen (as if swiped), then call onSwipe. */
  fling: (dir?: SwipeDirection) => void;
}

interface SwipeCardProps {
  children: React.ReactNode;
  /** Called once the card has left the screen. */
  onSwipe: (dir: SwipeDirection) => void;
  disabled?: boolean;
  /** Stamp shown while dragging left / right. */
  leftLabel?: string;
  rightLabel?: string;
}

/** Drag distance (px) or release speed (px/ms) that counts as a swipe. */
const DISTANCE = 100;
const VELOCITY = 0.55;

/** Wraps a game card so it can be swiped or flung away like a real card,
 * with a little deck peeking out underneath. Vertical drags still scroll
 * the page; buttons and keys can call `fling()` for the same animation.
 * Reduced-motion visitors get an instant change instead. */
export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(
  function SwipeCard(
    {
      children,
      onSwipe,
      disabled = false,
      leftLabel = "Next",
      rightLabel = "Next",
    },
    ref,
  ) {
    const card = useRef<HTMLDivElement>(null);
    const leftStamp = useRef<HTMLSpanElement>(null);
    const rightStamp = useRef<HTMLSpanElement>(null);
    const drag = useRef<{
      id: number;
      x: number;
      y: number;
      t: number;
      active: boolean;
    } | null>(null);
    const leaving = useRef(false);
    const mounted = useRef(true);
    const onSwipeRef = useRef(onSwipe);
    onSwipeRef.current = onSwipe;

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    function place(x: number, animate: boolean) {
      const el = card.current;
      if (!el) return;
      el.style.transition = animate
        ? "transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease"
        : "none";
      el.style.transform = x
        ? `translate3d(${x}px, ${Math.abs(x) * 0.06}px, 0) rotate(${x * 0.06}deg)`
        : "";
      const show = Math.min(1, Math.abs(x) / DISTANCE);
      if (leftStamp.current)
        leftStamp.current.style.opacity = String(x < 0 ? show : 0);
      if (rightStamp.current)
        rightStamp.current.style.opacity = String(x > 0 ? show : 0);
    }

    function fling(dir: SwipeDirection = -1) {
      if (leaving.current || disabled) return;
      const el = card.current;
      if (
        !el ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        onSwipeRef.current(dir);
        return;
      }
      leaving.current = true;
      el.style.transition =
        "transform 0.34s cubic-bezier(0.55, 0, 0.8, 0.4), opacity 0.34s ease";
      el.style.transform = `translate3d(${dir * Math.max(480, window.innerWidth)}px, 60px, 0) rotate(${dir * 26}deg)`;
      el.style.opacity = "0";
      window.setTimeout(() => {
        onSwipeRef.current(dir);
        // If the parent kept this same card (say a paywall opened instead
        // of a new card), bring it back.
        window.setTimeout(() => {
          if (!mounted.current) return;
          leaving.current = false;
          if (card.current) card.current.style.opacity = "";
          place(0, true);
        }, 60);
      }, 260);
    }

    useImperativeHandle(ref, () => ({ fling }));

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
      if (disabled || leaving.current || e.button !== 0) return;
      drag.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
        active: false,
      };
    }

    function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (!d.active) {
        // Let vertical drags scroll the page.
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          drag.current = null;
          return;
        }
        if (Math.abs(dx) < 8) return;
        d.active = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      place(dx, false);
    }

    function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
      const d = drag.current;
      drag.current = null;
      if (!d || d.id !== e.pointerId || !d.active) return;
      const dx = e.clientX - d.x;
      const speed = Math.abs(dx) / Math.max(1, performance.now() - d.t);
      if (Math.abs(dx) > DISTANCE || (speed > VELOCITY && Math.abs(dx) > 30)) {
        fling(dx < 0 ? -1 : 1);
      } else {
        place(0, true);
      }
    }

    return (
      <div className="relative w-full touch-pan-y">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -bottom-3 top-3 rotate-[1.5deg] rounded-[1.75rem] border border-white/10 bg-white/[0.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -bottom-6 top-6 -rotate-[1.5deg] rounded-[1.75rem] border border-white/5 bg-white/[0.02]"
        />
        <div
          ref={card}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`relative will-change-transform ${
            disabled ? "" : "cursor-grab select-none active:cursor-grabbing"
          }`}
        >
          {children}
          <span
            ref={leftStamp}
            aria-hidden
            style={{ opacity: 0 }}
            className="pointer-events-none absolute right-5 top-5 rotate-12 rounded-xl border-[3px] border-sky-400 px-3 py-1 text-lg font-black uppercase tracking-wider text-sky-300"
          >
            {leftLabel}
          </span>
          <span
            ref={rightStamp}
            aria-hidden
            style={{ opacity: 0 }}
            className="pointer-events-none absolute left-5 top-5 -rotate-12 rounded-xl border-[3px] border-lime-400 px-3 py-1 text-lg font-black uppercase tracking-wider text-lime-300"
          >
            {rightLabel}
          </span>
        </div>
      </div>
    );
  },
);
