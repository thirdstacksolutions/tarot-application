export const getCardRotation = (cardOrientation, deckName) => {
    if (deckName === 'Eclipse of the Soul Tarot') {
        return cardOrientation === 'Eclipsed' ? 'rotate(180deg)' : 'none';
    }
    return cardOrientation === 'Reversed' ? 'rotate(180deg)' : 'none';
};
