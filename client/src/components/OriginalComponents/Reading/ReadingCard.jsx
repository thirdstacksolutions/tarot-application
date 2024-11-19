import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_TAROT_READING } from '../../../utils/mutations';
import { QUERY_ALL_SPREADS, QUERY_ALL_DECKS, GET_ME } from '../../../utils/queries';

const createTarotReading = () => {
    // Creation of states to keep data seperate
    const [userId, setUserId] = useState(null);
    const [spreads, setSpreads] = useState([]);
    const [decks, setDecks] = useState([]);

    const [formState, setFormState] = useState({
        deckId: '',
        spreadId: ''
    });

    // Queries over spreads, decks, and userID
    const [getMe, { data: userData }] = useLazyQuery(GET_ME);
    const [fetchAllSpreads, { data: spreadsData }] = useLazyQuery(QUERY_ALL_SPREADS);
    const [fetchAllDecks, { data: decksData }] = useLazyQuery(QUERY_ALL_DECKS);

    // Uses mutation to create reading
    const [createTarotReading] = useMutation(CREATE_TAROT_READING);

    useEffect(() => {
        let mounted = true; // Flag to track if component is mounted

        if (userData && userData.me && mounted) {
            setUserId(userData.me._id);
            console.log('User ID:', userData.me._id); // Log userId after it's been set
        }

        // Cleanup function: Remove the effect once the state is populated
        return () => {
            // Set the mounted flag to false when component is unmounted
            mounted = false;
            console.log('Effect removed');
        };
    }, [userData, userId]);

    useEffect(() => {
        if (spreadsData && spreadsData.allSpreads) {
            setSpreads(spreadsData.allSpreads);
            console.log('Spreads:', spreadsData.allSpreads); // Log spreads after they're set
        }

        // Cleanup function: Remove the effect once spreads state is populated
        return () => {
            if (spreads.length > 0) {
                // Spreads state is populated, so remove the effect
                console.log('Spreads effect removed');
                return;
            }
        };
    }, [spreadsData, spreads]);

    useEffect(() => {
        if (decksData && decksData.allDecks) {
            setDecks(decksData.allDecks);
            console.log('Decks:', decksData.allDecks); // Log decks after they're set
        }

        // Cleanup function: Remove the effect once decks state is populated
        return () => {
            if (decks.length > 0) {
                // Decks state is populated, so remove the effect
                console.log('Decks effect removed');
                return;
            }
        };
    }, [decksData, decks]);

    useEffect(() => {
        getMe();
        fetchAllSpreads();
        fetchAllDecks();
    }, []); // Empty dependency array to run once on component mount

    const handleChange = async (event) => {
        const { name, value } = event.target;

        if (name === 'spread') {
            setFormState({
                ...formState,
                spreadId: value
            });
        }
        if (name === 'deck') {
            setFormState({
                ...formState,
                deckId: value
            });
        }
    };

    const createTarotReadingSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await createTarotReading({
                variables: {
                    userId,
                    ...formState
                }
            });

            console.log('Created Reading:', data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <form onSubmit={createTarotReadingSubmit}>
                <h1
                    className='text-bold'
                    style={{
                        color: '#A89467',
                        fontFamily: 'Playfair Display'
                    }}>
                    Create Reading
                </h1>
                <Form.Group
                    className='mb-3 text-white'
                    controlId='formBasicReading'>
                    <Form.Label>Spread</Form.Label>
                    <Form.Select
                        value={formState.spreadId} // Use selectedSpreadId here
                        name='spread'
                        onChange={handleChange} // Update selectedSpreadId
                    >
                        <option value=''>Select Spread</option>
                        {spreads.map((spread) => (
                            <option
                                key={spread._id}
                                value={spread._id}>
                                {spread.spreadName}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group
                    className='mb-3 text-white'
                    controlId='formBasicDeck'>
                    <Form.Label>Deck</Form.Label>
                    <Form.Select
                        value={formState.deckId}
                        name='deck'
                        onChange={handleChange}>
                        <option value=''>Select Deck</option>
                        {decks.map((deck) => (
                            <option
                                key={deck._id}
                                value={deck._id}>
                                {deck.deckName}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button
                    id='button'
                    type='submit'>
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default createTarotReading;
