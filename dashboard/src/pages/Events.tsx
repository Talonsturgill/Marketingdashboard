import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TerminalCard } from '../components/ui/terminal-card';
import { AsciiProgress } from '../components/ui/ascii-progress';
import { Skeleton } from '../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';

export default function Events() {
    const navigate = useNavigate();
    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: api.getEvents
    });

    // Sort events by date - most recent first
    const sortedEvents = useMemo(() => {
        if (!events) return [];
        return [...events].sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA; // Descending order (most recent first)
        });
    }, [events]);

    return (
        <div className="min-h-screen p-6 font-mono text-sm max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{'>'} SYSTEM.MODULES.EVENTS</div>
                    <h1 className="text-xl font-bold text-foreground tracking-tight">/events</h1>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">[SORT: DESC]</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 text-xs font-bold uppercase tracking-wider">
                        <Plus size={14} />
                        <span>Init_Event</span>
                    </button>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-64 bg-card/20 rounded-none border border-border" />
                    ))
                ) : sortedEvents && sortedEvents.length > 0 ? (
                    sortedEvents.map((event) => {
                        const totalGoals = Object.values(event.goals).reduce((a, b) => a + b, 0) || 1;
                        const progress = Math.round((event.posts?.length || 0) / totalGoals * 100);

                        return (
                            <TerminalCard
                                key={event.id}
                                title={event.name}
                                status={event.status === 'active' ? 'passing' : event.status === 'completed' ? 'passing' : 'pending'}
                                className="h-full hover:border-primary/50 transition-colors cursor-pointer"
                            >
                                <div onClick={() => navigate(`/events/${event.id}`)} className="space-y-4">
                                    <div className="space-y-1 text-muted-foreground text-xs mb-4 pl-2 border-l-2 border-primary/20">
                                        <div className="flex gap-2"><span className="text-primary">{'>'}</span> ID: {event.id.slice(0, 8)}...</div>
                                        <div className="flex gap-2"><span className="text-primary">{'>'}</span> Type: {event.type}</div>
                                        <div className="flex gap-2"><span className="text-primary">{'>'}</span> Status: {event.status.toUpperCase()}</div>
                                        <div className="flex gap-2"><span className="text-primary">{'>'}</span> Range: {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}</div>
                                    </div>

                                    <div className="pt-2 border-t border-dashed border-border/50">
                                        <AsciiProgress
                                            label="Overall Progress"
                                            value={progress}
                                            total={event.posts?.length || 0}
                                            max={totalGoals}
                                            status={progress >= 100 ? 'complete' : progress > 0 ? 'on_track' : 'not_started'}
                                        />
                                    </div>
                                </div>
                            </TerminalCard>
                        );
                    })
                ) : (
                    <div className="col-span-3">
                        <TerminalCard title="System Message">
                            <div className="p-12 text-center text-muted-foreground">
                                <div className="mb-2">{'>'} SEARCH_RESULT: 0 ITEMS FOUND</div>
                                <p className="mb-6">Event log is empty. Initialize new event sequence.</p>
                                <button className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 text-xs font-bold uppercase transition-colors">
                                    [+] Create Event
                                </button>
                            </div>
                        </TerminalCard>
                    </div>
                )}
            </div>
        </div>
    );
}
