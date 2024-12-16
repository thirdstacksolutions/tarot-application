import React, { useEffect, useState, useRef } from 'react';
import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
// the useReadingContext hook passes selectedSpread, selectedDeck, and userId from the ReadingAside component to the NewReading component
import { useReadingContext } from '../../context/ReadingContext';

// these spreads are the different layouts that can be used for the tarot readings
import OneCardCenter from '../../components/SpreadLayouts/OneCardCenter';
import ThreeCardHorizontal from '../../components/SpreadLayouts/ThreeCardHorizontal';
import SixSpokesUpright from '../../components/SpreadLayouts/SixSpokesUpright';

//this query is used to create a temporary reading which is not saved to the database but stored in the cache
import { CREATE_TEMPORARY_READING } from '../../utils/queries.js';
import { CREATE_TAROT_READING } from '../../utils/mutations.js';

import './NewReading.css';

const NewReading = () => {
    const client = useApolloClient();

    const { selectedSpread, selectedDeck, userId } = useReadingContext();
    const [readingData, setReadingData] = useState(null); // Local state for reading data
    const [cardData, setCardData] = useState([]);
    const cardRefs = useRef([]);
    const [toggleRender, setToggleRender] = useState(false);
    const [readingStage, setReadingStage] = useState('initial');
    const [isExpanded, setIsExpanded] = useState(false);

    const [createTemporaryReading, { data, loading, error }] = useLazyQuery(CREATE_TEMPORARY_READING, {
        fetchPolicy: 'no-cache'
    });
    const [createTarotReading, { loading: savingReading, error: saveError }] = useMutation(CREATE_TAROT_READING, {
        fetchPolicy: 'no-cache'
    });

    useEffect(() => {
        if (data) {
            console.log('Temporary reading created:', data);
            setReadingData(data.generateTemporaryReading);
            setCardData(data.generateTemporaryReading.cards);
        }
        if (error) {
            console.error('Error creating temporary reading:', error);
        }
        if (saveError) {
            console.error('Error saving the reading:', saveError);
        }
    }, [data, error, saveError]);

    useEffect(() => {
        if (cardData.length > 0) {
            cardRefs.current = Array(cardData.length).fill(false);
        }
    }, [cardData.length]);

    const handleRevealNextCard = () => {
        if (!readingData) {
            console.log('No Data');
            return;
        }

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
        const confirmSave = window.confirm('SAVE READING MODAL WITH INPUT FIELDS FOR JOURNAL ENTRY GOES HERE');
        if (confirmSave) {
            if (readingData && selectedSpread && selectedDeck && userId) {
                const cardObjects = readingData.cards.map((card) => ({
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
                        setReadingStage('saved');
                    })
                    .catch((error) => {
                        console.error('Error saving the reading:', error);
                    });
            } else {
                console.error('Required data missing: Check if deck, spread, or user is selected.');
            }
        }
    };

    const handleStartReading = () => {
        console.log('reading started');
        console.log('reading data', selectedDeck, selectedSpread, userId);
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
        // console.log('reading data', selectedDeck, selectedSpread, userId);
        console.log('reading complete');
    };

    const handleExitReading = () => {
        const confirmExit = window.confirm('EXIT READING DOES NOT SAVE READING MODAL HERE');
        if (confirmExit) {
            // Clear local state
            setReadingStage('initial');
            setReadingData(null);
            setCardData([]);
            cardRefs.current = [];
            setToggleRender(false);
            setIsExpanded(false);

            // Clear temporary reading from cache
            client.cache.evict({ fieldName: 'generateTemporaryReading' });
            client.cache.gc();
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
                        : readingStage === 'save'
                          ? 'Save Reading'
                          : 'Reading Saved'}
            </button>
            {isExpanded && (
                <button
                    className='button'
                    onClick={handleExitReading}>
                    Exit Reading
                </button>
            )}

            {loading && <p>Loading...</p>}
            {savingReading && <p>Saving reading...</p>}
        </section>
    );
};

export default NewReading;
