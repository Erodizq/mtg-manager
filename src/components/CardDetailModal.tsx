import { ScryfallCard } from '@/lib/scryfall';
import { X } from 'lucide-react';

interface CardDetailModalProps {
    card: ScryfallCard;
    onClose: () => void;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
        >
            {/* Mobile: Bottom Sheet / Desktop: Centered Modal */}
            <div
                className="relative w-full md:max-w-4xl bg-slate-900 md:rounded-2xl border-t md:border border-slate-700/50 max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl md:text-2xl font-bold text-white truncate pr-4">
                        {card.printed_name || card.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 overscroll-contain">
                    <div className="p-4 md:p-6 space-y-6">
                        {/* Card Image */}
                        <div className="flex justify-center">
                            {card.image_uris?.normal ? (
                                <img
                                    src={card.image_uris.normal}
                                    alt={card.name}
                                    className="w-full max-w-[280px] md:max-w-[350px] rounded-xl shadow-2xl border border-white/10"
                                />
                            ) : (
                                <div className="w-[280px] md:w-[300px] aspect-[5/7] bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Card Info */}
                        <div className="space-y-4 text-slate-300">
                            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
                                <span className="text-slate-500 text-sm">Edición</span>
                                <div className="text-right">
                                    <div className="font-medium">{card.set_name}</div>
                                    <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono inline-block mt-1">
                                        #{card.collector_number}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
                                <span className="text-slate-500 text-sm">Tipo</span>
                                <span className="text-right max-w-[60%] text-sm">{card.type_line}</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-700 pb-3">
                                <span className="text-slate-500 text-sm">Rareza</span>
                                <span className="capitalize font-medium">{card.rarity}</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-700 pb-3">
                                <span className="text-slate-500 text-sm">Coste de Maná</span>
                                <span className="font-mono text-sm">{card.cmc} ({card.mana_cost || "-"})</span>
                            </div>

                            {/* Prices */}
                            <div className="pt-2">
                                <div className="text-sm text-slate-500 mb-3 uppercase tracking-wider font-bold">Precios</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-center">
                                        <div className="text-xs text-emerald-500 font-bold mb-2">NORMAL</div>
                                        <div className="text-2xl font-mono text-white">${card.prices.usd || '---'}</div>
                                    </div>
                                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-center">
                                        <div className="text-xs text-amber-500 font-bold mb-2 flex items-center justify-center gap-1">
                                            <span>FOIL</span>
                                            <span>✨</span>
                                        </div>
                                        <div className="text-2xl font-mono text-amber-200">${card.prices.usd_foil || '---'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
