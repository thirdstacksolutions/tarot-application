import { Card } from '@mui/material';
import { useState } from 'react';
import { deckContainer, avatarContainer, themeAndBundleContainer } from './ModalContainerChoice';
import { addToCart } from '../../utils/cartUtils.js';
import './Shop.css';

const ShopModal = ({ onClose, modalData, onAddToCart }) => {
    const price = '10';

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

    // Add item to cart and open the drawer
    const addToCartHandler = () => {
        addToCart(modalData.id, modalData.type, modalData.imageUrl, price, modalData.name, modalData.description);
        onAddToCart(); // Close the modal and open the drawer
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
                        sx={{ width: '150px' }}
                        onClick={addToCartHandler}>
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
