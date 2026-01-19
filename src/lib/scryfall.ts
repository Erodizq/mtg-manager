export interface ScryfallCard {
    id: string;
    name: string;
    image_uris?: {
        normal: string;
        small: string;
    };
    prices: {
        usd: string | null;
        eur: string | null;
        usd_foil: string | null;
        eur_foil: string | null;
    };
    set_name: string;
    collector_number: string;
    rarity: string;
    cmc: number;
    type_line: string;
    mana_cost?: string;
    colors?: string[];
    printed_name?: string; // Localized name
    lang?: string;
}

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

export async function searchCard(query: string): Promise<ScryfallCard[]> {
    if (!query) return [];

    try {
        // Encode the query for URL
        const term = encodeURIComponent(query);

        // Use unique=prints to get all printings
        // Note: We removed include_multilingual because it conflicts with advanced syntax like set:AFR cn:325
        // Advanced syntax already handles language selection properly
        const response = await fetch(`${SCRYFALL_API_BASE}/cards/search?q=${term}&unique=prints`);

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Failed to fetch from Scryfall');
        }

        const data = await response.json();
        let cards: ScryfallCard[] = data.data || [];

        return cards;
    } catch (error) {
        console.error('Scryfall search error:', error);
        return [];
    }
}

export async function getCardNamed(name: string): Promise<ScryfallCard | null> {
    try {
        const response = await fetch(`${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodeURIComponent(name)}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Scryfall named search error:', error);
        return null;
    }
}
