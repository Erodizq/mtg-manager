"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Camera, Layers, Settings, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const navItems = [
        { name: 'Colección', href: '/', icon: Home },
        { name: 'Escanear', href: '/scan', icon: Camera },
        { name: 'Mazos', href: '/decks', icon: Layers },
        { name: 'Ajustes', href: '/settings', icon: Settings },
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
                                    isActive ? "text-primary" : "text-slate-500 hover:text-slate-300",
                                    "tap-highlight rounded-xl"
                                )}
                            >
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <div className="absolute top-0 w-8 h-1 rounded-b-full" style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-glow)' }}></div>
                                )}

                                <div className={clsx("transition-transform duration-300", isActive && "scale-110")}>
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={clsx("text-[10px] font-medium tracking-wide", isActive ? "text-accent" : "opacity-80")}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Mobile Auth Button */}
                    {user ? (
                        <button
                            onClick={signOut}
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 text-red-400 tap-highlight rounded-xl"
                        >
                            <div className="transition-transform duration-300">
                                <LogOut size={24} />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide opacity-80">Salir</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 text-green-400 tap-highlight rounded-xl"
                        >
                            <div className="transition-transform duration-300">
                                <LogIn size={24} />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide opacity-80">Entrar</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Desktop Header Navigation */}
            <header className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5 shadow-lg shadow-black/20 text-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo and App Name */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-16 w-52 flex items-center justify-center">
                            <Image
                                src="/mtg-manager-logo-v2.png"
                                alt="MTG Manager"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] group-hover:scale-105"
                                priority
                            />
                        </div>
                    </Link>

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
                                                ? "text-accent border-primary/20"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                        )}
                                        style={isActive ? {
                                            backgroundColor: 'var(--color-primary-light)' + '1A',
                                            boxShadow: '0 0 15px var(--color-glow)'
                                        } : undefined}
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
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-100 text-slate-900 hover:bg-white transition-colors font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            >
                                <LogIn size={16} />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
