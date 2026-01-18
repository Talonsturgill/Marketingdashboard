import { cn } from "@/lib/utils";

interface GradientTextProps {
    children: React.ReactNode;
    variant?: 'primary' | 'blue' | 'success';
    as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
    className?: string;
}

export function GradientText({
    children,
    variant = 'primary',
    as: Component = 'span',
    className
}: GradientTextProps) {
    const gradients = {
        primary: 'from-violet-400 via-purple-400 to-fuchsia-400',
        blue: 'from-blue-400 via-cyan-400 to-teal-400',
        success: 'from-emerald-400 via-green-400 to-teal-400',
    };

    return (
        <Component
            className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent",
                gradients[variant],
                className
            )}
        >
            {children}
        </Component>
    );
}
