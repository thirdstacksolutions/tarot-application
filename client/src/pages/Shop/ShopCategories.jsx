export const Decks = ({ deckInfo, sendModal }) => {
    const totalDecks = 7;
    const deckIds = Object.keys(deckInfo);
    const numDecksToShow = Math.min(deckIds.length, totalDecks);
    const numComingSoon = totalDecks - numDecksToShow;

    return (
        <div className='deckShopContainer'>
            {deckIds.slice(0, numDecksToShow).map((deckId) => (
                <div
                    className='deckShopWrapper'
                    key={deckId}
                    onClick={() => sendModal(deckInfo[deckId])}>
                    <img
                        className='deckShopImgs'
                        src={deckInfo[deckId].imageUrl}
                        alt={deckInfo[deckId].deckName}
                    />
                    <p className='imageShopText'>{deckInfo[deckId].deckName}</p>
                </div>
            ))}

            {Array.from({ length: numComingSoon }).map((_, idx) => (
                <div
                    key={`coming-soon-${idx}`}
                    className='deckShopWrapper comingSoon'>
                    <h2 className='comingSoonTitle'>COMING SOON</h2>
                </div>
            ))}
        </div>
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
