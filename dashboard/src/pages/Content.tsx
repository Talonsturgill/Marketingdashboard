import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TerminalCard } from '../components/ui/terminal-card';
import { Skeleton } from '../components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Terminal } from 'lucide-react';
import { isThisMonth } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border p-2 font-mono text-xs shadow-none">
                <p className="text-muted-foreground mb-1">{label}</p>
                <p className="text-primary font-bold">{'>'} {payload[0].value} posts</p>
            </div>
        );
    }
    return null;
};

export default function Content() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: api.getStats
    });

    const pipeline = stats?.pipeline || {
        draft: 0,
        approved: 0,
        published: 0,
        recentActivity: [],
        thisMonthCount: 0,
        platformDistribution: {}
    };

    const currentMonthCount = pipeline.recentActivity?.filter(item =>
        (item.status === 'published' || item.status === 'done') &&
        isThisMonth(new Date(item.date))
    ).length ?? 0;

    // Transform platform distribution for chart
    const colors: Record<string, string> = {
        linkedin: '#0077b5', // LinkedIn Blue
        twitter: '#1DA1F2',  // Twitter Blue
        x: '#1DA1F2',
        instagram: '#E1306C', // Instagram Pink
        tiktok: '#000000',    // TikTok Black (or white on dark)
        youtube: '#FF0000'    // YouTube Red
    };

    const chartData = pipeline.platformDistribution
        ? Object.entries(pipeline.platformDistribution).map(([name, posts]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            posts,
            color: colors[name.toLowerCase()] || '#22c55e' // specific color or terminal green fallback
        }))
        : [
            { name: 'LinkedIn', posts: 0, color: '#0077b5' },
            { name: 'Twitter', posts: 0, color: '#1DA1F2' }
        ];

    return (
        <div className="min-h-screen p-6 font-mono text-sm max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{'>'} SYSTEM.MODULES.CONTENT</div>
                    <h1 className="text-xl font-bold text-foreground tracking-tight">/content_hq</h1>
                </div>
                <div>
                    <span className="text-xs text-muted-foreground">[STATUS: ONLINE]</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TerminalCard className="h-40 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <div className="text-6xl font-bold text-primary tabular-nums tracking-tighter">
                            {isLoading ? '-' : currentMonthCount}
                        </div>
                        <div className="text-xs text-muted-foreground border-t border-dashed border-border pt-2 w-32 mx-auto">
                            posts.current_month
                        </div>
                        <div className="text-xs text-accent-green">▲ SYSTEM ACTIVE</div>
                    </div>
                </TerminalCard>

                <TerminalCard className="h-40 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <div className="text-6xl font-bold text-primary tabular-nums tracking-tighter">
                            {isLoading ? '-' : '87%'}
                        </div>
                        <div className="text-xs text-muted-foreground border-t border-dashed border-border pt-2 w-32 mx-auto">
                            pipeline.efficiency
                        </div>
                        <div className="text-xs text-accent-green">▲ OPTIMIZED</div>
                    </div>
                </TerminalCard>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TerminalCard title="Distribution Analysis" className="h-[420px]">
                    <div className="p-4 h-full">
                        {isLoading ? (
                            <Skeleton className="h-full w-full bg-card/10" />
                        ) : (
                            <div className="h-[320px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#666"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            dx={-10}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                        <Bar
                                            dataKey="posts"
                                            radius={[0, 0, 0, 0]}
                                            barSize={20}
                                            fill="#22c55e"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </TerminalCard>

                <TerminalCard title="Pipeline Velocity" className="h-[420px]">
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                        <Terminal className="w-12 h-12 mb-4 opacity-50" />
                        <h4 className="text-lg font-bold text-foreground mb-2">Use 'velocity' command</h4>
                        <p className="text-xs max-w-xs mb-6">Velocity tracking module requires calibration.</p>
                        <div className="w-full max-w-xs space-y-2 font-mono text-[10px]">
                            <div className="flex justify-between"><span>init_module...</span><span>[OK]</span></div>
                            <div className="flex justify-between"><span>sync_notion...</span><span>[WAIT]</span></div>
                        </div>
                    </div>
                </TerminalCard>
            </div>
        </div>
    );
}
