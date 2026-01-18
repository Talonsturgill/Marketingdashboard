export const chartTheme = {
    colors: {
        primary: ['#6366f1', '#8b5cf6', '#a855f7'], // Indigo -> Purple
        secondary: ['#3b82f6', '#06b6d4'],           // Blue -> Cyan
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: '#94a3b8',
        grid: 'rgba(255, 255, 255, 0.05)',
        tooltipBg: 'rgba(18, 18, 31, 0.9)',
    },
    axisStyle: {
        stroke: '#94a3b8',
        strokeWidth: 0,
        fontSize: 12,
        fontFamily: 'JetBrains Mono',
    },
    gridStyle: {
        stroke: 'rgba(255, 255, 255, 0.05)',
        strokeDasharray: '4 4',
    },
    tooltipStyle: {
        backgroundColor: 'rgba(18, 18, 31, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(12px)',
        padding: '12px',
    },
};
