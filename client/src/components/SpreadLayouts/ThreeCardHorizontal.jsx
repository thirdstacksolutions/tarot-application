import React from 'react';
import PropTypes from 'prop-types';
import './SpreadLayouts.css';
import { getCardRotation } from '../../utils/CardUtils';

const ThreeCardHorizontal = ({ spreadData, deckData, cardData, cardRefs }) => {
    if (!spreadData || !deckData) {
        return <div>Loading...</div>;
    }

    const { imageUrl: deckBackImage } = deckData;

    return (
        <section>
            <div
                className='three-card-horizontal-layout'
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {spreadData.positions.map((pos, index) => {
                    const card = cardData.find((c) => c.position === pos.positionNumber);
                    const cardImageUrl = card?.card?.imageUrl;
                    const cardOrientation = card?.orientation;

                    return (
                        <div
                            key={index}
                            className='card-container'>
                            <p className='position-details'>{pos.positionDetails}</p>
                            <div className={`card ${cardRefs.current[index] && card ? 'flipped' : ''}`}>
                                <div className='card-face front'>
                                    <img
                                        src={deckBackImage}
                                        alt={`Card ${pos.positionNumber}`}
                                        className='card-image'
                                        style={{ width: '200px', height: 'auto' }}
                                    />
                                </div>
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
        imageUrl: PropTypes.string.isRequired,
        deckName: PropTypes.string.isRequired
    }).isRequired,
    cardData: PropTypes.array.isRequired,
    cardRefs: PropTypes.object.isRequired
};

export default ThreeCardHorizontal;
