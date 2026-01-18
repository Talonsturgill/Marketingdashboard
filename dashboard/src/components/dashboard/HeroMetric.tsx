import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroMetricProps {
    value: number | string;
    label: string;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

export function HeroMetric({ value, label, trend }: HeroMetricProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
        >
            {/* Big gradient number */}
            <GradientText
                as="h2"
                variant="primary"
                className="text-6xl md:text-7xl font-bold font-mono tracking-tight"
            >
                {value}
            </GradientText>

            {/* Label */}
            <p className="mt-2 text-slate-400 text-sm uppercase tracking-wider">
                {label}
            </p>

            {/* Trend indicator */}
            {trend && (
                <div className={cn(
                    "mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                    trend.direction === 'up'
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                )}>
                    <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
                    <span>{Math.abs(trend.value)}%</span>
                </div>
            )}
        </motion.div>
    );
}
