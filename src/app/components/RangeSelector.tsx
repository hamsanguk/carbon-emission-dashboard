'use client';
import { useDashboardStore } from "../store/useDashboardStore";

export default function RangeSelector() {
  const { range, setRange } = useDashboardStore();
  const options = [3, 6, 9, 12];
  
  return (
    <div className="flex gap-2 mb-4">
      {options.map((n) => (
        <button
          key={n}
          onClick={() => setRange(n)}
          className={`px-3 py-1 rounded border transition-colors ${
            range === n
              ? "bg-white text-accent border-accent"
              : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
          }`}
        >
          {n}개월
        </button>
      ))}
    </div>
  );
}
