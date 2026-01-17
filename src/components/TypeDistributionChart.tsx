import { ScryfallCard } from '@/lib/scryfall';

interface TypeDistributionProps {
    cards: { card: ScryfallCard; quantity: number }[];
}

export default function TypeDistributionChart({ cards }: TypeDistributionProps) {
    const typeCounts: Record<string, number> = {};
    let totalItems = 0;

    cards.forEach(item => {
        // Simple parser: take the first word before "—"
        // e.g. "Creature — Elf" -> "Creature"
        // "Legendary Creature — Human" -> "Creature" (we want the main type)
        // Actually, strictly speaking, "Legendary" is a supertype.
        // Let's look for known main types: Land, Creature, Artifact, Enchantment, Planeswalker, Instant, Sorcery

        const typeLine = item.card.type_line || "Unknown";
        const mainTypes = ["Land", "Creature", "Artifact", "Enchantment", "Planeswalker", "Instant", "Sorcery", "Battle"];

        let foundType = "Other";
        for (const t of mainTypes) {
            if (typeLine.includes(t)) {
                foundType = t;
                break; // Prioritize order above (e.g. Artifact Creature counts as Land? No, wait. Artifact Creature -> Artifact? or Creature?)
                // Let's prioritize Creature.
            }
        }

        // Refined priority logic
        if (typeLine.includes("Creature")) foundType = "Creature";
        else if (typeLine.includes("Land")) foundType = "Land";
        else if (typeLine.includes("Instant")) foundType = "Instant";
        else if (typeLine.includes("Sorcery")) foundType = "Sorcery";
        else if (typeLine.includes("Planeswalker")) foundType = "Planeswalker";
        else if (typeLine.includes("Enchantment")) foundType = "Enchantment";
        else if (typeLine.includes("Artifact")) foundType = "Artifact";
        else if (typeLine.includes("Battle")) foundType = "Battle";

        typeCounts[foundType] = (typeCounts[foundType] || 0) + item.quantity;
        totalItems += item.quantity;
    });

    // Sort by count descending
    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-full">
            <h3 className="text-lg font-bold text-white mb-4">Type Distribution</h3>
            <div className="space-y-3">
                {sortedTypes.map(([type, count]) => (
                    <div key={type} className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">{type}</span>
                            <span className="text-slate-500 font-mono">{count} ({Math.round(count / totalItems * 100)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(count / totalItems) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
                {sortedTypes.length === 0 && <div className="text-slate-600 italic text-sm">No cards yet</div>}
            </div>
        </div>
    );
}
