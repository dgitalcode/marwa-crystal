import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
};

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} sur ${max}`}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            className={cn(
              iconSize,
              filled ? "fill-accent text-accent" : "fill-transparent text-border",
            )}
          />
        );
      })}
    </div>
  );
}

type StarRatingInputProps = {
  name: string;
  defaultValue?: number;
  disabled?: boolean;
};

export function StarRatingInput({ name, defaultValue = 5, disabled }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        return (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={value}
              defaultChecked={value === defaultValue}
              disabled={disabled}
              className="peer sr-only"
            />
            <Star className="h-6 w-6 fill-transparent text-border transition peer-checked:fill-accent peer-checked:text-accent peer-focus-visible:scale-110 hover:scale-110 hover:text-accent" />
          </label>
        );
      })}
    </div>
  );
}
