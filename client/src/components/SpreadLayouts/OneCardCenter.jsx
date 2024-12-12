import React from 'react';
import PropTypes from 'prop-types';
import './SpreadLayouts.css';
import { getCardRotation } from '../../utils/CardUtils';

const OneCardCenter = ({ spreadData, deckData, cardData, cardRefs }) => {
    if (!spreadData || !deckData) {
        return <div>Loading...</div>;
    }

    const { positions } = spreadData;
    const { imageUrl: deckBackImage } = deckData;

    return (
        <section>
            <div
                className='one-card-center-layout'
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                    textAlign: 'center'
                }}>
                {/* Display the question outside the flipping card */}
                <p>{positions[0]?.positionDetails}</p>

                {positions.map((pos, index) => {
                    const card = cardData[index];
                    const cardImageUrl = card?.card?.imageUrl;
                    const cardOrientation = card?.orientation;

                    return (
                        <div
                            key={index}
                            className='card-container'
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <div className={`card ${cardRefs.current[index] && card ? 'flipped' : ''}`}>
                                {/* Front: Deck Back Image */}
                                <div className='card-face front'>
                                    <img
                                        src={deckBackImage}
                                        alt={`Card ${pos.positionNumber}`}
                                        className='card-image'
                                        style={{ width: '200px', height: 'auto' }}
                                    />
                                </div>

                                {/* Back: Card Face (only visible after flipping) */}
                                {card && (
                                    <div className='card-face back'>
                                        <img
                                            src={cardImageUrl}
                                            alt={card.card.cardName}
                                            className='card-image'
                                            style={{
                                                width: '200px',
                                                height: 'auto',
                                                transform: getCardRotation(cardOrientation, deckData.deckName)
                                            }}
                                        />
                                        <p>
                                            {card.card.cardName} - {card.orientation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

OneCardCenter.propTypes = {
    spreadData: PropTypes.shape({
        positions: PropTypes.arrayOf(
            PropTypes.shape({
                positionNumber: PropTypes.number.isRequired,
                positionDetails: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    deckData: PropTypes.shape({
        imageUrl: PropTypes.string.isRequired,
        deckName: PropTypes.string.isRequired
    }).isRequired,
    cardData: PropTypes.array.isRequired,
    cardRefs: PropTypes.object.isRequired
};

export default OneCardCenter;
