"use client";

import { useParams } from 'next/navigation';
import { useCollection } from '@/lib/storage';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';

import ManaCurveChart from '@/components/ManaCurveChart';
import TypeDistributionChart from '@/components/TypeDistributionChart';

export default function DeckDetail() {
    const params = useParams();
    const { decks, isLoaded } = useCollection();

    const deck = decks.find(d => d.id === params.id);

    if (!isLoaded) return <div className="p-8 text-center text-slate-500">Cargando...</div>;
    if (!deck) return <div className="p-8 text-center text-red-400">Mazo no encontrado</div>;

    const totalCards = deck.cards.reduce((acc, c) => acc + c.quantity, 0);

    const handleExport = () => {
        // Format: "4 Lightning Bolt (CLB) 187"
        const text = deck.cards.map(item => {
            const safeName = item.card.name;
            const set = item.card.set_name ? `(${item.card.set_name})` : ""; // Actually Scryfall uses set code like (LEA) usually, but name is fine for text. 
            // Better standard: Quantity Name (SET) Number
            // We stored 'set_name' which is full name "Alpha". We need set code if possible?
            // Checking scryfall.ts interface... we only saved set_name?
            // Wait, Gemini logic now retrieves set_code but we didn't add it to ScryfallCard interface explicitly in scryfall.ts earlier?
            // Let's check storage.ts/scryfall.ts. If we don't have code, we use name.
            // Actually standard export is usually: 4 Name
            // Or for Arena: 4 Name (SET) CN
            // Let's stick to simple text for now: "4 Name" if we lack codes, or just dump what we have.

            // Let's just use: Quantity Name
            return `${item.quantity} ${safeName}`;
        }).join('\n');

        navigator.clipboard.writeText(text).then(() => {
            alert("¡Mazo copiado al portapapeles!");
        });
    };

    return (
        <div className="min-h-screen pt-4 md:pt-24 px-4 pb-24">
            <Link href="/decks" className="flex items-center text-slate-400 hover:text-white mb-6">
                <ArrowLeft size={20} className="mr-1" /> Volver a Mazos
            </Link>

            <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{deck.name}</h1>
                    <p className="text-slate-400">{totalCards} cartas</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleExport}
                        className="text-blue-400 text-sm hover:underline font-medium"
                    >
                        Exportar Texto
                    </button>
                    <button className="text-red-400 text-sm hover:underline">Borrar Mazo</button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ManaCurveChart cards={deck.cards} />
                <TypeDistributionChart cards={deck.cards} />
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Lista de Cartas</h3>
            <div className="grid gap-y-2">
                {deck.cards.map(item => (
                    <div key={item.card.id} className="flex items-center bg-slate-800/50 p-3 rounded hover:bg-slate-800 border theme-border border-transparent hover:border-slate-700">
                        <div className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded font-mono text-sm border border-slate-700 mr-4">
                            {item.quantity}
                        </div>
                        <div className="flex-1 font-medium">{item.card.name}</div>
                        <div className="text-sm text-slate-400">{item.card.set_name}</div>
                    </div>
                ))}

                {deck.cards.length === 0 && (
                    <div className="text-center py-12 text-slate-500 italic">
                        Este mazo está vacío. Ve a la Colección o al Escáner para añadir cartas.
                    </div>
                )}
            </div>
        </div>
    );
}
