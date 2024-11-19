import { useMemo, useRef } from 'react';
import { useReadingContext } from '../../context/ReadingContext'; // Use context here
import './ReadingAside.css';

const ReadingAside = () => {
    const panelRef = useRef(null);

    // Access setSelectedSpread and setSelectedDeck, and fetched spreads and decks from the context
    const { setSelectedSpread, setSelectedDeck, allSpreads, allDecks } = useReadingContext();

    // Memoize combined data for spreads and decks
    const combinedItems = useMemo(() => {
        return [
            ...allSpreads.map((spread) => ({
                type: 'spread',
                image: spread.imageUrl,
                name: spread.spreadName,
                fullData: spread // Pass the full spread data on selection
            })),
            ...allDecks.map((deck) => ({
                type: 'deck',
                image: deck.imageUrl,
                name: deck.deckName,
                fullData: deck // Pass the full deck data on selection
            }))
        ];
    }, [allSpreads, allDecks]);

    const spreadsItems = combinedItems.filter((item) => item.type === 'spread');
    const decksItems = combinedItems.filter((item) => item.type === 'deck');

    // Handle panel movement without causing a re-render
    const handleSpreadsClick = () => {
        panelRef.current.classList.add('show-spreads');
        panelRef.current.classList.remove('show-decks');
    };

    const handleDecksClick = () => {
        panelRef.current.classList.add('show-decks');
        panelRef.current.classList.remove('show-spreads');
    };

    const handleSpreadImageClick = (spread) => {
        setSelectedSpread(spread.fullData); // Use context to update selected spread
    };

    const handleDeckImageClick = (deck) => {
        setSelectedDeck(deck.fullData); // Use context to update selected deck
    };

    return (
        <div className='reading-aside'>
            <div
                ref={panelRef}
                className={`slide-container show-spreads`}>
                {/* Spreads Panel */}
                <div className='spreads-container'>
                    <div className='button-background'>
                        <button
                            onClick={handleDecksClick}
                            className='reading-button button'>
                            View Decks
                        </button>
                    </div>

                    <div className='scrolling-spreads-container'>
                        {spreadsItems.map((item, idx) => (
                            <div
                                key={idx}
                                className='spread-slide'>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    onClick={() => handleSpreadImageClick(item)} // Select spread via context
                                />
                                <p>{item.name}</p>
                                <button
                                    className='spread-info-btn button'
                                    onClick={() => console.log('Spread Info:', item.fullData)}>
                                    Spread Info
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decks Panel */}
                <div className='decks-container'>
                    <div className='button-background'>
                        <button
                            onClick={handleSpreadsClick}
                            className='reading-button button'>
                            View Spreads
                        </button>
                    </div>
                    <div className='scrolling-decks-container'>
                        {decksItems.map((item, idx) => (
                            <div
                                key={idx}
                                className='deck-slide'>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    onClick={() => handleDeckImageClick(item)}
                                />
                                <p>{item.name}</p>
                                <button
                                    className='deck-info-btn button'
                                    onClick={() => console.log('Deck Info:', item.fullData)}>
                                    Deck Info
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadingAside;
