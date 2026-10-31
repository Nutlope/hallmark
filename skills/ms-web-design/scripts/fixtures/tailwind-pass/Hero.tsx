import { useState } from "react";

type HeroProps = { onStart?: () => void; readings: Array<{ id: string; label: string }> };

export function Hero({ onStart, readings }: HeroProps) {
  const [sent, setSent] = useState<boolean>(false);
  const start = () => {
    setSent(true);
    if (onStart && readings.length > 0) onStart();
  };
  return (
    <section className="mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl text-ink">Logbooks your crew will keep</h1>
        <p className="mt-4 text-lg text-muted">Write a reading once and the whole crew sees it.</p>
        <button
          type="button"
          onClick={start}
          disabled={sent}
          className="mt-8 h-12 rounded-md bg-accent px-5 text-accent-ink transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px disabled:cursor-not-allowed motion-reduce:transition-none"
        >
          Start a log
        </button>
        <ul className="mt-8 space-y-2">
          {readings.map((r) => (
            <li key={r.id} className="text-sm text-muted">{r.label}</li>
          ))}
        </ul>
      </div>
      <figure data-slot="hero" className="aspect-[4/3] rounded-lg bg-well" />
    </section>
  );
}
