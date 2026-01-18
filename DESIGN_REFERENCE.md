# 🎨 Design Reference: Antigravity-Inspired Dashboard

**Upload this file alongside the main prompt to give Antigravity concrete design examples.**

---

## Color System Implementation

```css
/* tailwind.config.js extension */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'surface': {
          'deep': '#050508',
          'base': '#0a0a12',
          'elevated': '#12121f',
          'card': 'rgba(18, 18, 31, 0.7)',
        },
        // Accent colors
        'accent': {
          'purple': '#8b5cf6',
          'blue': '#3b82f6',
          'cyan': '#06b6d4',
          'emerald': '#10b981',
          'amber': '#f59e0b',
          'rose': '#f43f5e',
        },
      },
      backgroundImage: {
        // Signature gradients
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        'gradient-blue-cyan': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
        // Subtle radial for backgrounds
        'radial-glow': 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-purple': '0 0 60px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 60px rgba(59, 130, 246, 0.3)',
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
};
```

---

## Glass Card Component

```tsx
// components/ui/GlassCard.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'purple' | 'blue' | 'cyan' | 'none';
}

export function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = 'none' 
}: GlassCardProps) {
  const glowStyles = {
    purple: 'hover:shadow-glow-purple',
    blue: 'hover:shadow-glow-blue',
    cyan: 'hover:shadow-glow-cyan',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={cn(
        // Base glass effect
        "relative overflow-hidden rounded-2xl",
        "bg-surface-card backdrop-blur-glass",
        "border border-white/5",
        // Subtle inner glow
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-gradient-to-b before:from-white/5 before:to-transparent",
        "before:pointer-events-none",
        // Hover effects
        hover && "transition-all duration-300 ease-out cursor-pointer",
        hover && glowStyles[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
```

---

## Gradient Text Component

```tsx
// components/ui/GradientText.tsx
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
```

---

## Hero Metric Display

```tsx
// components/dashboard/HeroMetric.tsx
import { GradientText } from "@/components/ui/GradientText";
import { motion } from "framer-motion";

interface HeroMetricProps {
  value: number | string;
  label: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export function HeroMetric({ value, label, trend }: HeroMetricProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      {/* Big gradient number */}
      <GradientText 
        as="h2" 
        variant="primary"
        className="text-6xl md:text-7xl font-bold font-mono tracking-tight"
      >
        {value}
      </GradientText>
      
      {/* Label */}
      <p className="mt-2 text-slate-400 text-sm uppercase tracking-wider">
        {label}
      </p>
      
      {/* Trend indicator */}
      {trend && (
        <div className={cn(
          "mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
          trend.direction === 'up' 
            ? "bg-emerald-500/10 text-emerald-400" 
            : "bg-rose-500/10 text-rose-400"
        )}>
          <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </motion.div>
  );
}
```

---

## Glowing Status Orb

```tsx
// components/ui/StatusOrb.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatusOrbProps {
  status: 'green' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export function StatusOrb({ status, size = 'md', pulse = true }: StatusOrbProps) {
  const colors = {
    green: {
      bg: 'bg-emerald-500',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]',
      ring: 'ring-emerald-500/30',
    },
    yellow: {
      bg: 'bg-amber-500',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      ring: 'ring-amber-500/30',
    },
    red: {
      bg: 'bg-rose-500',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.6)]',
      ring: 'ring-rose-500/30',
    },
    gray: {
      bg: 'bg-slate-500',
      glow: 'shadow-[0_0_10px_rgba(100,116,139,0.4)]',
      ring: 'ring-slate-500/30',
    },
  };

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      {/* Outer glow ring */}
      <div className={cn(
        "absolute inset-0 rounded-full ring-4",
        colors[status].ring,
        sizes[size]
      )} />
      
      {/* Main orb */}
      <motion.div
        animate={pulse ? { 
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1] 
        } : undefined}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className={cn(
          "rounded-full",
          colors[status].bg,
          colors[status].glow,
          sizes[size]
        )}
      />
    </motion.div>
  );
}
```

---

## Animated Progress Bar

```tsx
// components/ui/GradientProgress.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientProgressProps {
  value: number;
  max: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function GradientProgress({
  value,
  max,
  variant = 'default',
  showLabel = true,
  size = 'md',
}: GradientProgressProps) {
  const percent = Math.min(100, (value / max) * 100);
  
  const gradients = {
    default: 'from-violet-500 via-purple-500 to-fuchsia-500',
    success: 'from-emerald-500 via-green-500 to-teal-500',
    warning: 'from-amber-500 via-orange-500 to-yellow-500',
    danger: 'from-rose-500 via-red-500 to-pink-500',
  };
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">
            {value} / {max}
          </span>
          <span className="text-sm font-mono text-slate-300">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      
      {/* Track */}
      <div className={cn(
        "w-full rounded-full overflow-hidden",
        "bg-slate-800/50 backdrop-blur-sm",
        heights[size]
      )}>
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            "bg-gradient-to-r",
            gradients[variant],
            // Shimmer effect
            "relative overflow-hidden",
            "after:absolute after:inset-0",
            "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
            "after:translate-x-[-100%] after:animate-shimmer"
          )}
        />
      </div>
    </div>
  );
}
```

---

## Bento Grid Layout

```tsx
// components/layout/BentoGrid.tsx
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid gap-4",
      // Responsive bento layout
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      "auto-rows-[minmax(180px,auto)]",
      className
    )}>
      {children}
    </div>
  );
}

// Use with size classes on children:
// - col-span-1 (default)
// - col-span-2 (wide)
// - col-span-4 (full width)
// - row-span-2 (tall)
```

