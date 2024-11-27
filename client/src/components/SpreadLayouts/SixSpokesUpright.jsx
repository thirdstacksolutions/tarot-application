import PropTypes from 'prop-types';
import './SpreadLayouts.css';
import { getCardRotation } from '../../utils/CardUtils';

const SixSpokesUpright = ({ spreadData, deckData, cardData, cardRefs }) => {
    if (!spreadData || !deckData) {
        return <div>Loading...</div>;
    }

    const { imageUrl: deckBackImage, deckName } = deckData;

    const getCardForPosition = (positionNumber) => cardData.find((card) => card.position === positionNumber);

    return (
        <section>
            <div className='six-spokes-upright-layout'>
                {/* Column 1 (Positions 5 and 4) */}
                <div className='column-1'>
                    {[5, 4].map((position) => {
                        const card = getCardForPosition(position);
                        return (
                            <div
                                key={position}
                                className='card-container position-details'>
                                <p className='position-details'>
                                    {
                                        spreadData.positions.find((pos) => pos.positionNumber === position)
                                            .positionDetails
                                    }
                                </p>
                                <div className={`card ${cardRefs.current[position - 1] ? 'flipped' : ''}`}>
                                    <div className='card-face front'>
                                        <img
                                            src={deckBackImage}
                                            alt='Card Back'
                                            className='card-image'
                                        />
                                    </div>
                                    {card && (
                                        <div className='card-face back'>
                                            <img
                                                src={card.card.imageUrl}
                                                alt={card.card.cardName}
                                                className='card-image'
                                                style={{
                                                    transform: getCardRotation(card.orientation, deckName)
                                                }}
                                            />
                                            <p className='card-name'>
                                                {card.card.cardName} - {card.orientation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Column 2 (Positions 6 and 3) */}
                <div className='column-2'>
                    {[6, 3].map((position) => {
                        const card = getCardForPosition(position);
                        return (
                            <div
                                key={position}
                                className='card-container position-details'>
                                <p className='position-details'>
                                    {
                                        spreadData.positions.find((pos) => pos.positionNumber === position)
                                            .positionDetails
                                    }
                                </p>
                                <div className={`card ${cardRefs.current[position - 1] ? 'flipped' : ''}`}>
                                    <div className='card-face front'>
                                        <img
                                            src={deckBackImage}
                                            alt='Card Back'
                                            className='card-image'
                                        />
                                    </div>
                                    {card && (
                                        <div className='card-face back'>
                                            <img
                                                src={card.card.imageUrl}
                                                alt={card.card.cardName}
                                                className='card-image'
                                                style={{
                                                    transform: getCardRotation(card.orientation, deckName)
                                                }}
                                            />
                                            <p className='card-name'>
                                                {card.card.cardName} - {card.orientation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Column 3 (Positions 1 and 2) */}
                <div className='column-3'>
                    {[1, 2].map((position) => {
                        const card = getCardForPosition(position);
                        return (
                            <div
                                key={position}
                                className='card-container position-details'>
                                <p className='position-details'>
                                    {
                                        spreadData.positions.find((pos) => pos.positionNumber === position)
                                            .positionDetails
                                    }
                                </p>
                                <div className={`card ${cardRefs.current[position - 1] ? 'flipped' : ''}`}>
                                    <div className='card-face front'>
                                        <img
                                            src={deckBackImage}
                                            alt='Card Back'
                                            className='card-image'
                                        />
                                    </div>
                                    {card && (
                                        <div className='card-face back'>
                                            <img
                                                src={card.card.imageUrl}
                                                alt={card.card.cardName}
                                                className='card-image'
                                                style={{
                                                    transform: getCardRotation(card.orientation, deckName)
                                                }}
                                            />
                                            <p className='card-name'>
                                                {card.card.cardName} - {card.orientation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

SixSpokesUpright.propTypes = {
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
        deckName: PropTypes.string.isRequired // Add deckName for the utility function
    }).isRequired,
    cardData: PropTypes.arrayOf(
        PropTypes.shape({
            position: PropTypes.number.isRequired,
            orientation: PropTypes.string.isRequired,
            card: PropTypes.shape({
                cardName: PropTypes.string.isRequired,
                imageUrl: PropTypes.string.isRequired
            }).isRequired
        })
    ).isRequired,
    cardRefs: PropTypes.object.isRequired
};

export default SixSpokesUpright;
