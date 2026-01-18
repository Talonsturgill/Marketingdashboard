import { cn } from "@/lib/utils";

type Platform = 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';

interface PlatformBadgeProps {
    platform: Platform;
    size?: 'sm' | 'md' | 'lg';
}

// Config for platform styling
const platformConfig = {
    linkedin: {
        icon: '💼', // Or use Lucide/custom SVG
        bg: 'bg-blue-600/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
    },
    twitter: {
        icon: '𝕏',
        bg: 'bg-slate-600/20',
        border: 'border-slate-500/30',
        text: 'text-slate-300',
    },
    instagram: {
        icon: '📸',
        bg: 'bg-pink-600/20',
        border: 'border-pink-500/30',
        text: 'text-pink-400',
    },
    tiktok: {
        icon: '🎵',
        bg: 'bg-cyan-600/20',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
    },
    youtube: {
        icon: '▶️',
        bg: 'bg-red-600/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
    },
};

export function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
    const config = platformConfig[platform];

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full",
            "border backdrop-blur-sm",
            config.bg,
            config.border,
            config.text,
            sizes[size]
        )}>
            <span>{config.icon}</span>
            <span className="capitalize">{platform}</span>
        </span>
    );
}
