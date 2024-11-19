const { drawCards } = require('../schemas/resolvers');

const mockGenerateTemporaryReading = async (_, { deckId, spreadId, numCards = 6 }) => {
    const deck = Array.from({ length: 78 }, (_, i) => ({ _id: `card${i}`, cardName: `Card ${i}` }));
    const drawnCards = drawCards(deck, numCards);

    return {
        deck: { _id: deckId, deckName: 'Mocked Deck' },
        spread: { _id: spreadId, spreadName: 'Mocked Spread' },
        cards: drawnCards.map((card, index) => ({
            card: { _id: card._id, cardName: card.cardName, imageUrl: 'mockedImageUrl' },
            position: index + 1,
            orientation: Math.random() < 0.5 ? 'Upright' : 'Reversed'
        }))
    };
};

describe('generateTemporaryReading resolver with simulated cases', () => {
    const testUserId = '66fc2604f791c903f8b938e6';
    const testDeckId = '66c6184ed8c96ed65ab4e708';
    const testSpreadId = '66c6184dd8c96ed65ab4e6f2';

    const simulateReading = async (drawSize) => {
        const context = { user: { id: testUserId } };
        return mockGenerateTemporaryReading(
            {},
            { userId: testUserId, deckId: testDeckId, spreadId: testSpreadId, numCards: drawSize },
            context
        );
    };

    test('draws the entire deck with no duplicates', async () => {
        const result = await simulateReading(78);
        expect(result.cards.length).toBe(78);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(78);
    });

    test('draws one less than full deck with no duplicates', async () => {
        const result = await simulateReading(77);
        expect(result.cards.length).toBe(77);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(77);
    });

    test('draws up to the deck size when more cards are requested', async () => {
        const result = await simulateReading(100);
        expect(result.cards.length).toBe(78);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(78);
    });

    test('generates a reading with unique cards for a 6-card spread', async () => {
        const result = await simulateReading(6);
        expect(result.cards.length).toBe(6);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(result.cards.length);
    });

    test('draws unique cards in multiple consecutive readings for a 6-card spread', async () => {
        for (let i = 0; i < 100; i++) {
            const result = await simulateReading(6);
            const cardIds = result.cards.map((card) => card.card._id);
            expect(new Set(cardIds).size).toBe(result.cards.length);
        }
    });
});
