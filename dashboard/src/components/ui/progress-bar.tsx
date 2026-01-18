import { cn } from '../../lib/utils';

interface ProgressBarProps {
    value: number; // 0 to 100
    max?: number;
    className?: string;
    variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({ value, max = 100, className, variant = 'primary' }: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const gradients = {
        primary: 'bg-gradient-primary',
        success: 'bg-gradient-success',
        warning: 'bg-gradient-warning',
        danger: 'bg-gradient-danger',
    };

    return (
        <div className={cn("h-2 w-full bg-white/5 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full transition-all duration-500 ease-out rounded-full shadow-lg", gradients[variant])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
