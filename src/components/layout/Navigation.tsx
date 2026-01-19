import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Layers, Settings, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
    const pathname = usePathname();
    const { user, signInWithGoogle, signOut } = useAuth();

    const navItems = [
        { name: 'Colección', href: '/', icon: Home },
        { name: 'Escanear', href: '/scan', icon: Camera },
        { name: 'Mazos', href: '/decks', icon: Layers },
    ];

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav pb-safe md:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                                    isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300",
                                    "tap-highlight rounded-xl"
                                )}
                            >
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <div className="absolute top-0 w-8 h-1 bg-blue-500 rounded-b-full shadow-[0_0_10px_#3b82f6]"></div>
                                )}

                                <div className={clsx("transition-transform duration-300", isActive && "scale-110")}>
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={clsx("text-[10px] font-medium tracking-wide", isActive ? "text-blue-300" : "opacity-80")}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Mobile Auth Button */}
                    <button
                        onClick={user ? signOut : signInWithGoogle}
                        className={clsx(
                            "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                            user ? "text-red-400" : "text-green-400",
                            "tap-highlight rounded-xl"
                        )}
                    >
                        <div className="transition-transform duration-300">
                            {user ? <LogOut size={24} /> : <LogIn size={24} />}
                        </div>
                        <span className="text-[10px] font-medium tracking-wide opacity-80">
                            {user ? 'Salir' : 'Entrar'}
                        </span>
                    </button>
                </div>
            </nav>

            {/* Desktop Header Navigation */}
            <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/20">
                            M
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                            MTG Manager
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border border-transparent",
                                            isActive
                                                ? "bg-blue-500/10 text-blue-300 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon size={18} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Auth Button */}
                        <div className="w-px h-8 bg-white/10 mx-2" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden lg:block">
                                    <div className="text-xs text-slate-400">Logueado como</div>
                                    <div className="text-sm font-bold text-white">{user.email?.split('@')[0]}</div>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors border border-red-500/20"
                                >
                                    <LogOut size={16} />
                                    <span className="font-medium text-sm">Salir</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={signInWithGoogle}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-100 text-slate-900 hover:bg-white transition-colors font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            >
                                <LogIn size={16} />
                                <span>Entrar</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
