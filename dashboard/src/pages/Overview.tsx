import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TerminalCard } from '../components/ui/terminal-card';
import { AsciiProgress } from '../components/ui/ascii-progress';
import type { ContentItem } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export default function Overview() {
    const navigate = useNavigate();

    // Fetch data
    const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: api.getStats });
    const { data: events } = useQuery({ queryKey: ['events'], queryFn: api.getEvents });

    const safeStats = stats || { totalPosts: 0, health: 'red', nextEventDays: 0, pipeline: { draft: 0, approved: 0, published: 0, recentActivity: [] } };
    const activeEvents = events?.filter(e => new Date(e.startDate) >= new Date()) || [];
    const totalPipeline = safeStats.pipeline.draft + safeStats.pipeline.approved + safeStats.pipeline.published;

    // Calculate percent for pipeline ASCII bars
    const getPercent = (val: number) => totalPipeline > 0 ? (val / totalPipeline) * 100 : 0;

    return (
        <div className="min-h-screen p-6 font-mono text-sm max-w-7xl mx-auto space-y-6">

            {/* Top Bar / Header */}
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Transform Labs Marketing</span>
                </div>
                <div className="flex items-center gap-6 text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-xs bg-surface-elevated px-2 py-1 rounded border border-border">
                        <Command className="w-3 h-3" /> K Search
                    </span>
                    <span>[Settings]</span>
                </div>
            </div>

            {/* System Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="mb-2 text-muted-foreground text-xs uppercase tracking-wider">SYSTEM STATUS</div>
                    <TerminalCard className="h-40 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <div className="text-6xl font-bold text-primary tabular-nums tracking-tighter">
                                {safeStats.totalPosts}
                            </div>
                            <div className="text-xs text-muted-foreground border-t border-dashed border-border pt-2 w-32 mx-auto">
                                posts.thisMonth
                            </div>
                            <div className="text-xs text-accent-green">▲ +18% vs last</div>
                        </div>
                    </TerminalCard>
                </div>

                <div className="md:col-span-1">
                    <div className="mb-2 text-muted-foreground text-xs uppercase tracking-wider">NEXT EVENT</div>
                    <TerminalCard className="h-40 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <div className="text-6xl font-bold text-primary tabular-nums tracking-tighter text-glow">
                                {safeStats.nextEventDays}
                            </div>
                            <div className="text-xs text-muted-foreground border-t border-dashed border-border pt-2 w-32 mx-auto">
                                days_until_event
                            </div>
                            <div className={cn(
                                "text-xs",
                                safeStats.nextEventDays <= 7 ? "text-accent-yellow animate-pulse" : "text-accent-blue"
                            )}>
                                {safeStats.nextEventDays <= 7 ? "⚠ APPROACHING" : "► SCHEDULED"}
                            </div>
                        </div>
                    </TerminalCard>
                </div>

                <div className="md:col-span-1 flex items-end justify-end pb-2">
                    <span className="text-xs text-muted-foreground">Last sync: 2m ago</span>
                </div>
            </div>

            {/* Active Events Grid */}
            <div>
                <div className="mb-2 text-muted-foreground text-xs uppercase tracking-wider mt-4">ACTIVE EVENTS</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeEvents.map(event => (
                        <TerminalCard
                            key={event.id}
                            title={event.name}
                            status={event.status === 'active' ? 'passing' : 'pending'}
                            className="cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <div onClick={() => navigate(`/events/${event.id}`)} className="space-y-4">
                                <div className="space-y-1 text-muted-foreground text-xs mb-4 pl-2 border-l-2 border-primary/20">
                                    <div className="flex gap-2"><span className="text-primary">{'>'}</span> Type: {event.type}</div>
                                    <div className="flex gap-2"><span className="text-primary">{'>'}</span> Progress: Week 3 of 6 (50%)</div>
                                    <div className="flex gap-2"><span className="text-primary">{'>'}</span> Days remaining: 14</div>
                                </div>

                                <div className="space-y-1">
                                    <AsciiProgress label="LinkedIn" value={(8 / 13) * 100} total={8} max={13} status="on_track" />
                                    <AsciiProgress label="Instagram" value={(6 / 15) * 100} total={6} max={15} status="behind" />
                                    <AsciiProgress label="Twitter" value={(5 / 5) * 100} total={5} max={5} status="complete" />
                                    <AsciiProgress label="TikTok" value={0} total={0} max={2} status="not_started" />
                                </div>
                            </div>
                        </TerminalCard>
                    ))}
                    {activeEvents.length === 0 && (
                        <TerminalCard title="System Message">
                            <div className="p-8 text-center text-muted-foreground">
                                {'>'} No active events found.
                            </div>
                        </TerminalCard>
                    )}
                </div>
            </div>

            {/* Bottom Row: Pipeline & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-2 text-muted-foreground text-xs uppercase tracking-wider mt-4">CONTENT PIPELINE</div>
                    <TerminalCard title="Content HQ">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-4 border-b border-border pb-2">
                                <span>Source: Notion API</span>
                                <span>Total: {totalPipeline}</span>
                            </div>

                            <AsciiProgress label="Published" value={getPercent(safeStats.pipeline.published)} total={safeStats.pipeline.published} max={totalPipeline} width={15} status="complete" />
                            <AsciiProgress label="Approved" value={getPercent(safeStats.pipeline.approved)} total={safeStats.pipeline.approved} max={totalPipeline} width={15} status="on_track" />
                            <AsciiProgress label="Draft" value={getPercent(safeStats.pipeline.draft)} total={safeStats.pipeline.draft} max={totalPipeline} width={15} status="not_started" />
                        </div>
                    </TerminalCard>
                </div>

                <div>
                    <div className="mb-2 text-muted-foreground text-xs uppercase tracking-wider mt-4">RECENT ACTIVITY</div>
                    <TerminalCard title="Log Output" status="passing">
                        <div className="space-y-2 text-xs font-mono h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {safeStats.pipeline.recentActivity?.slice(0, 10).map((item: ContentItem) => (
                                <div key={item.id} className="flex gap-3 hover:bg-surface-elevated/30 p-0.5 rounded transition-colors group">
                                    <span className="text-muted-foreground w-24 shrink-0">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span>
                                    <span className="text-primary shrink-0">{'>'}</span>
                                    <div className="flex gap-2 items-center truncate">
                                        <span className={cn(
                                            "uppercase text-[10px] px-1 rounded-sm",
                                            item.platform === 'linkedin' ? 'bg-blue-500/10 text-blue-400' :
                                                item.platform === 'instagram' ? 'bg-pink-500/10 text-pink-400' :
                                                    item.platform === 'twitter' ? 'bg-sky-500/10 text-sky-400' :
                                                        'bg-surface-elevated text-muted-foreground'
                                        )}>
                                            {item.platform.slice(0, 2)}
                                        </span>
                                        <span className={cn(
                                            "truncate",
                                            item.status === 'draft' ? 'text-muted-foreground italic' : 'text-foreground'
                                        )}>
                                            {item.title}
                                        </span>
                                    </div>
                                    {item.status === 'published' && <span className="text-accent-green ml-auto text-[10px]">[PUB]</span>}
                                    {item.status === 'draft' && <span className="text-accent-yellow ml-auto text-[10px]">[DFT]</span>}
                                </div>
                            ))}
                            {(!safeStats.pipeline.recentActivity || safeStats.pipeline.recentActivity.length === 0) && (
                                <div className="text-muted-foreground italic pl-4">-- No recent logs found --</div>
                            )}

                            <div className="h-4 flex items-center mt-2 pl-28">
                                <span className="animate-pulse bg-primary w-2 h-4 block"></span>
                            </div>
                        </div>
                    </TerminalCard>
                </div>
            </div>

        </div>
    );
}
