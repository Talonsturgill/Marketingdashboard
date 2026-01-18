import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

/**
 * Trigger haptic feedback if available (Mobile/PWA/Android).
 * iOS Webkit doesn't support navigator.vibrate, but this prepares for wrapper.
 */
export const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        switch (pattern) {
            case 'light':
                navigator.vibrate(5); // subtle tick
                break;
            case 'medium':
                navigator.vibrate(15);
                break;
            case 'heavy':
                navigator.vibrate(30);
                break;
            case 'success':
                navigator.vibrate([10, 30, 10]); // double tap
                break;
            case 'error':
                navigator.vibrate([50, 30, 50, 30, 50]); // buzz buzz buzz
                break;
        }
    }
};
