import { ScryfallCard } from '@/lib/scryfall';
import { X, ExternalLink } from 'lucide-react';

interface CardDetailModalProps {
    card: ScryfallCard;
    onClose: () => void;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="relative max-w-4xl w-full flex flex-col md:flex-row gap-8 pointer-events-none" onClick={e => e.stopPropagation()}>
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 md:hidden text-white/50 hover:text-white pointer-events-auto"
                >
                    <X size={32} />
                </button>

                {/* Main Card Image */}
                <div className="flex-1 pointer-events-auto flex justify-center items-center">
                    {card.image_uris?.normal ? (
                        <img
                            src={card.image_uris.normal}
                            alt={card.name}
                            className="w-full max-w-[350px] rounded-xl shadow-2xl border border-white/10"
                        />
                    ) : (
                        <div className="w-[300px] aspect-[5/7] bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                            No Image
                        </div>
                    )}
                </div>

                {/* Info Panel */}
                <div className="flex-1 pointer-events-auto bg-slate-900/90 border border-slate-700/50 p-6 rounded-xl backdrop-blur-md shadow-xl flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-white">{card.printed_name || card.name}</h2>
                        <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4 text-slate-300">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-500">Edition</span>
                            <span className="font-medium flex items-center gap-2">
                                {card.set_name}
                                <span className="text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                                    {card.collector_number}
                                </span>
                            </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-500">Type</span>
                            <span>{card.type_line}</span>
                        </div>

                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-500">Mana Value</span>
                            <span>{card.cmc} ({card.mana_cost || "-"})</span>
                        </div>

                        <div className="pt-2">
                            <div className="text-sm text-slate-500 mb-2 uppercase tracking-wider font-bold">Prices</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-3 rounded border border-slate-800 text-center">
                                    <div className="text-xs text-green-500 font-bold mb-1">NORMAL</div>
                                    <div className="text-xl font-mono text-white">${card.prices.usd || '---'}</div>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded border border-slate-800 text-center">
                                    <div className="text-xs text-amber-500 font-bold mb-1">FOIL</div>
                                    <div className="text-xl font-mono text-amber-200">${card.prices.usd_foil || '---'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
