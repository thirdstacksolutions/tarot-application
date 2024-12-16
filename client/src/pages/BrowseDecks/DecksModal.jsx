import { Card } from '@mui/material';
import { useTheme } from '../Settings/ThemeContext';
import Button from 'react-bootstrap/Button';

import './BrowseDecks.css';

const DecksModal = ({ onClose, deckName, deckDescription, imageUrl }) => {
    const theme = useTheme();

    return (
        <Card className='decks-modal-card'>
            <div className='decks-card-styling'>
                <div className='infoWrapper'>
                    <div className='modal-title'>
                        <h2 className='custom-underline'>{deckName}</h2>
                    </div>
                    <p className='modal-description'>{deckDescription}</p>
                </div>
                <div className='deckModalImgContainer'>
                    <img
                        className='deckModalImg'
                        alt='image1'
                        src={imageUrl}
                    />
                    <img
                        className='deckModalImg middleImg'
                        alt='image2'
                        src={imageUrl}
                    />
                    <img
                        className='deckModalImg'
                        alt='image3'
                        src={imageUrl}
                    />
                </div>
                <Button
                    className='button'
                    onClick={onClose}>
                    Close
                </Button>
            </div>
        </Card>
    );
};

export default DecksModal;
