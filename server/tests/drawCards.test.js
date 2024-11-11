const resolvers = require('../schemas/resolvers');
const generateTemporaryReading = resolvers.Query.generateTemporaryReading;

describe('generateTemporaryReading resolver with simulated cases', () => {
    const testUserId = '66fc2604f791c903f8b938e6';
    const testDeckId = '66c6184ed8c96ed65ab4e708';
    const testSpreadId = '66c6184dd8c96ed65ab4e6f2';

    // Helper to simulate different draw sizes
    const simulateReading = async (drawSize) => {
        const context = { user: { id: testUserId } };
        const spreadOverride = { _id: testSpreadId, numCards: drawSize };

        return generateTemporaryReading(
            {},
            { userId: testUserId, deckId: testDeckId, spreadId: spreadOverride._id },
            context
        );
    };

    // Test generating a reading with the entire deck
    test('draws the entire deck with no duplicates', async () => {
        const result = await simulateReading(78);
        expect(result.cards.length).toBe(78);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(78);
    });

    // Test drawing one less than the full deck
    test('draws one less than full deck with no duplicates', async () => {
        const result = await simulateReading(77);
        expect(result.cards.length).toBe(77);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(77);
    });

    // Test drawing more than the deck size
    test('draws up to the deck size when more cards are requested', async () => {
        const result = await simulateReading(100);
        expect(result.cards.length).toBe(78);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(78);
    });

    // Basic uniqueness test for 6-card spread (actual spread size)
    test('generates a reading with unique cards for a 6-card spread', async () => {
        const result = await simulateReading(6);
        expect(result.cards.length).toBe(6);
        const cardIds = result.cards.map((card) => card.card._id);
        expect(new Set(cardIds).size).toBe(result.cards.length);
    });

    // Multiple draws to ensure unique cards each time
    test('draws unique cards in multiple consecutive readings for 6-card spread', async () => {
        for (let i = 0; i < 100; i++) {
            const result = await simulateReading(6);
            const cardIds = result.cards.map((card) => card.card._id);
            expect(new Set(cardIds).size).toBe(result.cards.length);
        }
    });
});
