import { useState, useEffect, forwardRef, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import DashboardModal from './DashboardModal.jsx';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { useTheme } from '../Settings/ThemeContext';
import { useLazyQuery } from '@apollo/client';
import { QUERY_ALL_DECKS } from '../../utils/queries';

import './Dashboard.css';

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

const SliderComponent = ({ userInfo, type, deckInfo = null }) => {
    const [open, setOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        skeletonWidth: 75,
        skeletonHeight: 120,
        width: 75,
        height: 120,
        length: 3,
        defaultPerPage: 3,
        perPage: 3,
        arrows: false
    });
    const [total, setTotal] = useState({
        decks: 4,
        favoriteSpreads: 3,
        favoriteDecks: 4
    });
    const [plusArray, setPlusArray] = useState([]);
    const { theme } = useTheme();
    const [allDecks, { data: allDecksData }] = useLazyQuery(QUERY_ALL_DECKS);

    useEffect(() => {
        allDecks();
    }, [allDecks]);

    useEffect(() => {
        if (allDecksData?.allDecks) {
            setTotal((prev) => ({
                ...prev,
                decks: allDecksData.allDecks.length
            }));
        }
    }, [allDecksData]);

    // console.log(allDecksData.allDecks.length);

    useEffect(() => {
        // Check if userInfo contains data and if each object has an imageUrl property
        if (Object.values(userInfo)[0]?.imageUrl) {
            setLoading(false); // Set loading to false when data is ready
        }
    }, [userInfo]);

    const handleOpen = (slide) => {
        setSelectedSlide(slide);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();

    const handlePlusClick = (location) => {
        navigate(`/${location}`);
    };

    // Convert the userInfo object into an array of its values
    const slidesArray = Object.values(userInfo);

    useEffect(() => {
        if (type === 'Decks') {
            // setPlusArray([]); // Reset before adding new items
            if (slidesArray.length < total.decks) {
                const numDecksToShow = total.decks - slidesArray.length;

                let array = Array.from({ length: numDecksToShow }).map((_, idx) => (
                    <div key={`add-item-${idx}`}>
                        <div
                            className='addItem'
                            style={{ border: `3px solid ${theme.universalImageBorder}` }}
                            onClick={() => handlePlusClick('appShop')}>
                            <ShoppingCartIcon sx={{ width: '1.5em', height: '1.5em' }} />
                        </div>
                    </div>
                ));

                setPlusArray((prevArray) => [...prevArray, ...array]);
            }
        }
    }, [type, userInfo, deckInfo]);

    useEffect(() => {
        if (type === 'FavoriteDecks') {
            setPlusArray([]);
            if (slidesArray.length < total.favoriteSpreads) {
                const numDecksToShow = total.favoriteDecks - slidesArray.length;
                const numOfDecks = Object.keys(deckInfo).length;
                let availableDecks = 0;
                if (numOfDecks !== slidesArray.length) {
                    availableDecks = numDecksToShow - numOfDecks;
                }
                // Create an array of JSX elements
                let array = Array.from({ length: availableDecks }).map((_, idx) => (
                    <div>
                        <div
                            key={`add-item-${idx}`}
                            className='addItem'
                            style={{ border: `3px solid ${theme.universalImageBorder}` }}
                            onClick={() => {
                                handlePlusClick('browseDecks');
                            }}>
                            <AddIcon sx={{ width: '1.5em', height: '1.5em' }} />
                        </div>
                    </div>
                ));

                const purchaseLength = numDecksToShow - availableDecks;
                let purchaseArray = Array.from({ length: purchaseLength }).map((_, idx) => (
                    <div>
                        <div
                            key={`add-item-${idx}`}
                            className='addItem'
                            style={{ border: `3px solid ${theme.universalImageBorder}` }}
                            onClick={() => {
                                handlePlusClick('appShop');
                            }}>
                            <ShoppingCartIcon sx={{ width: '1.5em', height: '1.5em' }} />
                        </div>
                    </div>
                ));

                console.log('array', array);
                console.log('purchaseArray', purchaseArray);

                // Push the created array into plusArray
                setPlusArray((prevArray) => [...prevArray, ...array]);
                setPlusArray((prevArray) => [...prevArray, ...purchaseArray]);
            }
        }
    }, [type, userInfo, deckInfo]);

    useEffect(() => {
        if (type === 'Spreads') {
            setPlusArray([]);
            const numSpreadsToShow = total.favoriteSpreads - slidesArray.length;
            // Create an array of JSX elements
            let array = Array.from({ length: numSpreadsToShow }).map((_, idx) => (
                <div key={`add-item-${idx}`}>
                    <div
                        className='addItemSpread'
                        style={{ border: `3px solid ${theme.universalImageBorder}` }}
                        onClick={() => {
                            handlePlusClick('browseSpreads');
                        }}>
                        <AddIcon sx={{ width: '1.5em', height: '1.5em' }} />
                    </div>
                </div>
            ));

            // Push the created array into plusArray
            setPlusArray((prevArray) => [...prevArray, ...array]);
        }
    });

    useEffect(() => {
        if (type === 'Decks' || type === 'FavoriteDecks') {
            // setPlusArray([]);
            if (slidesArray.length > dimensions.defaultPerPage && type === 'Decks') {
                setDimensions((prev) => ({
                    ...prev,
                    arrows: true
                }));
            } else {
                setDimensions((prev) => ({
                    ...prev,
                    width: 75,
                    height: 120,
                    skeletonWidth: 275,
                    skeletonHeight: 250,
                    defaultPerPage: 4,
                    perPage: 4
                }));
            }
        } else {
            if (slidesArray.length > dimensions.defaultPerPage) {
                // setDimensions((prev) => ({
                //     ...prev,
                //     arrows: true
                // }));
            } else {
                setDimensions((prev) => ({
                    ...prev,
                    width: 175,
                    height: 120,
                    skeletonWidth: 275,
                    skeletonHeight: 175,
                    defaultPerPage: 3,
                    perPage: 3,
                    arrows: false
                }));
            }
        }
    }, [type, userInfo, deckInfo]);

    return (
        <>
            <Splide
                options={{
                    perPage: dimensions.perPage,
                    gap: '1rem',
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        640: {
                            perPage: 2,
                            gap: '.7rem',
                            height: '6rem'
                        },
                        480: {
                            perPage: 1,
                            gap: '.7rem',
                            height: '6rem'
                        }
                    }
                }}>
                {!loading &&
                    slidesArray.map((slide, index) => (
                        <SplideSlide key={index}>
                            {/* Render slide */}
                            <div onClick={() => handleOpen({ ...slide, type })}>
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.name}
                                    style={{
                                        cursor: 'pointer',
                                        width: dimensions.width,
                                        margin: 0,
                                        border: `3px solid ${theme.universalImageBorder}`,
                                        borderRadius: '5%'
                                    }}
                                />
                                <h3>{slide.name}</h3>
                            </div>
                        </SplideSlide>
                    ))}

                {/* Render additional plusArray slides */}
                {plusArray.map((item, idx) => (
                    <SplideSlide
                        key={`plus-slide-${idx}`}
                        style={{ display: 'flex', justifyContent: 'center' }}>
                        {item}
                    </SplideSlide>
                ))}
            </Splide>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-title'
                aria-describedby='modal-modal-description'>
                <Fade in={open}>
                    <DashboardModal
                        onClose={handleClose}
                        modalData={selectedSlide}
                    />
                </Fade>
            </Modal>
        </>
    );
};

export default SliderComponent;
