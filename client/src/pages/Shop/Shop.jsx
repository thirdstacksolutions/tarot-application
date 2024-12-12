import { useState, forwardRef, cloneElement, useEffect } from 'react';
import { Modal } from '@mui/material';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import { useTheme } from '../../pages/Settings/ThemeContext.jsx';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_SHOP_DATA } from '../../utils/queries';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from '../../assets/Logos/Large/MainLogo.png';
import EOTS from '../../assets/CardBacks/eots_backs_01.jpg';
import Magician from '../../assets/01_The_Magician.jpg';
import ThemeOne from '../../assets/themeOne.png';
import BundleOne from '../../assets/BundleOne.png';
import './Shop.css';

import ShopModal from './ShopModal.jsx';
import { Decks, Avatars, Themes, Bundles } from './ShopCategories.jsx';

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

const AppShop = () => {
    const [open, setOpen] = useState(false);
    const [allShopInfo, { data: allShopData, loading: shopLoading }] = useLazyQuery(GET_ALL_SHOP_DATA);

    const [shopData, setShopData] = useState({ decks: {}, avatars: {}, themes: {}, bundles: {} });

    const { theme } = useTheme();

    const [modalData, setModalData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        type: ''
    });

    useEffect(() => {
        allShopInfo();
    }, [allShopInfo]);

    useEffect(() => {
        if (allShopData) {
            const formattedData = {
                decks: allShopData.allDecks.reduce((acc, deck) => {
                    acc[deck.deckId] = deck;
                    return acc;
                }, {}),
                avatars: allShopData.allAvatars.reduce((acc, avatar) => {
                    const formattedSpreadName = avatar.avatarName.replace(/ /g, '_');
                    acc[formattedSpreadName] = avatar;
                    return acc;
                }, {})
                //   themes: allShopData.allThemes.reduce((acc, theme) => {
                //     acc[theme.themeId] = theme;
                //     return acc;
                //   }, {}),
                //   bundles: allShopData.allBundles.reduce((acc, bundle) => {
                //     acc[bundle.bundleId] = bundle;
                //     return acc;
                //   }, {}),
            };
            setShopData(formattedData);
        }
    }, [allShopData, shopLoading]);

    const handleOpen = (data) => {
        const normalizeData = {
            name: data.deckName || data.avatarName || data.name,
            description: data.deckDescription || data.avatarDescription || data.description,
            imageUrl: data.imageUrl || data.circleImageUrl,
            type: data.__typename || data.type
        };
        setModalData(normalizeData);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <section className='shopContainer'>
            <div className='shopWrapper'>
                <div className='shopItems deckShop'>
                    <h2 className='headingShop'>Most Popular Tarot Decks</h2>
                    <Decks
                        deckInfo={shopData.decks}
                        sendModal={handleOpen}
                    />
                </div>
                <div className='shopItems avatarShop'>
                    <h2 className='headingShop'>Avatars for You</h2>
                    <Avatars
                        avatarInfo={shopData.avatars}
                        sendModal={handleOpen}
                    />
                </div>
                <div className='shopItems themeShop'>
                    <h2 className='headingShop'>Carefully Crafted Themes</h2>
                    <Themes
                        imgUrl={ThemeOne}
                        sendModal={handleOpen}
                    />
                </div>
                <div className='shopItems bundleShop'>
                    <h2 className='headingShop'>Bundles</h2>
                    <Bundles
                        imgUrl={BundleOne}
                        sendModal={handleOpen}
                    />
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='modal-title'
                    aria-describedby='modal-modal-description'>
                    <Fade in={open}>
                        <ShopModal
                            onClose={handleClose}
                            modalData={modalData}
                        />
                    </Fade>
                </Modal>
            </div>
        </section>
    );
};

export default AppShop;
