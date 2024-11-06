import PropTypes from 'prop-types';
import './sixSpokesUpright.css';

const SixSpokesUpright = ({ spreadData, deckData, cardData, cardRefs }) => {
    if (!spreadData || !deckData) {
        return <div>Loading...</div>;
    }

    const { imageUrl: deckBackImage } = deckData;

    const getCardForPosition = (positionNumber) => cardData.find((card) => card.position === positionNumber);

    return (
        <section>
            <div className='six-spokes-upright-layout'>
                {/* Column 1 (Positions 5 and 4) */}
                <div className='column-1'>
                    {/* Position 5 */}
                    <div className='position-5'>
                        {(() => {
                            const card = getCardForPosition(5);
                            return cardRefs.current[4] && card ? (
                                <div>
                                    <p>{card.card.cardName}</p>
                                    <img
                                        src={card.card.imageUrl}
                                        alt={card.card.cardName}
                                        className='card-image'
                                        style={{
                                            transform: card.orientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 5).positionDetails}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt='Card Back'
                                        className='card-image'
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 5).positionDetails}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Position 4 */}
                    <div className='position-4'>
                        {(() => {
                            const card = getCardForPosition(4);
                            return cardRefs.current[3] && card ? (
                                <div>
                                    <p>{card.card.cardName}</p>
                                    <img
                                        src={card.card.imageUrl}
                                        alt={card.card.cardName}
                                        className='card-image'
                                        style={{
                                            transform: card.orientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 4).positionDetails}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt='Card Back'
                                        className='card-image'
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 4).positionDetails}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* Column 2 (Positions 6 and 3) */}
                <div className='column-2'>
                    {/* Position 6 */}
                    <div className='position-6'>
                        {(() => {
                            const card = getCardForPosition(6);
                            return cardRefs.current[5] && card ? (
                                <div>
                                    <p>{card.card.cardName}</p>
                                    <img
                                        src={card.card.imageUrl}
                                        alt={card.card.cardName}
                                        className='card-image'
                                        style={{
                                            transform: card.orientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 6).positionDetails}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt='Card Back'
                                        className='card-image'
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 6).positionDetails}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Position 3 */}
                    <div className='position-3'>
                        {(() => {
                            const card = getCardForPosition(3);
                            return cardRefs.current[2] && card ? (
                                <div>
                                    <p>{card.card.cardName}</p>
                                    <img
                                        src={card.card.imageUrl}
                                        alt={card.card.cardName}
                                        className='card-image'
                                        style={{
                                            transform: card.orientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 3).positionDetails}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt='Card Back'
                                        className='card-image'
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 3).positionDetails}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* Column 3 (Positions 1 and 2) */}
                <div className='column-3'>
                    {/* Position 1 */}
                    <div className='position-1'>
                        {(() => {
                            const card = getCardForPosition(1);
                            return cardRefs.current[0] && card ? (
                                <div>
                                    <p>{card.card.cardName}</p>
                                    <img
                                        src={card.card.imageUrl}
                                        alt={card.card.cardName}
                                        className='card-image'
                                        style={{
                                            transform: card.orientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 1).positionDetails}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt='Card Back'
                                        className='card-image'
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 1).positionDetails}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Position 2 */}
                    <div className='position-2'>
                        {(() => {
                            const card = getCardForPosition(2);
                            return cardRefs.current[1] && card ? (
                                <div>
                                    <p>{card.card.cardName}</p>
                                    <img
                                        src={card.card.imageUrl}
                                        alt={card.card.cardName}
                                        className='card-image'
                                        style={{
                                            transform: card.orientation === 'Reversed' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 2).positionDetails}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={deckBackImage}
                                        alt='Card Back'
                                        className='card-image'
                                    />
                                    <p>
                                        {spreadData.positions.find((pos) => pos.positionNumber === 2).positionDetails}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
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
        imageUrl: PropTypes.string.isRequired
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
