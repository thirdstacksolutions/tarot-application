import React, { useEffect, useState, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useReadingContext } from '../../context/ReadingContext';

import OneCardCenter from '../../components/SpreadLayouts/OneCardCenter';
import ThreeCardHorizontal from '../../components/SpreadLayouts/ThreeCardHorizontal';
import SixSpokesUpright from '../../components/SpreadLayouts/SixSpokesUpright';

import { CREATE_TEMPORARY_READING } from '../../utils/queries.js';
import { CREATE_TAROT_READING } from '../../utils/mutations.js';

const NewReading = () => {
    const { selectedSpread, selectedDeck, userId, isExpanded, setIsExpanded } = useReadingContext();

    const [cardData, setCardData] = useState([]);
    const cardRefs = useRef([]);
    const [toggleRender, setToggleRender] = useState(false);
    const [readingStage, setReadingStage] = useState('initial');

    const [createTemporaryReading, { data, loading, error }] = useLazyQuery(CREATE_TEMPORARY_READING);
    const [createTarotReading, { loading: savingReading, error: saveError }] = useMutation(CREATE_TAROT_READING);

    useEffect(() => {
        if (cardData.length > 0) {
            cardRefs.current = Array(cardData.length).fill(false);
        }
    }, [cardData.length]);

    useEffect(() => {
        if (data) {
            console.log('Temporary reading created:', data);
            setCardData(data.generateTemporaryReading.cards);
        }
        if (error) {
            console.error('Error creating temporary reading:', error);
        }
        if (saveError) {
            console.error('Error saving the reading:', saveError);
        }
    }, [data, error, saveError]);

    const handleRevealNextCard = () => {
        const nextCardIndex = cardRefs.current.findIndex((isFlipped) => !isFlipped);

        if (nextCardIndex !== -1 && nextCardIndex < cardData.length) {
            cardRefs.current[nextCardIndex] = true;
            console.log(`Revealing card at position: ${nextCardIndex + 1}`);
            setToggleRender((prev) => !prev);

            if (nextCardIndex === cardData.length - 1) {
                setReadingStage('save');
            }
        } else {
            console.log('All cards are revealed');
        }
    };

    const handleSaveReading = () => {
        if (data && data.generateTemporaryReading && selectedSpread && selectedDeck && userId) {
            const cardObjects = data.generateTemporaryReading.cards.map((card) => ({
                card: card.card._id,
                position: card.position,
                orientation: card.orientation
            }));
            createTarotReading({
                variables: {
                    userId,
                    deckId: selectedDeck._id,
                    spreadId: selectedSpread._id,
                    cardObjects
                }
            })
                .then((response) => {
                    console.log('Reading saved:', response.data);
                    setReadingStage('initial');
                })
                .catch((error) => {
                    console.error('Error saving the reading:', error);
                });
        } else {
            console.error('Required data missing: Check if deck, spread, or user is selected.');
        }
    };

    const handleStartReading = () => {
        if (selectedSpread && selectedDeck && userId) {
            createTemporaryReading({
                variables: {
                    userId,
                    spreadId: selectedSpread._id,
                    deckId: selectedDeck._id
                }
            })
                .then(() => {
                    setReadingStage('reveal');
                    setIsExpanded(true);
                })
                .catch((error) => {
                    console.error('Error starting the reading:', error);
                });
        } else {
            console.error('Spread, Deck, or User not selected');
        }
    };

    const layoutMap = {
        OneCardCenter: OneCardCenter,
        ThreeCardHorizontal: ThreeCardHorizontal,
        SixSpokesUpright: SixSpokesUpright
    };

    const LayoutComponent = layoutMap[selectedSpread?.layout] || null;

    return (
        <section className={`new-reading ${isExpanded ? 'expanded' : ''}`}>
            <h2>New Reading</h2>

            {selectedSpread ? (
                <div>
                    <h3>Selected Spread:</h3>
                    <p>Name: {selectedSpread.spreadName}</p>
                    <p>Details: {selectedSpread.spreadDescription}</p>
                    <p>Number of Cards: {selectedSpread.numCards}</p>
                    {selectedDeck ? (
                        <div>
                            <h3>Selected Deck:</h3>
                            <p>Name: {selectedDeck.deckName}</p>
                        </div>
                    ) : (
                        <p>No deck selected</p>
                    )}

                    {LayoutComponent ? (
                        <LayoutComponent
                            spreadData={selectedSpread}
                            deckData={selectedDeck}
                            cardData={cardData}
                            cardRefs={cardRefs}
                        />
                    ) : (
                        <p>No matching layout found for this spread.</p>
                    )}
                </div>
            ) : (
                <p>No spread selected</p>
            )}

            <button
                className='button'
                onClick={() => {
                    if (readingStage === 'initial') handleStartReading();
                    else if (readingStage === 'reveal') handleRevealNextCard();
                    else if (readingStage === 'save') handleSaveReading();
                }}
                disabled={loading}>
                {loading
                    ? 'Loading...'
                    : readingStage === 'initial'
                      ? 'Start Reading'
                      : readingStage === 'reveal'
                        ? 'Reveal Next Card'
                        : 'Save Reading'}
            </button>
            <button className='button'>Reset Board</button>

            {loading && <p>Loading...</p>}
            {savingReading && <p>Saving reading...</p>}
        </section>
    );
};

export default NewReading;
