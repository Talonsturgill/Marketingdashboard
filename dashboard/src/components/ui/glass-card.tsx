import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: 'purple' | 'blue' | 'cyan' | 'none';
}

export function GlassCard({
    children,
    className,
    hover = true,
    glow = 'none'
}: GlassCardProps) {
    const glowStyles = {
        purple: 'hover:shadow-glow-purple',
        blue: 'hover:shadow-glow-blue',
        cyan: 'hover:shadow-glow-cyan',
        none: '',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
            className={cn(
                // Base glass effect
                "relative overflow-hidden rounded-2xl",
                "bg-surface-elevated/80 backdrop-blur-xl", // Slightly less opaque to catch spotlight
                "border border-white/10", // Sharper border for high contrast
                // Subtle inner glow
                "before:absolute before:inset-0 before:rounded-2xl",
                "before:bg-gradient-to-b before:from-white/5 before:to-transparent",
                "before:pointer-events-none",
                // Hover effects
                hover && "transition-all duration-300 ease-out cursor-pointer",
                hover && glowStyles[glow],
                className
            )}
        >
            {children}
        </motion.div>
    );
}
