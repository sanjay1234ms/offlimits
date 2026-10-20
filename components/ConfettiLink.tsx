"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { confettiBurst } from "@/lib/confetti";

/** A Link that pops confetti from where it was clicked. */
export function ConfettiLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        confettiBurst(r.left + r.width / 2, r.top + r.height / 2);
        onClick?.(e);
      }}
    />
  );
}
