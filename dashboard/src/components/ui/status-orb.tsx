import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatusOrbProps {
    status: 'green' | 'yellow' | 'red' | 'gray';
    size?: 'sm' | 'md' | 'lg';
    pulse?: boolean;
}

export function StatusOrb({ status, size = 'md', pulse = true }: StatusOrbProps) {
    const colors = {
        green: {
            bg: 'bg-emerald-500',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]',
            ring: 'ring-emerald-500/30',
        },
        yellow: {
            bg: 'bg-amber-500',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
            ring: 'ring-amber-500/30',
        },
        red: {
            bg: 'bg-rose-500',
            glow: 'shadow-[0_0_20px_rgba(244,63,94,0.6)]',
            ring: 'ring-rose-500/30',
        },
        gray: {
            bg: 'bg-slate-500',
            glow: 'shadow-[0_0_10px_rgba(100,116,139,0.4)]',
            ring: 'ring-slate-500/30',
        },
    };

    const sizes = {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-8 h-8',
    };

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
        >
            {/* Outer glow ring */}
            <div className={cn(
                "absolute inset-0 rounded-full ring-4",
                colors[status].ring,
                sizes[size]
            )} />

            {/* Main orb */}
            <motion.div
                animate={pulse ? {
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1]
                } : undefined}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "rounded-full",
                    colors[status].bg,
                    colors[status].glow,
                    sizes[size]
                )}
            />
        </motion.div>
    );
}
