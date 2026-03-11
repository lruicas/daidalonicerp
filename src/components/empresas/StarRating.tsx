import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

const StarRating = ({ value, onChange, readonly = false }: StarRatingProps) => {
  const stars = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={`p-0 h-4 w-4 border-0 bg-transparent transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
      <span className="ml-1 text-xs font-medium text-muted-foreground">{value}/10</span>
    </div>
  );
};

export default StarRating;
