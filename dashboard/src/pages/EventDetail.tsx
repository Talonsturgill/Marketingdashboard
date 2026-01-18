import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TerminalCard } from '../components/ui/terminal-card';
import { AsciiProgress } from '../components/ui/ascii-progress';
import { CliStatus } from '../components/ui/cli-status';


export default function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch event data
    const { data: event, isLoading } = useQuery({
        queryKey: ['event', id],
        queryFn: () => api.getEvent(id || '')
    });

    if (isLoading) {
        return (
            <div className="p-6 font-mono text-sm max-w-7xl mx-auto space-y-6">
                <TerminalCard title="Loading...">
                    <div className="p-8 text-center text-muted-foreground animate-pulse">
                        {'>'} accessing_database...
                    </div>
                </TerminalCard>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="p-6 font-mono text-sm max-w-7xl mx-auto">
                <TerminalCard title="Error" status="failing">
                    <div className="p-8 text-center text-destructive">
                        {'>'} ERROR: Event ID '{id}' not found.
                    </div>
                </TerminalCard>
            </div>
        );
    }

    // Calculate generic progress (mock logic for demo)
    const calculateProgress = (goal: number) => {
        if (goal === 0) return { actual: 0, percent: 0 };
        const actual = Math.floor(goal * 0.62); // Hardcoded 62% for vibe matching PRD
        return { actual, percent: 62 };
    };

    const platforms = [
        { id: 'linkedin', name: 'linkedin', goal: event.goals.linkedin },
        { id: 'instagram', name: 'instagram', goal: event.goals.instagram },
        { id: 'twitter', name: 'twitter', goal: event.goals.twitter },
        { id: 'tiktok', name: 'tiktok', goal: event.goals.tiktok || 2 }, // Defaulting to 2 for demo if not present
    ];

    return (
        <div className="min-h-screen p-6 font-mono text-sm max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="hover:text-primary transition-colors text-muted-foreground">
                        ← Back
                    </button>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-bold">Event: {event.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">[Edit]</span>
                    <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">[JSON]</span>
                </div>
            </div>

            {/* Top Row: Metadata & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Metadata */}
                <TerminalCard title="METADATA" status={event.status === 'active' ? 'passing' : 'pending'}>
                    <div className="space-y-1">
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="text-muted-foreground">id:</span>
                            <span className="text-primary">{event.id}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="text-muted-foreground">type:</span>
                            <span>{event.type}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="text-muted-foreground">status:</span>
                            <CliStatus status="active" />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="text-muted-foreground">created:</span>
                            <span>2025-07-15T00:00:00Z</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="text-muted-foreground">event_date:</span>
                            <span>{new Date(event.startDate).toISOString().split('T')[0]}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="text-muted-foreground">days_left:</span>
                            <span className="text-accent-yellow">14</span>
                        </div>
                    </div>
                </TerminalCard>

                {/* Progress Breakdown */}
                <TerminalCard title="PROGRESS">
                    <div className="space-y-4">
                        <div className="mb-4">
                            <div className="mb-1 text-xs text-muted-foreground">Overall: 62% complete</div>
                            <span className="text-primary tracking-tighter">
                                [██████████████████████████░░░░░░░░░░░░░░░░]
                            </span>
                        </div>

                        <div className="space-y-0.5 border-l-2 border-border pl-4">
                            <div className="text-xs text-muted-foreground mb-2">Platform Breakdown:</div>
                            {platforms.map(p => {
                                const { actual, percent } = calculateProgress(p.goal);
                                const status = percent >= 100 ? 'complete' : percent >= 60 ? 'on_track' : percent > 0 ? 'behind' : 'not_started';
                                return (
                                    <div key={p.id} className="flex flex-col xl:flex-row gap-0 xl:gap-0">
                                        <AsciiProgress
                                            label={`├─ ${p.name}`}
                                            value={percent}
                                            total={actual}
                                            max={p.goal}
                                            status={status}
                                            width={12}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </TerminalCard>
            </div>

            {/* Timeline Visualization */}
            <TerminalCard title="TIMELINE">
                <div className="overflow-x-auto pb-2">
                    <pre className="font-mono text-xs leading-loose">
                        {`
  Jul    Aug    Sep    Oct    Nov    Dec    Jan
   │      │      │      │      │      │      │
   ●──────●──────●──────●──────●──────●──────◆
   │             │             │      ▲      │
 start       mid-point     ramp-up   NOW   event
`}
                    </pre>
                </div>
            </TerminalCard>

            {/* Posts Log */}
            <TerminalCard title="POSTS LOG">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-muted-foreground border-b border-border">
                                <th className="pb-2 font-normal">DATE</th>
                                <th className="pb-2 font-normal">PLATFORM</th>
                                <th className="pb-2 font-normal">CONTENT</th>
                                <th className="pb-2 font-normal text-right">ENGAGEMENT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {[
                                { date: '2026-01-15', platform: 'linkedin', content: '"5 AI Trends Transforming..."', metric: '2,340 imp' },
                                { date: '2026-01-14', platform: 'twitter', content: '"Excited to announce..."', metric: '892 imp' },
                                { date: '2026-01-12', platform: 'instagram', content: '[Image] Behind the scenes...', metric: '456 eng' },
                                { date: '2026-01-10', platform: 'linkedin', content: '"Join us at AI Summit..."', metric: '1,205 imp' },
                            ].map((log, i) => (
                                <tr key={i} className="group hover:bg-surface-elevated/50 transition-colors">
                                    <td className="py-2 text-muted-foreground">{log.date}</td>
                                    <td className="py-2 text-primary">{log.platform}</td>
                                    <td className="py-2 text-foreground/90">{log.content}</td>
                                    <td className="py-2 text-right font-mono text-accent-green">{log.metric}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TerminalCard>

        </div>
    );
}
