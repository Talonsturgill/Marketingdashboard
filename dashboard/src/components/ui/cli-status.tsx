import { cn } from "@/lib/utils";

interface CliStatusProps {
    status: 'operational' | 'degraded' | 'down' | 'active' | 'passing' | 'failing' | 'pending';
    className?: string;
}

export function CliStatus({ status, className }: CliStatusProps) {
    const config = {
        operational: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
        active: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
        passing: { color: 'text-accent-green', bg: 'bg-accent-green/10' },

        degraded: { color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
        pending: { color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },

        down: { color: 'text-destructive', bg: 'bg-destructive/10' },
        failing: { color: 'text-destructive', bg: 'bg-destructive/10' },
    };

    const theme = config[status] || config.pending;

    return (
        <span className={cn(
            "font-mono text-xs px-2 py-0.5 rounded",
            theme.color,
            theme.bg,
            className
        )}>
            [{status.toUpperCase()}]
        </span>
    );
}
