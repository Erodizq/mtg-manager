"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ManaColor = 'blue' | 'white' | 'black' | 'red' | 'green';

export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    glow: string;
}

const colorThemes: Record<ManaColor, ThemeColors> = {
    blue: {
        primary: '#3b82f6',      // blue-500
        primaryLight: '#60a5fa', // blue-400
        primaryDark: '#2563eb',  // blue-600
        accent: '#93c5fd',       // blue-300
        glow: 'rgba(59, 130, 246, 0.3)',
    },
    white: {
        primary: '#f59e0b',      // amber-500 (gold for white mana)
        primaryLight: '#fbbf24', // amber-400
        primaryDark: '#d97706',  // amber-600
        accent: '#fcd34d',       // amber-300
        glow: 'rgba(245, 158, 11, 0.3)',
    },
    black: {
        primary: '#8b5cf6',      // violet-500 (purple for black mana)
        primaryLight: '#a78bfa', // violet-400
        primaryDark: '#7c3aed',  // violet-600
        accent: '#c4b5fd',       // violet-300
        glow: 'rgba(139, 92, 246, 0.3)',
    },
    red: {
        primary: '#ef4444',      // red-500
        primaryLight: '#f87171', // red-400
        primaryDark: '#dc2626',  // red-600
        accent: '#fca5a5',       // red-300
        glow: 'rgba(239, 68, 68, 0.3)',
    },
    green: {
        primary: '#10b981',      // emerald-500
        primaryLight: '#34d399', // emerald-400
        primaryDark: '#059669',  // emerald-600
        accent: '#6ee7b7',       // emerald-300
        glow: 'rgba(16, 185, 129, 0.3)',
    },
};

interface ThemeContextType {
    color: ManaColor;
    setColor: (color: ManaColor) => void;
    theme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [color, setColorState] = useState<ManaColor>('blue');

    useEffect(() => {
        // Load saved theme from localStorage
        const saved = localStorage.getItem('mtg-theme-color');
        if (saved && saved in colorThemes) {
            setColorState(saved as ManaColor);
        }
    }, []);

    const setColor = (newColor: ManaColor) => {
        setColorState(newColor);
        localStorage.setItem('mtg-theme-color', newColor);

        // Apply CSS variables to :root
        const theme = colorThemes[newColor];
        document.documentElement.style.setProperty('--color-primary', theme.primary);
        document.documentElement.style.setProperty('--color-primary-light', theme.primaryLight);
        document.documentElement.style.setProperty('--color-primary-dark', theme.primaryDark);
        document.documentElement.style.setProperty('--color-accent', theme.accent);
        document.documentElement.style.setProperty('--color-glow', theme.glow);
    };

    // Apply theme on mount
    useEffect(() => {
        const theme = colorThemes[color];
        document.documentElement.style.setProperty('--color-primary', theme.primary);
        document.documentElement.style.setProperty('--color-primary-light', theme.primaryLight);
        document.documentElement.style.setProperty('--color-primary-dark', theme.primaryDark);
        document.documentElement.style.setProperty('--color-accent', theme.accent);
        document.documentElement.style.setProperty('--color-glow', theme.glow);
    }, [color]);

    return (
        <ThemeContext.Provider value={{ color, setColor, theme: colorThemes[color] }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
