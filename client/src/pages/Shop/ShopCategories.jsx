import { Box } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

export const Test = ({ itemInfo, sendModal, theme, dimensions }) => {
    const totalItems = dimensions.total;
    const ItemIds = Object.keys(itemInfo);
    const numItemsToShow = Math.min(ItemIds.length, totalItems);
    const numComingSoon = totalItems - numItemsToShow;

    const slidesArray = Object.values(itemInfo);

    const commingSoonArray = Array.from({ length: numComingSoon }).map((_, idx) => (
        <div key={`coming-soon-${idx}`}>
            <Box
                sx={{
                    width: dimensions.width,
                    height: dimensions.height,
                    margin: 0,
                    border: `3px solid ${theme.universalImageBorder}`,
                    borderRadius: dimensions.borderRadius
                }}>
                <h2 className='comingSoonTitle'>COMING SOON</h2>
            </Box>
        </div>
    ));

    return (
        <>
            <Splide
                options={{
                    fixedWidth: dimensions.width,
                    // autoWidth: true,
                    // perpage: 3,
                    wheel: true,
                    releaseWheel: true,
                    width: '100%',
                    gap: '3rem',
                    rewind: true,
                    arrows: true,
                    pagination: false,
                    padding: '3rem',
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
                }}
                className='shopSplide'>
                {slidesArray.map((slide, idx) => (
                    <SplideSlide key={idx}>
                        <div
                            onClick={() => sendModal(slide)}
                            className='itemWrapper'>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    margin: 0,
                                    position: 'relative',
                                    // overflow: 'hidden',
                                    border: `3px solid ${theme.universalImageBorder}`,
                                    borderRadius: dimensions.borderRadius,
                                    backgroundImage: `url(${slide.imageUrl || slide.circleImageUrl})`,
                                    backgroundSize: 'cover', // Ensure the image covers the entire box
                                    backgroundPosition: 'center', // Center the image
                                    backgroundRepeat: 'no-repeat', // Prevent tiling
                                    transition: 'border-color 0.3s ease', // Smooth transition for hover effect
                                    '&:hover': {
                                        borderColor: theme.buttonSecondaryColor // Change border color on hover
                                    }
                                }}>
                                {dimensions.type === 'deck' && (
                                    <p
                                        className={dimensions.textName}
                                        style={{ width: '131.25px' }}>
                                        {slide.deckName}
                                    </p>
                                )}
                            </Box>
                            {dimensions.type === 'avatar' && (
                                <p
                                    className={dimensions.textName}
                                    style={{ width: '131.25px' }}>
                                    {slide.avatarName}
                                </p>
                            )}
                            {dimensions.type === 'theme' && <p className={dimensions.textName}>{slide.name}</p>}
                        </div>
                    </SplideSlide>
                ))}

                {commingSoonArray.map((item, idx) => (
                    <SplideSlide
                        key={`comingSoon-slide-${idx}`}
                        style={{ display: 'flex', justifyContent: 'center', width: 'fit-content' }}>
                        {item}
                    </SplideSlide>
                ))}
            </Splide>
        </>
    );
};

export const Avatars = ({ avatarInfo, sendModal }) => {
    const totalAvatars = 7;
    const avatarIds = Object.keys(avatarInfo);
    const numAvatarsToShow = Math.min(avatarIds.length, totalAvatars);
    const numComingSoon = totalAvatars - numAvatarsToShow;

    return (
        <div className='avatarContainer'>
            {avatarIds.slice(0, numAvatarsToShow).map((avatarId) => (
                <div
                    className='avatarShopWrapper'
                    key={avatarId}
                    onClick={() => sendModal(avatarInfo[avatarId])}>
                    <img
                        className='avatarShopImgs'
                        src={avatarInfo[avatarId].circleImageUrl}
                        alt={avatarInfo[avatarId].avatarName}
                    />
                </div>
            ))}

            {Array.from({ length: numComingSoon }).map((_, idx) => (
                <div
                    key={`coming-soon-${idx}`}
                    className='avatarShopWrapper avatarComingSoon'>
                    <h2 className='comingSoonTitle'>COMING SOON</h2>
                </div>
            ))}
        </div>
    );
};

export const Themes = ({ imgUrl, sendModal }) => {
    const length = 3;
    const themeData = {
        type: 'Theme',
        name: 'Spooky',
        description:
            'This theme is designed to help you navigate the complexities of the tarot and explore your innermost desires and fears.',
        imageUrl: imgUrl
    };

    return (
        <div className='themesContainer'>
            {Array.from({ length: length }).map((_, idx) => (
                <div
                    className='themesShopWrapper'
                    key={idx}
                    onClick={() => sendModal(themeData)}>
                    <img
                        className='themesShopImgs'
                        src={imgUrl}
                        alt='Theme One'
                    />
                </div>
            ))}
        </div>
    );
};

export const Bundles = ({ imgUrl, sendModal }) => {
    const length = 2;
    const bundleData = {
        type: 'Bundle',
        name: 'Spooky Bundle',
        description:
            'This bundle is designed to help you navigate the complexities of the tarot and explore your innermost desires and fears.',
        imageUrl: imgUrl
    };

    return (
        <div className='bundleContainer'>
            {Array.from({ length: length }).map((_, idx) => (
                <div
                    className='bundleShopWrapper'
                    key={idx}
                    onClick={() => sendModal(bundleData)}>
                    <img
                        className='bundleShopImgs'
                        src={imgUrl}
                        alt='Bundle One'
                    />
                </div>
            ))}
        </div>
    );
};
