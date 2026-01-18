import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface ServiceButtonProps extends HTMLMotionProps<"button"> {
    href?: string;
    label?: string;
}

export function ServiceButton({ className, href, label = "Get Service", ...props }: ServiceButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full",
                "bg-surface-elevated border border-white/10",
                "hover:border-white/20 hover:bg-surface-elevated/80 transition-all duration-300",
                className
            )}
            {...props}
        >
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                {label}
            </span>
            <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                "bg-gradient-to-r from-violet-600 to-pink-500", // Boostly gradient
                "shadow-[0_0_20px_rgba(219,39,119,0.5)]",
                "group-hover:shadow-[0_0_35px_rgba(219,39,119,0.8)] group-hover:scale-110 transition-all duration-300"
            )}>
                <ArrowRight className="w-4 h-4 text-white" />
            </div>
        </motion.button>
    );
}
