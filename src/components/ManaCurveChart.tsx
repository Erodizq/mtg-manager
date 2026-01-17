import { ScryfallCard } from '@/lib/scryfall';

interface ManaCurveProps {
    cards: { card: ScryfallCard; quantity: number }[];
}

export default function ManaCurveChart({ cards }: ManaCurveProps) {
    // 1. Calculate distribution
    const distribution = new Array(8).fill(0); // 0, 1, 2, 3, 4, 5, 6, 7+
    let maxCount = 0;

    cards.forEach(item => {
        const cmc = item.card.cmc || 0; // Default to 0 if missing
        let index = Math.floor(cmc);
        if (index > 7) index = 7;
        if (index < 0) index = 0;

        distribution[index] += item.quantity;
        if (distribution[index] > maxCount) maxCount = distribution[index];
    });

    // Prevent division by zero
    if (maxCount === 0) maxCount = 1;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Mana Curve</h3>
            <div className="flex justify-between items-end h-32 gap-2">
                {distribution.map((count, cmc) => {
                    // Calculate height percentage relative to the tallest bar
                    const heightPercent = (count / maxCount) * 100;

                    return (
                        <div key={cmc} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full flex flex-col justify-end h-full">
                                <div
                                    className="w-full bg-blue-500/80 hover:bg-blue-400 transition-all duration-500 rounded-t-sm"
                                    style={{ height: `${heightPercent}%` }}
                                >
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                        {count}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 mt-2 font-mono">
                                {cmc === 7 ? '7+' : cmc}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
