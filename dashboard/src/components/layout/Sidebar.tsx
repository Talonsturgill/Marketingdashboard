import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Settings, BarChart3, Box } from 'lucide-react';
import { cn } from '../../lib/utils';


export function Sidebar() {
    const location = useLocation();

    const navItems = [
        { name: 'Overview', path: '/', icon: LayoutDashboard },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Content', path: '/content', icon: FileText },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-surface border-r border-border p-4 hidden lg:flex flex-col z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-8 px-2 py-2">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
                    {/* Placeholder for logo if image fails, or use img with fallback */}
                    <Box className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <span className="font-mono font-bold text-sm text-foreground tracking-tight">Transform Labs</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative font-mono text-sm",
                                isActive
                                    ? "bg-surface-elevated text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50"
                            )}
                        >
                            {/* Active indicator strip */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
                            )}

                            <item.icon className={cn(
                                "w-4 h-4",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* System Status Footer */}
            <div className="mt-auto pt-4 border-t border-border">
                <div className="bg-surface-elevated/30 rounded p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                        <span className="text-[10px] font-mono text-accent-green">SYSTEM: OPERATIONAL</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
