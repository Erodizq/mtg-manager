"use client";

import Link from 'next/link';
import CollectionGrid from '@/components/CollectionGrid';

export default function Home() {
  return (
    <div className="min-h-screen pt-4 md:pt-24 px-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-0">
          My Collection
        </h1>
        <Link href="/scan" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium transition-colors">
          + Scan New
        </Link>
      </div>

      <CollectionGrid />
    </div>
  );
}
