import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TerminalCardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    status?: 'passing' | 'failing' | 'pending';
}

export function TerminalCard({ children, title, className, status }: TerminalCardProps) {
    const statusColor = status === 'passing' ? 'text-accent-green' :
        status === 'failing' ? 'text-destructive' :
            status === 'pending' ? 'text-accent-yellow' : 'text-muted-foreground';

    const statusText = status ? `[${status.toUpperCase()}]` : '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative rounded-lg overflow-hidden",
                "bg-surface border border-border",
                "shadow-2xl shadow-black/50",
                className
            )}
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                    {/* Traffic Lights */}
                    <div className="flex gap-1.5 mr-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-green/80" />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{title || 'Terminal'}</span>
                </div>
                {status && (
                    <span className={cn("font-mono text-xs", statusColor)}>
                        {statusText}
                    </span>
                )}
            </div>

            {/* Content Content */}
            <div className="p-5 font-mono text-sm relative">
                {/* Scanline pattern overlay (optional, keeping subtle) */}
                <div className="absolute inset-0 bg-repeat opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
