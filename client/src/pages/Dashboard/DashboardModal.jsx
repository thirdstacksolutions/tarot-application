import { Card } from '@mui/material';
import Button from 'react-bootstrap/Button';
import { deckContainer, themeAndBundleContainer } from '../Shop/ModalContainerChoice';
import { useTheme } from '../Settings/ThemeContext';

import './Dashboard.css';

const DashboardModal = ({ onClose, modalData }) => {
    const { theme } = useTheme();

    const ContainerChoice = () => {
        if (modalData.type === 'Decks' || modalData.type === 'FavoriteDecks') {
            return deckContainer(modalData);
        } else if (modalData.type === 'Spreads') {
            return themeAndBundleContainer(modalData);
        } else {
            return <div>Unknown Container</div>;
        }
    };

    return (
        <Card
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                bgcolor: theme.backgroundColor,
                border: `3px solid ${theme.universalImageBorder}`,
                borderRadius: '8px',
                boxShadow: 24,
                p: 0,
                height: '60%',
                aspectRatio: '8/9',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
            <div className='infoWrapper'>
                <div className='modal-title'>
                    <h1 className='custom-underline'>{modalData.name}</h1>
                </div>
                {/* <div className='subTitle'>
                    <h2 className='custom-underline'>Deck Details</h2>
                </div> */}
                <p className='modal-description'>{modalData.description}</p>
            </div>

            <ContainerChoice />

            <div className='shopButtonContainer'>
                <Button
                    className='button'
                    onClick={onClose}>
                    Close
                </Button>
            </div>
        </Card>
    );
};

export default DashboardModal;
