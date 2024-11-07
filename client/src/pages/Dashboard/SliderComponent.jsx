import { useState, useEffect, forwardRef, cloneElement } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import DashboardModal from './DashboardModal.jsx';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

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

const SliderComponent = ({ userInfo, type }) => {
    const [open, setOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        skeletonWidth: 75,
        skeletonHeight: 125,
        width: 75,
        height: 125,
        length: 3,
        defaultPerPage: 3,
        perPage: 3,
        arrows: false
    });

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

    // Convert the userInfo object into an array of its values
    const slidesArray = Object.values(userInfo);

    useEffect(() => {
        if (type === 'Decks' || type === 'FavoriteDecks') {
            if (slidesArray.length < dimensions.defaultPerPage) {
                setDimensions((prev) => ({
                    ...prev,
                    perPage: slidesArray.length
                }));
            } else if (slidesArray.length > dimensions.defaultPerPage && type === 'Decks') {
                setDimensions((prev) => ({
                    ...prev,
                    arrows: true
                }));
            } else {
                setDimensions((prev) => ({
                    ...prev,
                    width: 75,
                    height: 125,
                    skeletonWidth: 275,
                    skeletonHeight: 250,
                    defaultPerPage: 4,
                    perPage: 4
                }));
            }
        } else {
            if (slidesArray.length < dimensions.defaultPerPage) {
                setDimensions((prev) => ({
                    ...prev,
                    perPage: slidesArray.length
                }));
            } else if (slidesArray.length > dimensions.defaultPerPage) {
                // setDimensions((prev) => ({
                //     ...prev,
                //     arrows: true
                // }));
            } else {
                setDimensions((prev) => ({
                    ...prev,
                    width: 125,
                    height: 120,
                    skeletonWidth: 275,
                    skeletonHeight: 175,
                    defaultPerPage: 3,
                    perPage: 3,
                    arrows: false
                }));
            }
        }
    }, [type, userInfo]);

    return (
        <>
            <Splide
                options={{
                    perPage: dimensions.perPage,
                    gap: '1rem',
                    arrows: dimensions.arrows,
                    pagination: false,
                    paginationDirection: 'rtl',
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
                {loading
                    ? // Show Skeletons while loading
                      Array.from({ length: dimensions.length }).map((_, index) => (
                          <SplideSlide
                              key={index}
                              style={{ display: 'flex', justifyContent: 'center' }}>
                              <Skeleton
                                  sx={{ bgcolor: 'grey.700', margin: '0', borderRadius: '5%' }}
                                  variant='rectangular'
                                  width={dimensions.width}
                                  height={dimensions.height}
                              />
                          </SplideSlide>
                      ))
                    : slidesArray.map((slide, index) => (
                          <SplideSlide key={index}>
                              <div onClick={() => handleOpen({ ...slide, type })}>
                                  <img
                                      src={slide.imageUrl}
                                      alt={slide.name}
                                      style={{ cursor: 'pointer', width: dimensions.width }}
                                  />
                                  <h3>{slide.name}</h3>
                              </div>
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
