"use client";

import { useState } from 'react';
import { useCollection, Deck } from "@/lib/storage";
import Link from 'next/link';
import { Plus, Layers } from 'lucide-react';

export default function DecksPage() {
    const { decks, createDeck, isLoaded } = useCollection();
    const [isCreating, setIsCreating] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeckName.trim()) return;
        createDeck(newDeckName);
        setNewDeckName('');
        setIsCreating(false);
    };

    if (!isLoaded) return <div className="p-8 text-center text-slate-500">Cargando mazos...</div>;

    return (
        <div className="min-h-screen pt-4 md:pt-24 px-4 pb-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Mazos
                </h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nuevo Mazo
                </button>
            </div>

            {isCreating && (
                <div className="mb-8 p-4 bg-slate-800 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Nombre del mazo (ej. Dragones Commander)"
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={newDeckName}
                            onChange={e => setNewDeckName(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg font-bold text-white hover:bg-purple-500">
                            Crear
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-slate-400 hover:text-slate-200"
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            )}

            {decks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <Layers className="mb-4 text-slate-600" size={48} />
                    <h3 className="text-xl font-bold text-slate-200 mb-2">No hay mazos</h3>
                    <p className="text-slate-400 mb-6">Crea tu primer mazo para empezar a construir.</p>
                    <button onClick={() => setIsCreating(true)} className="text-purple-400 hover:underline">
                        Crear uno ahora
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {decks.map(deck => (
                        <Link key={deck.id} href={`/decks/${deck.id}`}>
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-all card-hover group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Layers size={24} />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {new Date(deck.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{deck.name}</h3>
                                <p className="text-slate-400">
                                    {deck.cards.reduce((acc, c) => acc + c.quantity, 0)} cartas
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
