import DailyDraw from '../../assets/Spreads/daily_draw_example.jpg';
import ThreeCard from '../../assets/Spreads/three_card_draw.jpg';
import Interview from '../../assets/Spreads/interview_spread.png';
import EOTSBack from '../../assets/CardBacks/eots_backs_01.jpg';
import RWSDBack from '../../assets/CardBacks/rwsd_backs_01.jpg';
import UniversalCarousel from './AltCarousel';
import SliderComponent from './SliderComponent';
import './Dashboard.css';
import { useTheme } from '../Settings/ThemeContext';
import { useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import {
    GET_ME,
    QUERY_ALL_DECKS_BY_USER,
    QUERY_ALL_FAVORITE_DECKS_BY_USER,
    QUERY_ALL_FAVORITE_SPREADS_BY_USER
} from '../../utils/queries';

const DashboardLeft = () => {
    const { theme } = useTheme();

    const [getMe, { data: meData, loading: meLoading }] = useLazyQuery(GET_ME);
    const [decksByUser] = useLazyQuery(QUERY_ALL_DECKS_BY_USER);
    const [favoriteDecksByUser] = useLazyQuery(QUERY_ALL_FAVORITE_DECKS_BY_USER);
    const [favoriteSpreadsByUser] = useLazyQuery(QUERY_ALL_FAVORITE_SPREADS_BY_USER);

    const [userInfo, setUserInfo] = useState({
        decks: [null],
        favoriteSpreads: [null],
        favoriteDecks: [null]
    });

    useEffect(() => {
        getMe();
    }, [getMe]);

    useEffect(() => {
        decksByUser();
        favoriteDecksByUser();
        favoriteSpreadsByUser();
    }, [decksByUser, favoriteDecksByUser, favoriteSpreadsByUser]);

    useEffect(() => {
        const fetchDeckDetails = async () => {
            if (meData.me._id) {
                const deckDetailsObject = {};
                const { data } = await decksByUser({ variables: { userId: meData.me._id } });

                if (data && data.allDecksByUser) {
                    data.allDecksByUser.forEach((deck) => {
                        deckDetailsObject[deck.deckId] = {
                            _id: deck._id,
                            name: deck.deckName,
                            description: deck.deckDescription,
                            imageUrl: deck.imageUrl
                        };
                    });
                }

                setUserInfo((prev) => ({
                    ...prev,
                    decks: deckDetailsObject
                }));
            }
        };
        if (!meLoading && meData?.me) {
            fetchDeckDetails();
        }
    }, [meData, meLoading, decksByUser]);

    useEffect(() => {
        const fetchFavoriteDeckDetails = async () => {
            if (meData.me._id) {
                const deckDetailsObject = {};
                const { data } = await favoriteDecksByUser({ variables: { userId: meData.me._id } });

                if (data && data.allFavoriteDecksByUser) {
                    data.allFavoriteDecksByUser.forEach((deck) => {
                        deckDetailsObject[deck.deckId] = {
                            _id: deck._id,
                            name: deck.deckName,
                            description: deck.deckDescription,
                            imageUrl: deck.imageUrl
                        };
                    });
                }

                setUserInfo((prev) => ({
                    ...prev,
                    favoriteDecks: deckDetailsObject
                }));
            }
        };
        if (!meLoading && meData?.me) {
            fetchFavoriteDeckDetails();
        }
    }, [meData, meLoading, favoriteDecksByUser]);

    useEffect(() => {
        const fetchFavoriteSpreadsDetails = async () => {
            if (meData.me._id) {
                const spreadDetailsObject = {};
                const { data } = await favoriteSpreadsByUser({ variables: { userId: meData.me._id } });

                if (data && data.allFavoriteSpreadsByUser) {
                    data.allFavoriteSpreadsByUser.forEach((spread) => {
                        // Convert "Daily Focus" to "daily_focus"
                        const spreadKey = spread.spreadName
                            .toLowerCase() // Convert to lowercase
                            .replace(/\s+/g, '_'); // Replace spaces with underscores

                        // Rename spreadName to name and spreadDescription to description
                        spreadDetailsObject[spreadKey] = {
                            _id: spread._id,
                            name: spread.spreadName,
                            description: spread.spreadDescription,
                            imageUrl: spread.imageUrl
                        };
                    });
                }

                setUserInfo((prev) => ({
                    ...prev,
                    favoriteSpreads: spreadDetailsObject
                }));
            }
        };
        if (!meLoading && meData?.me) {
            fetchFavoriteSpreadsDetails();
        }
    }, [meData, meLoading, favoriteSpreadsByUser]);

    const deckImages = [
        { src: EOTSBack, alt: 'Deck' },
        { src: RWSDBack, alt: 'Deck' },
        { src: EOTSBack, alt: 'Deck' },
        { src: RWSDBack, alt: 'Deck' },
        { src: EOTSBack, alt: 'Deck' },
        { src: RWSDBack, alt: 'Deck' }
    ];

    const spreadImages = [
        { src: DailyDraw, alt: 'Daily Draw' },
        { src: ThreeCard, alt: 'Three Card Draw' },
        { src: Interview, alt: 'Interview Spread' },
        { src: DailyDraw, alt: 'Daily Draw' },
        { src: ThreeCard, alt: 'Three Card Draw' },
        { src: Interview, alt: 'Interview Spread' }
    ];

    return (
        <section className='left-dash-container'>
            <section className='left-dash-content'>
                <div className='my-decks'>
                    <h2>My Decks</h2>
                    <hr className='hr-spread' />
                    <SliderComponent
                        userInfo={userInfo.decks}
                        type={'Decks'}
                    />
                </div>
                <div className='my-spreads'>
                    <h2>Favorite Spreads</h2>
                    <hr className='hr-spread' />
                    <SliderComponent
                        userInfo={userInfo.favoriteSpreads}
                        type={'Spreads'}
                    />
                </div>
                <div className='fav-decks'>
                    <h2>Favorite Decks</h2>
                    <hr className='hr-spread' />
                    <SliderComponent
                        userInfo={userInfo.favoriteDecks}
                        type={'FavoriteDecks'}
                        deckInfo={userInfo.decks}
                    />
                </div>
            </section>
        </section>
    );
};

export default DashboardLeft;
