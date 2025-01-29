import { Card } from '@mui/material';
import { useTheme } from '../Settings/ThemeContext';
import './BrowseSpreads.css';

const SpreadModal = ({ onClose, spreadName, spreadDescription, imageUrl }) => {
    const theme = useTheme();

    return (
        <Card className='base-modal-card'>
            <div className='base-card-styling'>
                <div className='infoWrapper'>
                    <div className='modal-title'>
                        <h2 className='custom-underline'>{spreadName}</h2>
                    </div>
                    <p className='modal-description'>{spreadDescription}</p>
                </div>
                <div className='spreadModalImgContainer'>
                    <img
                        className='spreadModalImg'
                        src={imageUrl}
                        alt={spreadName}
                    />
                </div>
                <button
                    className='button'
                    onClick={onClose}>
                    Close
                </button>
            </div>
        </Card>
    );
};

export default SpreadModal;
