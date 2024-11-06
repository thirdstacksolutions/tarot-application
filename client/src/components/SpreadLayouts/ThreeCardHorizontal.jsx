import PropTypes from 'prop-types';

const ThreeCardHorizontal = ({ spreadData, deckData, cardData, cardRefs }) => {
    if (!spreadData || !deckData) {
        return <div>Loading...</div>;
    }

    const { positions } = spreadData;
    const { imageUrl: deckBackImage } = deckData;

    return (
        <section>
            <div
                className='three-card-horizontal-layout'
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {positions.map((pos, index) => {
                    const card = cardData[index];
                    const cardImageUrl = card?.card?.imageUrl;
                    const cardOrientation = card?.orientation;

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            {cardRefs.current[index] && card ? (
                                <div>
                                    <p>
                                        {card.card.cardName} - {card.orientation}
                                    </p>
                                    <img
                                        src={cardImageUrl}
                                        alt={card.card.cardName}
                                        style={{
                                            width: '200px',
                                            height: 'auto',
                                            transform: cardOrientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>{pos.positionDetails}</p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt={`Card ${pos.positionNumber}`}
                                        style={{ width: '200px', height: 'auto' }}
                                    />
                                    <p>{pos.positionDetails}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

ThreeCardHorizontal.propTypes = {
    spreadData: PropTypes.shape({
        positions: PropTypes.arrayOf(
            PropTypes.shape({
                positionNumber: PropTypes.number.isRequired,
                positionDetails: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    deckData: PropTypes.shape({
        imageUrl: PropTypes.string.isRequired
    }).isRequired,
    cardData: PropTypes.array.isRequired,
    cardRefs: PropTypes.object.isRequired
};

export default ThreeCardHorizontal;
