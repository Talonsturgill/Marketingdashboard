import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/transform-labs-logo.png';

export function MobileNav() {
    const location = useLocation();

    const navItems = [
        { name: 'Overview', path: '/', icon: LayoutDashboard },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Content', path: '/content', icon: FileText },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
    ];

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-surface-base/90 backdrop-blur-glass-heavy border-b border-white/[0.04] px-4 py-3 lg:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center p-1 border border-brand-primary/20">
                        <img src={logo} alt="Transform Labs" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-display font-bold text-gradient-brand">Transform Labs</span>
                </div>
            </header>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-base/90 backdrop-blur-glass-heavy border-t border-white/[0.04] px-4 py-3 lg:hidden">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 transition-all duration-300 px-3 py-1.5 rounded-xl",
                                    isActive
                                        ? "text-brand-primary"
                                        : "text-text-tertiary hover:text-text-primary"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    isActive && "bg-brand-soft shadow-glow-brand-soft"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-semibold uppercase tracking-wide",
                                    isActive && "text-brand-primary"
                                )}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
