import { useState, forwardRef, cloneElement, useEffect } from 'react';
import { Modal, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import { useTheme } from '../../pages/Settings/ThemeContext.jsx';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_SHOP_DATA } from '../../utils/queries';
import TemporaryDrawer from './CartDrawer.jsx';

import dummyData from './dummyData.json';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from '../../assets/Logos/Large/MainLogo.png';
import EOTS from '../../assets/CardBacks/eots_backs_01.jpg';
import Magician from '../../assets/01_The_Magician.jpg';
import ThemeOne from '../../assets/themeOne.png';
import BundleOne from '../../assets/BundleOne.png';
import './Shop.css';

import ShopModal from './ShopModal.jsx';
import { Avatars, Themes, Bundles, Test } from './ShopCategories.jsx';

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
    const { theme } = useTheme();

    const [open, setOpen] = useState(false);
    const [allShopInfo, { data: allShopData, loading: shopLoading }] = useLazyQuery(GET_ALL_SHOP_DATA);
    const [shopData, setShopData] = useState({ decks: {}, avatars: {}, themes: {}, bundles: {} });
    const [modalData, setModalData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        type: ''
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [carouselData] = useState({
        Deck: {
            type: 'deck',
            width: '131.25px',
            height: '210px',
            borderRadius: '5%',
            displayName: true,
            textName: 'dashboardImageText',
            total: 15
        },
        Avatar: {
            type: 'avatar',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            displayName: true,
            textName: 'avatarImageText',
            total: 12
        },
        Theme: {
            type: 'theme',
            width: '218.75px',
            height: '150px',
            borderRadius: '5%',
            displayName: false,
            total: 7,
            textName: 'avatarImageText'
        },
        Bundle: {
            type: 'bundle',
            width: '218.75px',
            height: '150px',
            borderRadius: '5%',
            displayName: false,
            total: 7,
            textName: 'avatarImageText'
        }
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
                }, {}),
                //   themes: allShopData.allThemes.reduce((acc, theme) => {
                //     acc[theme.themeId] = theme;
                //     return acc;
                //   }, {}),
                //   bundles: allShopData.allBundles.reduce((acc, bundle) => {
                //     acc[bundle.bundleId] = bundle;
                //     return acc;
                //   }, {}),
                themes: dummyData.themes,
                bundles: dummyData.bundles
            };
            setShopData(formattedData);
        }
    }, [allShopData, shopLoading]);

    console.log(shopData);

    const handleOpen = (data) => {
        const normalizeData = {
            name: data.deckName || data.avatarName || data.name,
            description: data.deckDescription || data.avatarDescription || data.description,
            imageUrl: data.imageUrl || data.circleImageUrl,
            type: data.__typename || data.type,
            id: data._id
        };
        setModalData(normalizeData);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddToCart = () => {
        setDrawerOpen(true); // Open drawer
        setOpen(false); // Close modal
    };

    return (
        <section className='shopContainer'>
            <div className='shopWrapper'>
                <div className='shopItems deckShop'>
                    <h2 className='headingShop'>Tarot Decks</h2>
                    <Test
                        itemInfo={shopData.decks}
                        sendModal={handleOpen}
                        theme={theme}
                        dimensions={carouselData.Deck}
                    />
                </div>
                <Divider
                    className='cart_divider'
                    sx={{ width: '95%', height: '1px', marginTop: '2rem' }}
                />
                <div className='shopItems avatarShop'>
                    <h2 className='headingShop'>Avatars</h2>
                    <Test
                        itemInfo={shopData.avatars}
                        sendModal={handleOpen}
                        theme={theme}
                        dimensions={carouselData.Avatar}
                    />
                </div>
                <Divider
                    className='cart_divider'
                    sx={{ width: '95%', height: '1px', marginTop: '2rem' }}
                />
                <div className='shopItems themeShop'>
                    <h2 className='headingShop'>Themes</h2>
                    <Test
                        itemInfo={shopData.themes}
                        sendModal={handleOpen}
                        theme={theme}
                        dimensions={carouselData.Theme}
                    />
                </div>
                <Divider
                    className='cart_divider'
                    sx={{ width: '95%', height: '1px', marginTop: '2rem' }}
                />
                <div className='shopItems themeShop'>
                    <h2 className='headingShop'>Bundles</h2>
                    <Test
                        itemInfo={shopData.bundles}
                        sendModal={handleOpen}
                        theme={theme}
                        dimensions={carouselData.Theme}
                    />
                </div>
                <Divider
                    className='cart_divider'
                    sx={{ width: '95%', height: '1px', marginTop: '2rem' }}
                />

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='modal-title'
                    aria-describedby='modal-modal-description'>
                    <Fade in={open}>
                        <ShopModal
                            onClose={handleClose}
                            modalData={modalData}
                            onAddToCart={handleAddToCart}
                        />
                    </Fade>
                </Modal>
                <TemporaryDrawer
                    open={drawerOpen}
                    setOpen={setDrawerOpen}
                    theme={theme}
                    dimensions={carouselData}
                />
            </div>
        </section>
    );
};

export default AppShop;
