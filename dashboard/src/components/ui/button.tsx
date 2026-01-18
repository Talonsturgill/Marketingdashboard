import * as React from "react"
import { cn } from "../../lib/utils"

// Needs @radix-ui/react-slot and class-variance-authority if we want full fidelity, 
// but for now I'll stick to a simpler version to avoid endless deps unless I install them.
// Wait, I should probably install 'class-variance-authority' if I use it.
// I'll stick to simple props for now to keep it lightweight as requested.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25': variant === 'primary',
                        'bg-white/10 text-white hover:bg-white/20': variant === 'secondary',
                        'hover:bg-white/5 text-text-secondary hover:text-white': variant === 'ghost',
                        'glass-button text-white': variant === 'glass',

                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
