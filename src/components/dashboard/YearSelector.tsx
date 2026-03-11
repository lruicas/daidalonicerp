import { useState } from "react";
import { ChevronDown } from "lucide-react";

const YearSelector = () => {
  const [year, setYear] = useState(2025);
  const [open, setOpen] = useState(false);
  const years = [2023, 2024, 2025, 2026];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
      >
        {year}
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-lg bg-card border border-border z-50 py-1 min-w-[100px]">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => { setYear(y); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-sm transition-opacity hover:opacity-70 ${
                y === year ? "font-semibold text-primary" : "text-foreground"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearSelector;
