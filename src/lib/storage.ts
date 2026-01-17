"use client";

import { useState, useEffect } from 'react';
import { ScryfallCard } from './scryfall';
export type { ScryfallCard };

export interface CollectionItem {
    card: ScryfallCard;
    quantity: number;
    addedAt: number;
}

export interface Deck {
    id: string;
    name: string;
    cards: { card: ScryfallCard; quantity: number }[];
    createdAt: number;
}

export function useCollection() {
    const [collection, setCollection] = useState<CollectionItem[]>([]);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedCollection = localStorage.getItem('mtg-collection');
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (savedCollection) setCollection(JSON.parse(savedCollection));

            const savedDecks = localStorage.getItem('mtg-decks');
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (savedDecks) setDecks(JSON.parse(savedDecks));
        } catch (e) {
            console.error("Failed to load data", e);
        }

        setIsLoaded(true);
    }, []);

    const saveCollection = (newCollection: CollectionItem[]) => {
        setCollection(newCollection);
        localStorage.setItem('mtg-collection', JSON.stringify(newCollection));
    };

    const saveDecks = (newDecks: Deck[]) => {
        setDecks(newDecks);
        localStorage.setItem('mtg-decks', JSON.stringify(newDecks));
    };

    const addToCollection = (card: ScryfallCard) => {
        const existingIndex = collection.findIndex(item => item.card.id === card.id);
        const newCollection = [...collection];

        if (existingIndex >= 0) {
            newCollection[existingIndex].quantity += 1;
        } else {
            newCollection.push({ card, quantity: 1, addedAt: Date.now() });
        }

        saveCollection(newCollection);
    };

    const removeFromCollection = (cardId: string) => {
        const existingIndex = collection.findIndex(item => item.card.id === cardId);
        if (existingIndex === -1) return;

        const newCollection = [...collection];
        if (newCollection[existingIndex].quantity > 1) {
            newCollection[existingIndex].quantity -= 1;
        } else {
            newCollection.splice(existingIndex, 1);
        }
        saveCollection(newCollection);
    };

    const createDeck = (name: string) => {
        const newDeck: Deck = { id: crypto.randomUUID(), name, cards: [], createdAt: Date.now() };
        saveDecks([...decks, newDeck]);
    };

    const addCardToDeck = (deckId: string, card: ScryfallCard, quantity: number = 1) => {
        const deckIndex = decks.findIndex(d => d.id === deckId);
        if (deckIndex === -1) return;

        const newDecks = [...decks];
        const deck = newDecks[deckIndex];
        const cardIndex = deck.cards.findIndex(c => c.card.id === card.id);

        if (cardIndex >= 0) {
            deck.cards[cardIndex].quantity += quantity;
        } else {
            deck.cards.push({ card, quantity });
        }

        saveDecks(newDecks);
    };

    return { collection, decks, isLoaded, addToCollection, removeFromCollection, createDeck, addCardToDeck };
}
