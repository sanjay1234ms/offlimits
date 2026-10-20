const COLORS = [
  "#a3e635",
  "#fde047",
  "#f472b6",
  "#818cf8",
  "#fb923c",
  "#22d3ee",
];
const EMOJI = ["🎉", "✨", "🎲", "🥳"];

/** Fires a short confetti burst from a screen point. The pieces live on
 * document.body, so they keep falling through a client-side page change.
 * Does nothing for visitors who prefer reduced motion. */
export function confettiBurst(x: number, y: number, count = 26): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const emoji = i % 6 === 0;
    piece.textContent = emoji ? EMOJI[i % EMOJI.length] : "";
    piece.setAttribute("aria-hidden", "true");
    Object.assign(piece.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      zIndex: "100",
      pointerEvents: "none",
      width: emoji ? "auto" : `${6 + Math.random() * 6}px`,
      height: emoji ? "auto" : `${8 + Math.random() * 8}px`,
      fontSize: "20px",
      borderRadius: "2px",
      background: emoji ? "transparent" : COLORS[i % COLORS.length],
    });
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const speed = 90 + Math.random() * 170;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 120;
    const spin = (Math.random() - 0.5) * 900;

    const animation = piece.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate(calc(-50% + ${dx * 1.3}px), calc(-50% + ${dy + 320}px)) rotate(${spin}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1100 + Math.random() * 600,
        easing: "cubic-bezier(0.2, 0.7, 0.4, 1)",
      },
    );
    animation.onfinish = () => piece.remove();
  }
}
