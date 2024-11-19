import { createContext, useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_DECKS, QUERY_ALL_SPREADS, GET_ME } from '../utils/queries';
import { CookieSettingsContext } from '../pages/Settings/SettingsRight/CookiesSettings';

// Create the context
const ReadingContext = createContext();

// Custom hook to use the context
export const useReadingContext = () => useContext(ReadingContext);

export const ReadingContextProvider = ({ children }) => {
    const [selectedSpread, setSelectedSpread] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);

    const { preferences } = useContext(CookieSettingsContext);

    // Fetch user data, decks, and spreads
    const { data: userData, loading: userLoading } = useQuery(GET_ME);
    const { data: allDecksData } = useQuery(QUERY_ALL_DECKS);
    const { data: allSpreadsData } = useQuery(QUERY_ALL_SPREADS);

    // Set the default deck and spread when user data is loaded
    useEffect(() => {
        if (userData && allDecksData && allSpreadsData) {
            const defaultDeck = allDecksData.allDecks.find((deck) => deck._id === preferences.defaultData.deck);
            const defaultSpread = allSpreadsData.allSpreads.find(
                (spread) => spread._id === preferences.defaultData.spread
            );

            setSelectedDeck(defaultDeck);
            setSelectedSpread(defaultSpread);
        }
    }, [userData, allDecksData, allSpreadsData]);

    return (
        <ReadingContext.Provider
            value={{
                selectedSpread,
                setSelectedSpread,
                selectedDeck,
                setSelectedDeck,
                allDecks: allDecksData?.allDecks || [],
                allSpreads: allSpreadsData?.allSpreads || [],
                userId: userData?.me?._id || null // Add userId to the context value
            }}>
            {children}
        </ReadingContext.Provider>
    );
};
