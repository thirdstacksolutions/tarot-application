import { useState, forwardRef, cloneElement, useContext, useEffect } from 'react';
import { CookieSettingsContext } from './CookiesSettings';
import PropTypes from 'prop-types';
import CustomSwitch from '../Switch';
import Avatar from '../../../assets/08_Strength.jpg';
import AvatarIcon from '../../../assets/Icons/Crystals_wh.png';
import { useTheme } from '../ThemeContext';
import SelectorComponent from '../SelectorMenu';
import Modal from '@mui/material/Modal';
import AvatarModal from './AvatarModal';
import { useSpring, animated } from '@react-spring/web';
import { QUERY_APPEARANCE_DATA, GET_THEME_DETAILS, GET_DECK_DETAILS, GET_SPREAD_DETAILS } from '../../../utils/queries';
import { useLazyQuery } from '@apollo/client';
import '../Settings.css';
import themes from '../ThemeConfig';

const Fade = forwardRef(function Fade(props, ref) {
    const { children, in: open, onClick, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        }
    });

    return (
        <animated.div
            ref={ref}
            style={style}
            {...other}>
            {cloneElement(children, { onClick })}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func
};

const Appearance = () => {
    const { preferences, updatePreferences } = useContext(CookieSettingsContext);

    const { changeTheme } = useTheme();
    const [selectedValue, setSelectedValue] = useState({
        theme: { value: '', placeholder: 'Select a Theme', default: null },
        deck: { value: '', placeholder: 'Select a Deck', default: null },
        spread: { value: '', placeholder: 'Select a Spread', default: null }
    });
    const [open, setOpen] = useState(false); // sets whether or not work modal is opened
    const [appearanceData, setAppearanceData] = useState({});

    const [getAppearance, { data: getAppearanceData, loading: appearanceLoading }] =
        useLazyQuery(QUERY_APPEARANCE_DATA);
    const [getThemeDetails] = useLazyQuery(GET_THEME_DETAILS);
    const [getDeckDetails] = useLazyQuery(GET_DECK_DETAILS);
    const [getSpreadDetails] = useLazyQuery(GET_SPREAD_DETAILS);

    const [userDecks, setUserDecks] = useState([]);
    const [userThemes, setUserThemes] = useState([]);
    const [userSpreads, setUserSpreads] = useState([]);

    const stateSetters = {
        deck: userDecks,
        theme: userThemes,
        spread: userSpreads
    };

    useEffect(() => {
        getAppearance();
    }, [getAppearance]);

    useEffect(() => {
        if (getAppearanceData) {
            setAppearanceData(getAppearanceData);
        }
    }, [getAppearanceData]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectorChange = (key, value) => {
        if (value !== 'Try Another Theme' && key === 'theme') {
            changeTheme(value);
        }
        setSelectedValue((prevState) => ({
            ...prevState,
            [key]: {
                ...prevState[key],
                value: value
            }
        }));

        let valueObject;
        let updatedPreferences;
        if (key !== 'spread') {
            valueObject = stateSetters[key].find((obj) => obj.value === value);
            updatedPreferences = {
                ...preferences,
                [key]: valueObject._id
            };
        } else {
            updatedPreferences = {
                ...preferences,
                [key]: value
            };
        }

        updatePreferences(updatedPreferences);
    };

    const handleModalClose = () => {
        handleClose(); // Close the modal in Cards component
    };

    const handleToggle = (key) => {
        updatePreferences({ [key]: !preferences[key] });
    };

    useEffect(() => {
        const fetchThemeDetails = async () => {
            if (appearanceData.me.themes.length > 0) {
                const themeIds = appearanceData.me.themes.map((theme) => theme._id);

                // To hold fetched theme details
                // const themeDetailsArray = [];

                // Fetch theme details in parallel using Promise.all
                const themeDetailsArray = await Promise.all(
                    themeIds.map(async (themeId) => {
                        const { data } = await getThemeDetails({ variables: { themeId } });
                        return data?.themeDetails || null; // Return the details or null if not found
                    })
                );

                // Filter out any null entries in case a theme didn't return
                const validThemeDetailsArray = themeDetailsArray.filter(Boolean);
                validThemeDetailsArray.forEach((theme, idx) => {
                    if (!themes[theme.value]) {
                        validThemeDetailsArray.splice(idx, 1);
                        console.log(`Theme ${theme.value} is not present in css themes object`);
                    }
                });

                // Set the fetched theme details
                setUserThemes(validThemeDetailsArray);

                // Fetch default theme details
                if (preferences.defaultData.theme) {
                    const { data: defaultData } = await getThemeDetails({
                        variables: { themeId: preferences.defaultData.theme }
                    });
                    if (defaultData && defaultData.themeDetails) {
                        setSelectedValue((prev) => ({
                            ...prev,
                            theme: {
                                ...prev.theme,
                                default: defaultData.themeDetails
                            }
                        }));
                    }
                }
            }
        };

        if (!appearanceLoading && appearanceData?.me) {
            fetchThemeDetails();
        }

        if (preferences.saveChanges === true) {
            setSelectedValue((prev) => ({
                ...prev,
                theme: { value: '', placeholder: 'Select a Theme', default: null },
                deck: { value: '', placeholder: 'Select a Deck', default: null },
                spread: { value: '', placeholder: 'Select a Spread', default: null }
            }));
            preferences.saveChanges = false;
        }
    }, [appearanceData, appearanceLoading, getThemeDetails, preferences.defaultData]);

    useEffect(() => {
        const fetchDeckDetails = async () => {
            if (appearanceData.me.decks) {
                const deckIds = appearanceData.me.decks.map((deck) => deck._id);

                const deckDetailsArray = [];
                for (const deckId of deckIds) {
                    const { data } = await getDeckDetails({ variables: { deckId } });
                    if (data && data.deckDetails) {
                        const { deckName, deckId: value, ...rest } = data.deckDetails;
                        deckDetailsArray.push({ label: deckName, value, ...rest });
                    }
                }

                // Fetch default Deck Details
                if (preferences.defaultData.deck) {
                    const { data: defaultData } = await getDeckDetails({
                        variables: { deckId: preferences.defaultData.deck }
                    });
                    if (defaultData && defaultData.deckDetails) {
                        setSelectedValue((prev) => ({
                            ...prev,
                            deck: {
                                ...prev.deck,
                                default: defaultData.deckDetails
                            }
                        }));
                    }
                }
                setUserDecks(deckDetailsArray);
            }
        };

        if (!appearanceLoading && appearanceData?.me) {
            fetchDeckDetails();
        }
    }, [appearanceData, appearanceLoading, getDeckDetails, preferences.defaultData]);

    useEffect(() => {
        const fetchSpreadDetails = async () => {
            if (preferences.defaultData.spread) {
                const transformedSpreads = appearanceData.allSpreads.map((spread) => ({
                    value: spread._id,
                    label: spread.spreadName
                }));

                setUserSpreads(transformedSpreads);

                if (preferences.defaultData.spread) {
                    const { data } = await getSpreadDetails({
                        variables: { spreadId: preferences.defaultData.spread }
                    });
                    if (data && data.spreadDetails) {
                        setSelectedValue((prev) => ({
                            ...prev,
                            spread: {
                                ...prev.spread,
                                default: data.spreadDetails
                            }
                        }));
                    }
                }
            }
        };

        if (!appearanceLoading && appearanceData?.me) {
            fetchSpreadDetails();
        }
    }, [appearanceData, appearanceLoading, getSpreadDetails, preferences.defaultData]);

    return (
        <div>
            <div className='appearance'>
                <h2>Appearance</h2>
                <hr />
            </div>
            <div className='fields'>
                <div className='drop-menus'>
                    Current Theme: {selectedValue.theme.default ? selectedValue.theme.default.label : 'Loading...'}
                </div>
                <SelectorComponent
                    options={userThemes}
                    value={selectedValue.theme.value}
                    placeHolder={selectedValue.theme.placeholder}
                    onChange={(event) => handleSelectorChange('theme', event.target.value)}
                />
            </div>
            <div className='fields'>
                <div className='drop-menus'>
                    Current Deck: {selectedValue.deck.default ? selectedValue.deck.default.deckName : 'Loading...'}
                </div>
                <SelectorComponent
                    options={userDecks}
                    value={selectedValue.deck.value}
                    placeHolder={selectedValue.deck.placeholder}
                    onChange={(event) => handleSelectorChange('deck', event.target.value)}
                />
            </div>
            <div className='fields'>
                <div className='drop-menus'>
                    Current Spread:{' '}
                    {selectedValue.spread.default ? selectedValue.spread.default.spreadName : 'Loading...'}
                </div>
                <SelectorComponent
                    options={userSpreads}
                    value={selectedValue.spread.value}
                    placeHolder={selectedValue.spread.placeholder}
                    onChange={(event) => handleSelectorChange('spread', event.target.value)}
                />
            </div>
            <div className='fields'>
                <div className='fields-avatars'>Active Avatar:</div>
                <div>
                    <img
                        src={preferences.avatar.circleImageUrl}
                        alt='settings'
                        className='avatar-settings'
                        onClick={handleOpen}
                    />
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-title'
                aria-describedby='modal-modal-description'>
                <Fade in={open}>
                    <AvatarModal onClose={handleModalClose} />
                </Fade>
            </Modal>
        </div>
    );
};

export default Appearance;
