import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientProgressProps {
    value: number;
    max: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function GradientProgress({
    value,
    max,
    variant = 'default',
    showLabel = true,
    size = 'md',
}: GradientProgressProps) {
    const percent = Math.min(100, (value / max) * 100);

    const gradients = {
        default: 'from-violet-500 via-purple-500 to-fuchsia-500',
        success: 'from-emerald-500 via-green-500 to-teal-500',
        warning: 'from-amber-500 via-orange-500 to-yellow-500',
        danger: 'from-rose-500 via-red-500 to-pink-500',
    };

    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">
                        {value} / {max}
                    </span>
                    <span className="text-sm font-mono text-slate-300">
                        {Math.round(percent)}%
                    </span>
                </div>
            )}

            {/* Track */}
            <div className={cn(
                "w-full rounded-full overflow-hidden",
                "bg-slate-800/50 backdrop-blur-sm",
                heights[size]
            )}>
                {/* Fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full",
                        "bg-gradient-to-r",
                        gradients[variant],
                        // Shimmer effect
                        "relative overflow-hidden",
                        "after:absolute after:inset-0",
                        "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
                        "after:translate-x-[-100%] after:animate-shimmer"
                    )}
                />
            </div>
        </div>
    );
}
