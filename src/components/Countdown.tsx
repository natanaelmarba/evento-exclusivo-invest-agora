import { useEffect, useState } from "react";

// TODO: passar {{DATA_EVENTO}} em formato ISO (ex.: 2026-09-15T19:00:00-03:00).
export function Countdown({ targetISO }: { targetISO?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!targetISO) return null;
  const target = new Date(targetISO).getTime();
  if (Number.isNaN(target)) return null;
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const box = "flex flex-col items-center rounded-xl bg-white/10 px-4 py-3 min-w-[72px] backdrop-blur";
  return (
    <div className="flex gap-3 text-white">
      {[
        ["Dias", d], ["Horas", h], ["Min", m], ["Seg", s],
      ].map(([label, val]) => (
        <div key={label as string} className={box}>
          <span className="text-2xl font-bold tabular-nums">{String(val).padStart(2, "0")}</span>
          <span className="text-[10px] uppercase tracking-widest opacity-80">{label}</span>
        </div>
      ))}
    </div>
  );
}
