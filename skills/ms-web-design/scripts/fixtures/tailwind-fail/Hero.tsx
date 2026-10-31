import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "./cn";

const badge = cva("rounded-full px-2 py-1 text-xs uppercase tracking-widest", {
  variants: { tone: { loud: "font-semibold", calm: "font-normal" } },
});

type HeroProps = { active: boolean; items: Array<{ id: string; label: string }> };

export function Hero({ active, items }: HeroProps) {
  const count = items.length;
  if (count < 1) return null;
  return (
    <section className="hero min-h-screen bg-slate-950 px-6">
      <p className={cn("text-sm font-semibold", active && "text-violet-600")}>Release notes</p>
      <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-5xl text-transparent">
        Logs that sail with you
      </h1>
      <span className="font-mono text-xs">Kept by the crew</span>
      <Link href="/docs" className={`rounded-md px-3 py-2 ${active ? "bg-violet-600" : ""} transition-all`}>
        Read the docs
      </Link>
      <span className={badge({ tone: "loud" })}>New</span>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1a1033]" />
      <ul>
        {items.map((item) => (
          <li key={item.id} className="animate-bounce">{item.label}</li>
        ))}
      </ul>
    </section>
  );
}