---

## Platform Icon Badge

```tsx
// components/ui/PlatformBadge.tsx
import { cn } from "@/lib/utils";

type Platform = 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
}

const EVENT_GOAL_DEFAULTS = {
  flagship: {
    // 6-month promotion cycle (conferences, major launches)
    linkedin: 13,
    instagram: 15,
    twitter: 2,   // Repost from LinkedIn + 2 week of
    tiktok: 0,
    youtube: 0    // Post-event if applicable
  },
  standard: {
    // Tech advisor series, IT automation workshops
    linkedin: 5,
    instagram: 2,
    twitter: 2,
    tiktok: 0,
    youtube: 0
  },
  community: {
    // Client meetups, local networking
    linkedin: 6,
    instagram: 2,  // Pre(1) + Week(1) + Post(1) = 3? Tables says Total 2. We'll use 2.
    twitter: 0,
    tiktok: 2,
    youtube: 0
  },
  virtual: {
    // Roundtables, online consultations
    linkedin: 3,
    instagram: 0,
    twitter: 0,
    tiktok: 0,
    youtube: 0
  }
};
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
```

---

## Custom Recharts Theme

```tsx
// lib/chartTheme.ts
export const chartTheme = {
  // Colors for data series
  colors: [
    '#8b5cf6', // Purple
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#f43f5e', // Rose
  ],
  
  // Axis styling
  axis: {
    stroke: '#334155', // slate-700
    fontSize: 12,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  
  // Grid
  grid: {
    stroke: '#1e293b', // slate-800
    strokeDasharray: '3 3',
  },
  
  // Tooltip
  tooltip: {
    background: 'rgba(15, 23, 42, 0.95)', // slate-900 with opacity
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
};

// Custom tooltip component
export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ background: entry.color }} 
          />
          <span className="text-white font-mono text-sm">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

## Ring Particle Background (Optional Hero Effect)

```tsx
// components/effects/RingParticles.tsx
import { useEffect, useRef } from 'react';

export function RingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Particle animation logic here
    // Creates orbiting dots that form ring patterns
    // Similar to Antigravity hero section
    
    const particles: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      alpha: number;
    }> = [];
    
    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 200 + Math.random() * 150,
        speed: 0.001 + Math.random() * 0.002,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      particles.forEach(p => {
        p.angle += p.speed;
        
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;
        
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      width={800}
      height={600}
    />
  );
}
```

---

## Global CSS Additions

```css
/* Add to globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface-deep text-slate-100 antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-surface-base;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-700 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-600;
  }
}

@layer utilities {
  /* Shimmer animation for progress bars */
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  /* Pulse glow for status indicators */
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  /* Gradient text helper */
  .text-gradient {
    @apply bg-clip-text text-transparent;
  }
  
  /* Glass effect helper */
  .glass {
    @apply bg-surface-card backdrop-blur-glass border border-white/5;
  }
}
```

---

## Example Page Layout

```tsx
// pages/index.tsx - Dashboard Overview
import { GlassCard } from "@/components/ui/GlassCard";
import { HeroMetric } from "@/components/dashboard/HeroMetric";
import { StatusOrb } from "@/components/ui/StatusOrb";
import { GradientProgress } from "@/components/ui/GradientProgress";
import { BentoGrid } from "@/components/layout/BentoGrid";
import { GradientText } from "@/components/ui/GradientText";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-surface-deep">
      {/* Subtle radial glow in background */}
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />
      
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <GradientText as="h1" variant="primary" className="text-4xl font-bold mb-2">
            Marketing Dashboard
          </GradientText>
          <p className="text-slate-400">
            Transform Labs • Updated 5 minutes ago
          </p>
        </div>
        
        {/* Hero Metrics Row */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <HeroMetric 
            value={47} 
            label="Posts This Month" 
            trend={{ value: 18, direction: 'up' }} 
          />
          <div className="flex flex-col items-center">
            <StatusOrb status="green" size="lg" />
            <p className="mt-4 text-slate-400">Overall Health</p>
          </div>
          <HeroMetric 
            value={14} 
            label="Days Until Event" 
          />
        </div>
        
        {/* Bento Grid */}
        <BentoGrid>
          {/* Active Event Card - spans 2 columns */}
          <GlassCard className="col-span-2 p-6" glow="purple">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">AI Summit 2026</h3>
                <p className="text-slate-400 text-sm">Flagship Event • Week 3 of 6</p>
              </div>
              <StatusOrb status="green" />
            </div>
            <GradientProgress value={8} max={13} variant="default" />
          </GlassCard>
          
          {/* More cards... */}
        </BentoGrid>
      </main>
    </div>
  );
}
```

---

## Key Visual Principles Summary

1. **Depth through transparency** - Use rgba backgrounds, not solid colors
2. **Glow, don't shadow** - Status indicators and hover states glow outward
3. **Gradient everything** - Text, progress bars, buttons use subtle gradients
4. **Animate purposefully** - Smooth entrances, hover lifts, pulse on important items
5. **Whitespace is premium** - Don't crowd the interface
6. **Dark is default** - Design for dark mode first, light mode as alternative
7. **Glass over flat** - Backdrop blur on elevated surfaces

---

*This design reference should be uploaded alongside the main prompt to ensure Antigravity understands the visual direction.*