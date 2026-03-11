import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: { value: string; positive: boolean };
  variant: "primary" | "secondary" | "accent";
  children?: React.ReactNode;
}

const bgMap = {
  primary: "bg-primary-light",
  secondary: "bg-secondary-light",
  accent: "bg-accent-light",
};

const accentColorMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const KpiCard = ({ title, value, trend, variant, children }: KpiCardProps) => {
  return (
    <div className={`rounded-xl ${bgMap[variant]} p-6 flex flex-col justify-between min-h-[160px]`}>
      <p className={`text-sm font-medium ${accentColorMap[variant]} opacity-80`}>{title}</p>
      {children ? (
        <div className="flex-1 flex items-center justify-center">{children}</div>
      ) : (
        <>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.positive ? (
                <TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} />
              ) : (
                <TrendingDown className="h-4 w-4 text-accent" strokeWidth={1.5} />
              )}
              <span className={`text-xs font-medium ${trend.positive ? "text-primary" : "text-accent"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KpiCard;
