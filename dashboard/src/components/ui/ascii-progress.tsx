import { cn } from "@/lib/utils";

interface AsciiProgressProps {
    value: number; // 0 to 100
    total?: number; // e.g., 8/13
    max?: number; // e.g., 13
    label: string;
    status?: 'on_track' | 'behind' | 'complete' | 'not_started';
    width?: number; // Number of characters for the bar
}

export function AsciiProgress({
    value,
    total,
    max,
    label,
    status = 'on_track',
    width = 20
}: AsciiProgressProps) {
    const percent = Math.min(100, Math.max(0, value));
    const filledCount = Math.round((percent / 100) * width);
    const emptyCount = width - filledCount;

    const filledBar = '█'.repeat(filledCount);
    const emptyBar = '░'.repeat(emptyCount);

    const statusConfig = {
        on_track: { symbol: '✓', text: 'ON_TRACK', color: 'text-accent-green' },
        behind: { symbol: '⚠', text: 'BEHIND', color: 'text-accent-yellow' },
        complete: { symbol: '✓', text: 'COMPLETE', color: 'text-accent-green' },
        not_started: { symbol: '✗', text: 'NOT_STARTED', color: 'text-destructive' },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="font-mono text-sm flex items-center gap-4 py-1">
            <span className="w-24 text-muted-foreground truncate">{label}</span>
            <div className="flex items-center gap-3">
                <span className="text-primary tracking-tighter">[{filledBar}<span className="text-surface-elevated">{emptyBar}</span>]</span>
                {total !== undefined && max !== undefined && (
                    <span className="w-16 text-right text-foreground">{total}/{max}</span>
                )}
                <span className={cn("flex items-center gap-2 min-w-[120px]", currentStatus.color)}>
                    <span>{currentStatus.symbol}</span>
                    <span className="text-xs">{currentStatus.text}</span>
                </span>
            </div>
        </div>
    );
}
