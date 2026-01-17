"use client";

import { useState } from 'react';
import { useCollection, ScryfallCard } from '@/lib/storage';
import { X, Check } from 'lucide-react';

interface AddToDeckModalProps {
    card: ScryfallCard;
    onClose: () => void;
}

export default function AddToDeckModal({ card, onClose }: AddToDeckModalProps) {
    const { decks, addCardToDeck } = useCollection();
    const [selectedDeckId, setSelectedDeckId] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        if (!selectedDeckId) return;
        addCardToDeck(selectedDeckId, card, quantity);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Add to Deck</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
                    {card.image_uris?.small && (
                        <img src={card.image_uris.small} alt="" className="w-10 h-auto rounded" />
                    )}
                    <div>
                        <div className="font-bold text-sm">{card.name}</div>
                        <div className="text-xs text-slate-400">{card.set_name}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Select Deck</label>
                    {decks.length === 0 ? (
                        <div className="text-sm text-yellow-500 py-2">
                            No decks created. Please create a deck from the Decks tab first.
                        </div>
                    ) : (
                        <div className="grid gap-2 max-h-48 overflow-y-auto">
                            {decks.map(deck => (
                                <button
                                    key={deck.id}
                                    onClick={() => setSelectedDeckId(deck.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedDeckId === deck.id
                                        ? 'bg-purple-600 border-purple-500 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="font-medium">{deck.name}</div>
                                    <div className="text-xs opacity-80">{deck.cards.reduce((a, c) => a + c.quantity, 0)} cards</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Quantity</label>
                    <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-lg border border-slate-700 w-fit">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-xl font-bold"
                        >
                            -
                        </button>
                        <span className="text-xl font-mono w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(4, quantity + 1))}
                            className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-xl font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!selectedDeckId}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add {quantity} Card{quantity > 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
}
