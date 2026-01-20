"use client";

import Link from 'next/link';
import CollectionGrid from '@/components/CollectionGrid';

export default function Home() {
  return (
    <div className="min-h-screen pt-4 md:pt-24 px-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-0" style={{
          background: 'linear-gradient(to right, var(--color-primary-light), var(--color-accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Mi Colección
        </h1>
        <Link href="/scan" className="text-sm text-white px-3 py-1.5 rounded-full font-medium transition-all hover:brightness-110" style={{
          backgroundColor: 'var(--color-primary)',
          boxShadow: '0 4px 12px var(--color-glow)'
        }}>
          + Escanear
        </Link>
      </div>

      <CollectionGrid />
    </div>
  );
}
