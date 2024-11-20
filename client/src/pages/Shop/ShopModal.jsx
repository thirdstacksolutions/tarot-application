import { Card } from '@mui/material';
import { deckContainer, avatarContainer, themeAndBundleContainer } from './ModalContainerChoice';

import './Shop.css';

const ShopModal = ({ onClose, modalData }) => {
    const ContainerChoice = () => {
        if (modalData.type === 'Deck') {
            return deckContainer(modalData);
        } else if (modalData.type === 'Avatar') {
            return avatarContainer(modalData);
        } else if (modalData.type === 'Theme' || modalData.type === 'Bundle') {
            return themeAndBundleContainer(modalData);
        } else {
            return <div>Unknown Container</div>;
        }
    };

    return (
        <Card className='shop-modal-card'>
            <div className='shop-card-styling'>
                <div className='infoWrapper'>
                    <div className='modal-title'>
                        <h2 className='custom-underline'>{modalData.name}</h2>
                    </div>
                    <p className='shop-modal-description'>{modalData.description}</p>
                </div>

                <ContainerChoice />

                <div className='shopButtonContainer'>
                    <button
                        className='button'
                        sx={{ width: '150px' }}>
                        Add to Cart
                    </button>
                    <button
                        className='button-secondary'
                        onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ShopModal;
