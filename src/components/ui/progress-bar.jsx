import * as React from "react";
import { cn } from "@/lib/utils";

const ProgressBar = React.forwardRef(
  ({ className, value, max = 100, variant = "default", showPercentage = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      level: "bg-gradient-to-r from-level-bronze via-level-gold to-level-diamond"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            variants[variant]
          )}
          style={{
            width: `${percentage}%`,
            transform: "translateX(0)"
          }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
