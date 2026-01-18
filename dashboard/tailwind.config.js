/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Developer Tool Palette
                border: "rgba(255, 255, 255, 0.08)",
                input: "rgba(255, 255, 255, 0.08)",
                ring: "#f97316",
                background: "#09090b", // bg-void (Zinc-950)
                foreground: "#fafafa", // text-primary

                surface: {
                    DEFAULT: "#18181b", // bg-surface (Zinc-900)
                    elevated: "#27272a", // bg-hover (Zinc-800)
                },

                primary: {
                    DEFAULT: "#f97316", // Claude Orange
                    foreground: "#ffffff",
                    light: "#fb923c",
                    dark: "#ea580c",
                },
                secondary: {
                    DEFAULT: "#27272a", // Zinc-800
                    foreground: "#a1a1aa",
                },
                destructive: {
                    DEFAULT: "#f43f5e", // Rose-500
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#27272a",
                    foreground: "#a1a1aa", // text-secondary
                },
                accent: {
                    DEFAULT: "#f97316",
                    foreground: "#ffffff",
                    purple: "#a855f7",
                    blue: "#3b82f6",
                    green: "#10b981",
                    yellow: "#f59e0b",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                'gradient-claude': 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
            },
            boxShadow: {
                'glow-orange': '0 0 40px rgba(249, 115, 22, 0.15)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
}

