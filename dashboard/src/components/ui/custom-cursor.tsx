import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isPointer, setIsPointer] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for the ring
    const springConfig = { damping: 20, stiffness: 150 };
    const ringX = useSpring(mouseX, springConfig);
    const ringY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Check if hovering over clickable element
            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON'
            );
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [mouseX, mouseY]);

    return (
        <>
            {/* The main dot (follows mouse exactly) */}
            <motion.div
                className="cursor-dot"
                style={{
                    left: mouseX,
                    top: mouseY,
                    scale: isPointer ? 1.5 : 1,
                }}
            />

            {/* The trailing ring (spring physics) */}
            <motion.div
                className="cursor-ring"
                style={{
                    left: ringX,
                    top: ringY,
                    scale: isPointer ? 1.5 : 1,
                    borderColor: isPointer ? '#4285F4' : 'rgba(66, 133, 244, 0.3)',
                    backgroundColor: isPointer ? 'rgba(66, 133, 244, 0.05)' : 'transparent',
                }}
            />
        </>
    );
}
