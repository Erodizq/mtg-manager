"use client";

import { useTheme } from '@/lib/theme-context';
import ManaIcon from './ManaIcon';

export default function ThemedBackground() {
    const { color } = useTheme();

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Background */}
            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background: `radial-gradient(circle at 50% 0%, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 75%)`
                }}
            />

            {/* Giant Mana Symbol Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <div className="transform scale-[3] md:scale-[4]">
                    <ManaIcon color={color} size={400} />
                </div>
            </div>

            {/* Subtle Animated Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-pulse"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            opacity: 0.1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
