import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useReadingContext } from '../../context/ReadingContext';

import OneCardCenter from '../../components/SpreadLayouts/OneCardCenter';
import ThreeCardHorizontal from '../../components/SpreadLayouts/ThreeCardHorizontal';
import SixSpokesUpright from '../../components/SpreadLayouts/SixSpokesUpright';

import { CREATE_TEMPORARY_READING } from '../../utils/queries.js';
import { CREATE_TAROT_READING } from '../../utils/mutations.js';

const NewReading = () => {
    const { selectedSpread, selectedDeck, userId } = useReadingContext();
    const [showCardFronts, setShowCardFronts] = useState(false);
    const [cardData, setCardData] = useState([]);

    const [createTemporaryReading, { data, loading, error }] = useLazyQuery(CREATE_TEMPORARY_READING);

    const [createTarotReading, { loading: savingReading, error: saveError }] = useMutation(CREATE_TAROT_READING);

    useEffect(() => {
        if (data) {
            console.log('Temporary reading created:', data);
            setCardData(data.generateTemporaryReading.cards);
            setShowCardFronts(true);
        }
        if (error) {
            console.error('Error creating temporary reading:', error);
        }
        if (saveError) {
            console.error('Error saving the reading:', saveError);
        }
    }, [data, error, saveError]);

    const handleSaveReading = () => {
        if (data && data.generateTemporaryReading && selectedSpread && selectedDeck && userId) {
            const cardObjects = data.generateTemporaryReading.cards.map((card) => ({
                card: card.card._id,
                position: card.position,
                orientation: card.orientation
            }));
            console.log('Deck ID:', selectedDeck._id);
            console.log('Spread ID:', selectedSpread._id);
            console.log('Card Objects:', cardObjects);

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
                })
                .catch((error) => {
                    console.error('Error saving the reading:', error);
                });
        } else {
            console.error('Required data missing: Check if deck, spread, or user is selected.');
        }
    };

    const handleStartReading = () => {
        console.log('Start reading clicked');
        if (selectedSpread && selectedDeck && userId) {
            createTemporaryReading({
                variables: {
                    userId,
                    spreadId: selectedSpread._id,
                    deckId: selectedDeck._id
                }
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
        <section>
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
                            showCardFronts={showCardFronts}
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
                onClick={handleStartReading}
                disabled={loading}>
                {loading ? 'Starting Reading...' : 'Start Reading'}
            </button>

            <button
                className='button'
                onClick={handleSaveReading}>
                Save Reading
            </button>

            {loading && <p>Loading...</p>}
            {savingReading && <p>Saving reading...</p>}
        </section>
    );
};

export default NewReading;
