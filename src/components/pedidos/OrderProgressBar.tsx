import { ORDER_STEPS } from "@/lib/orders-data";
import type { OrderStatus } from "@/lib/orders-data";
import { Check } from "lucide-react";

interface OrderProgressBarProps {
  currentStatus: OrderStatus;
}

const OrderProgressBar = ({ currentStatus }: OrderProgressBarProps) => {
  const currentIdx = ORDER_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center w-full gap-0">
      {ORDER_STEPS.map((step, i) => {
        const completed = i <= currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completed ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] leading-tight text-center max-w-[80px] ${
                  completed ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 transition-colors ${
                  i < currentIdx ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderProgressBar;
