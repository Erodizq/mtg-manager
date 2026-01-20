import { ManaColor } from '@/lib/theme-context';
import React from 'react';

interface ManaIconProps {
    color: ManaColor;
    size?: number;
    className?: string;
}

export default function ManaIcon({ color, size = 24, className = '' }: ManaIconProps) {
    const icons: Record<ManaColor, React.ReactElement> = {
        white: (
            <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
                <circle cx="50" cy="50" r="48" fill="#F9FAF4" stroke="#2C2C2C" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#2C2C2C" strokeWidth="3" />
                <circle cx="50" cy="30" r="8" fill="#2C2C2C" />
                <circle cx="35" cy="55" r="8" fill="#2C2C2C" />
                <circle cx="65" cy="55" r="8" fill="#2C2C2C" />
                <circle cx="50" cy="70" r="8" fill="#2C2C2C" />
            </svg>
        ),
        blue: (
            <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
                <circle cx="50" cy="50" r="48" fill="#0E68AB" stroke="#2C2C2C" strokeWidth="2" />
                <path d="M 50 20 L 35 45 L 50 40 L 65 45 Z" fill="#2C2C2C" />
                <path d="M 35 45 L 30 65 L 50 55 Z" fill="#2C2C2C" />
                <path d="M 65 45 L 70 65 L 50 55 Z" fill="#2C2C2C" />
                <path d="M 30 65 L 50 80 L 70 65 L 50 55 Z" fill="#2C2C2C" />
            </svg>
        ),
        black: (
            <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
                <circle cx="50" cy="50" r="48" fill="#150B00" stroke="#2C2C2C" strokeWidth="2" />
                <path d="M 50 25 L 40 50 L 50 45 L 60 50 Z" fill="#CBC2BF" />
                <circle cx="50" cy="50" r="12" fill="#CBC2BF" />
                <path d="M 40 50 L 30 70 L 50 62 Z" fill="#CBC2BF" />
                <path d="M 60 50 L 70 70 L 50 62 Z" fill="#CBC2BF" />
                <path d="M 50 62 L 35 75 L 50 80 L 65 75 Z" fill="#CBC2BF" />
            </svg>
        ),
        red: (
            <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
                <circle cx="50" cy="50" r="48" fill="#D3202A" stroke="#2C2C2C" strokeWidth="2" />
                <path d="M 50 20 L 45 40 L 35 35 L 40 50 L 25 55 L 40 60 L 35 75 L 50 65 L 65 75 L 60 60 L 75 55 L 60 50 L 65 35 L 55 40 Z" fill="#2C2C2C" />
            </svg>
        ),
        green: (
            <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
                <circle cx="50" cy="50" r="48" fill="#00733E" stroke="#2C2C2C" strokeWidth="2" />
                <circle cx="50" cy="35" r="10" fill="#2C2C2C" />
                <path d="M 50 45 L 30 55 L 35 75 L 50 70 L 65 75 L 70 55 Z" fill="#2C2C2C" />
                <rect x="45" y="70" width="10" height="15" fill="#2C2C2C" />
            </svg>
        ),
    };

    return icons[color];
}
