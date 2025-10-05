import * as React from "react";
import { cn } from "@/lib/utils";
import { Trophy, Star, Award, Crown } from "lucide-react";

const BadgeLevel = React.forwardRef(
  ({ className, level, size = "md", animated = false, ...props }, ref) => {
    const icons = {
      bronze: Trophy,
      silver: Star,
      gold: Award,
      diamond: Crown
    };

    const sizeClasses = {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-12 w-12 text-base"
    };

    const levelClasses = {
      bronze: "bg-level-bronze text-white",
      silver: "bg-level-silver text-white", 
      gold: "bg-level-gold text-white",
      diamond: "bg-level-diamond text-white"
    };

    const Icon = icons[level];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium shadow-soft",
          sizeClasses[size],
          levelClasses[level],
          animated && "animate-glow",
          className
        )}
        {...props}
      >
        <Icon className="h-1/2 w-1/2" />
      </div>
    );
  }
);
BadgeLevel.displayName = "BadgeLevel";

export { BadgeLevel };
