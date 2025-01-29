import { useState, forwardRef, cloneElement, useEffect } from 'react';
import { Modal } from '@mui/material';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import '../../components/BaseModal/BaseModal';
import { useTheme } from '../Settings/ThemeContext';
import { useLazyQuery } from '@apollo/client';
import { QUERY_ALL_SPREADS } from '../../utils/queries';

import './BrowseSpreads.css';

import SpreadModal from './SpreadModal';

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

const BrowseSpreads = () => {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    const [allSpreads, { data: allSpreadsData }] = useLazyQuery(QUERY_ALL_SPREADS);

    const [spreadInfo, setSpreadInfo] = useState({});
    const [modalData, setModalData] = useState({
        spreadName: '',
        spreadDescription: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (allSpreadsData) {
            const formattedSpreads = allSpreadsData.allSpreads.reduce((acc, spread) => {
                const formattedSpreadName = spread.spreadName.replace(/ /g, '_');
                acc[formattedSpreadName] = {
                    spreadName: spread.spreadName,
                    spreadDescription: spread.spreadDescription,
                    imageUrl: spread.imageUrl
                };
                return acc;
            }, {});

            setSpreadInfo(formattedSpreads);
        }
    }, [allSpreadsData]);

    useEffect(() => {
        allSpreads();
    }, [allSpreads]);

    const handleOpen = (spread) => {
        setModalData(spread);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const SpreadsMap = () => {
        const totalSpreads = 3;
        const spreadIds = Object.keys(spreadInfo);
        const numSpreadsToShow = Math.min(spreadIds.length, totalSpreads);

        return (
            <div className='spreadContainer'>
                {spreadIds.slice(0, numSpreadsToShow).map((spreadId) => (
                    <div
                        className='imageWrapper'
                        key={spreadId}>
                        <img
                            className='spreadImgs'
                            src={spreadInfo[spreadId].imageUrl}
                            alt={spreadInfo[spreadId].spreadName}
                            style={{
                                border: `3px solid ${theme.universalImageBorder}`
                            }}
                            onClick={() =>
                                handleOpen({
                                    spreadName: spreadInfo[spreadId].spreadName,
                                    spreadDescription: spreadInfo[spreadId].spreadDescription,
                                    imageUrl: spreadInfo[spreadId].imageUrl
                                })
                            }
                        />
                        <p className='imageText'>{spreadInfo[spreadId].spreadName}</p>
                    </div>
                ))}
            </div>
        );
    };

    console.log(spreadInfo);

    const FeaturedSpread = () => {
        if (!spreadInfo.Daily_Focus) {
            return <div>Loading...</div>;
        } else {
            return (
                <img
                    className='featuredSpreadImg'
                    alt={spreadInfo.Daily_Focus.spreadName}
                    src={spreadInfo.Daily_Focus.imageUrl}
                    style={{
                        border: `1px solid ${theme.universalImageBorder}`
                    }}
                    onClick={() =>
                        handleOpen({
                            spreadName: spreadInfo.Daily_Focus.spreadName,
                            spreadDescription: spreadInfo.Daily_Focus.spreadDescription,
                            imageUrl: spreadInfo.Daily_Focus.imageUrl
                        })
                    }
                />
            );
        }
    };

    return (
        <section className='itemsWrapper'>
            <div className='topSection'>
                <div className='spreadLeftSide'>
                    <div className='leftSideInsideContainer'>
                        <h2 className='items-title'>Spreads and Readings</h2>
                        <hr className='hr-store' />
                        <h3 className='description'>
                            Gain tailored insights from focused spreads, finding deeper connections and meaning with
                            every reading.
                        </h3>
                    </div>
                </div>
                <div className='spreadRightSide'>
                    <h3 className='featuredSpreadTitle'>Featured Spread: Daily Focus</h3>
                    <FeaturedSpread />
                </div>
            </div>
            <div className='bottomSection'>
                <SpreadsMap />
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-title'
                aria-describedby='modal-description'>
                <Fade in={open}>
                    <SpreadModal
                        onClose={handleClose}
                        spreadName={modalData.spreadName}
                        spreadDescription={modalData.spreadDescription}
                        imageUrl={modalData.imageUrl}
                    />
                </Fade>
            </Modal>
        </section>
    );
};

export default BrowseSpreads;
