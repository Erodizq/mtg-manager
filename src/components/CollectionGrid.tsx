import { useCollection, ScryfallCard } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { Trash2, Plus, Layers, Search, ArrowUpDown, LayoutGrid, List as ListIcon, Filter, X, LogIn } from "lucide-react";
import Link from 'next/link';
import { useState, useMemo } from "react";
import AddToDeckModal from "./AddToDeckModal";
import CardDetailModal from "./CardDetailModal";
import clsx from "clsx";

type SortOption = 'name-asc' | 'price-desc' | 'price-asc';
type ViewMode = 'grid' | 'list';

const COLORS = [
    { id: 'W', label: 'Blanco', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
    { id: 'U', label: 'Azul', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    { id: 'B', label: 'Negro', bg: 'bg-slate-300', border: 'border-slate-500', text: 'text-slate-800' },
    { id: 'R', label: 'Rojo', bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
    { id: 'G', label: 'Verde', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
];

export default function CollectionGrid() {
    const { collection, removeFromCollection, toggleFoil, isLoaded, addToCollection } = useCollection();
    const [deckModalCard, setDeckModalCard] = useState<ScryfallCard | null>(null);
    const [detailModalCard, setDetailModalCard] = useState<ScryfallCard | null>(null);

    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>('price-desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Advanced Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedSet, setSelectedSet] = useState<string>('all');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    // Derived Data: Unique Sets
    const uniqueSets = useMemo(() => {
        const sets = new Set(collection.map(item => item.card.set_name));
        return Array.from(sets).sort();
    }, [collection]);

    // Derived Data: Active Filters Count
    const activeFiltersCount = (selectedSet !== 'all' ? 1 : 0) + (selectedRarity !== 'all' ? 1 : 0) + selectedColors.length;

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedSet('all');
        setSelectedRarity('all');
        setSelectedColors([]);
    };

    // Filter & Sort Logic
    const processedCollection = useMemo(() => {
        let result = [...collection];

        // 1. Text Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.card.name.toLowerCase().includes(lowerTerm) ||
                (item.card.printed_name && item.card.printed_name.toLowerCase().includes(lowerTerm)) ||
                item.card.set_name.toLowerCase().includes(lowerTerm) ||
                item.card.type_line.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Set Filter
        if (selectedSet !== 'all') {
            result = result.filter(item => item.card.set_name === selectedSet);
        }

        // 3. Rarity Filter
        if (selectedRarity !== 'all') {
            result = result.filter(item => item.card.rarity === selectedRarity);
        }

        // 4. Color Filter (OR logic: if card has ANY of the selected colors)
        if (selectedColors.length > 0) {
            result = result.filter(item => {
                const cardColors = item.card.colors || [];
                // If card is colorless and we filter for it? (Optional, skipping for now)
                // Match if card shares at least one color with selection
                if (cardColors.length === 0) return false; // Or strict colorless check?
                return selectedColors.some(c => cardColors.includes(c));
            });
        }

        // 5. Sort
        result.sort((a, b) => {
            const nameA = a.card.printed_name || a.card.name;
            const nameB = b.card.printed_name || b.card.name;

            switch (sortOption) {
                case 'name-asc':
                    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
                case 'price-desc':
                    return (parseFloat(b.card.prices.usd || "0") - parseFloat(a.card.prices.usd || "0"));
                case 'price-asc':
                    return (parseFloat(a.card.prices.usd || "0") - parseFloat(b.card.prices.usd || "0"));
                default:
                    return 0;
            }
        });

        return result;
    }, [collection, searchTerm, sortOption, selectedSet, selectedRarity, selectedColors]);

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (collection.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel rounded-2xl">
                <div className="text-5xl mb-6 opacity-80">📭</div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Tu Colección está vacía</h3>
                <p className="text-slate-400 mb-6 max-w-sm">
                    Empieza escaneando cartas o buscando manualmente para llenar tu carpeta digital.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/scan" className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> Empezar a Escanear
                    </Link>
                    {!useAuth().user && (
                        <Link href="/login" className="px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all font-medium flex items-center gap-2">
                            <LogIn size={18} /> Iniciar Sesión para Sincronizar
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    // Stats
    const totalCards = collection.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = processedCollection.reduce((acc, item) => {
        const price = parseFloat(item.card.prices.usd || "0");
        return acc + (price * item.quantity);
    }, 0);

    return (
        <div className="space-y-6 pb-24 md:pb-0">
            {/* Controls Bar */}
            <div className="flex flex-col gap-4 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 sticky top-0 md:top-20 z-40 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar (Nombre/Tipo)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 shrink-0">
                        {/* Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={clsx(
                                "relative p-2 rounded-xl border transition-all flex items-center gap-2",
                                isFilterOpen || activeFiltersCount > 0
                                    ? "bg-blue-600/20 border-blue-500 text-blue-200"
                                    : "bg-slate-950/50 border-slate-700/50 text-slate-400 hover:text-white"
                            )}
                        >
                            <Filter size={18} />
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="appearance-none bg-slate-950/50 border border-slate-700/50 rounded-xl py-2 pl-4 pr-10 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-full w-full cursor-pointer hover:bg-slate-900 transition-colors"
                            >
                                <option value="price-desc">💰 Precio: Aleatorio</option>
                                <option value="price-desc">💰 Precio: M-m</option>
                                <option value="price-asc">📉 Precio: m-M</option>
                                <option value="name-asc">🔤 Nombre: A-Z</option>
                            </select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-950/50 rounded-xl p-1 border border-slate-700/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={clsx("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-slate-700 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300")}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={clsx("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-slate-700 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300")}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Filter Panel */}
                {isFilterOpen && (
                    <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2 fade-in">
                        {/* Set Filter */}
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Edición</label>
                            <select
                                value={selectedSet}
                                onChange={(e) => setSelectedSet(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">Todas las Ediciones</option>
                                {uniqueSets.map(set => (
                                    <option key={set} value={set}>{set}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rarity Filter */}
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rareza</label>
                            <select
                                value={selectedRarity}
                                onChange={(e) => setSelectedRarity(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">Todas</option>
                                <option value="common">Común</option>
                                <option value="uncommon">Infrecuente</option>
                                <option value="rare">Rara</option>
                                <option value="mythic">Mítica</option>
                            </select>
                        </div>

                        {/* Color Filter */}
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Color</label>
                            <div className="flex gap-2">
                                {COLORS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => toggleColor(c.id)}
                                        className={clsx(
                                            "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all",
                                            selectedColors.includes(c.id)
                                                ? `${c.bg} ${c.border} ${c.text} ring-2 ring-white/20 scale-110`
                                                : "bg-slate-800 border-slate-600 text-slate-400 opacity-50 hover:opacity-100"
                                        )}
                                        title={c.label}
                                    >
                                        {c.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full"
                                >
                                    <X size={12} /> Limpiar Filtros
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stats Summary (Compact) */}
            <div className="flex justify-between items-center px-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
                <span>{processedCollection.length} Únicas • {totalCards} Total</span>
                <span className="text-emerald-400 font-bold text-sm">${totalValue.toFixed(2)}</span>
            </div>

            {processedCollection.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">No hay cartas que coincidan con los filtros.</p>
                    <button onClick={clearFilters} className="mt-2 text-blue-400 hover:underline">
                        Limpiar todos los filtros
                    </button>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        /* GRID VIEW */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {processedCollection.map((item) => (
                                <div key={item.card.id} className="relative group flex flex-col glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-white/20">
                                    <div
                                        className="relative aspect-[5/7] cursor-pointer tap-highlight"
                                        onClick={() => setDetailModalCard(item.card)}
                                    >
                                        {item.card.image_uris?.normal ? (
                                            <img
                                                src={item.card.image_uris.normal}
                                                alt={item.card.printed_name || item.card.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
                                                <span className="text-xs">Sin Imagen</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 shadow-lg pointer-events-none">
                                            x{item.quantity}
                                        </div>
                                    </div>

                                    <div className="p-3 flex-1 flex flex-col justify-between bg-slate-950/30 backdrop-blur-sm">
                                        <div className="mb-2 relative z-10">
                                            <h4 className="font-bold text-sm text-slate-100 line-clamp-1 leading-tight">{item.card.printed_name || item.card.name}</h4>
                                            <div className="text-[10px] text-slate-400 flex justify-between mt-1 items-center">
                                                <span className="uppercase tracking-wider opacity-70">{item.card.set_name.substring(0, 3)}</span>
                                                <span className={clsx("font-mono font-bold text-xs", item.isFoil ? "text-amber-400" : "text-emerald-400")}>
                                                    ${item.isFoil ? (item.card.prices.usd_foil || '-') : (item.card.prices.usd || '-')}
                                                    {item.isFoil && <span className="ml-1">✨</span>}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-white/5 gap-2 relative z-10">
                                            <button
                                                onClick={() => toggleFoil(item.card.id)}
                                                className={clsx(
                                                    "p-2 rounded-lg transition-all flex-1 flex justify-center text-xs font-bold",
                                                    item.isFoil
                                                        ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                                )}
                                                title={item.isFoil ? "Marcar como normal" : "Marcar como foil"}
                                            >
                                                {item.isFoil ? "✨" : "○"}
                                            </button>
                                            <div className="w-px h-4 bg-white/10" />
                                            <button
                                                onClick={() => setDeckModalCard(item.card)}
                                                className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors flex-1 flex justify-center"
                                            >
                                                <Layers size={16} />
                                            </button>
                                            <div className="w-px h-4 bg-white/10" />
                                            <div className="flex gap-1 flex-1 justify-end">
                                                <button onClick={() => removeFromCollection(item.card.id)} className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button onClick={() => addToCollection(item.card)} className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* LIST VIEW */
                        <div className="flex flex-col gap-2">
                            {processedCollection.map((item) => (
                                <div key={item.card.id} className="glass-panel p-3 rounded-xl flex items-center gap-3 transition-all active:scale-[0.99]">
                                    {/* Thumbnail */}
                                    <div
                                        className="w-12 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow-md"
                                        onClick={() => setDetailModalCard(item.card)}
                                    >
                                        {item.card.image_uris?.small ? (
                                            <img src={item.card.image_uris.small} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-500">Sin Img</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0" onClick={() => setDetailModalCard(item.card)}>
                                        <h4 className="font-bold text-sm text-slate-100 truncate">{item.card.printed_name || item.card.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span className="uppercase bg-slate-800 px-1.5 rounded text-[10px]">{item.card.set_name.substring(0, 3)}</span>
                                            <span>{item.card.type_line.split('—')[0].trim()}</span>
                                        </div>
                                        <div className="mt-1 font-mono text-emerald-400 font-bold text-xs">
                                            ${item.card.prices.usd || '-'}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center bg-slate-950/50 rounded-lg border border-slate-700/50 overflow-hidden">
                                            <button
                                                onClick={() => removeFromCollection(item.card.id)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold border-x border-slate-700/50">{item.quantity}</span>
                                            <button
                                                onClick={() => addToCollection(item.card)}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setDeckModalCard(item.card)}
                                            className="text-xs text-purple-400 flex items-center gap-1 py-1 px-2 rounded hover:bg-purple-500/10"
                                        >
                                            <Layers size={12} /> Al Mazo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {deckModalCard && (
                <AddToDeckModal card={deckModalCard} onClose={() => setDeckModalCard(null)} />
            )}

            {detailModalCard && (
                <CardDetailModal card={detailModalCard} onClose={() => setDetailModalCard(null)} />
            )}
        </div>
    );
}

