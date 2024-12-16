import { Card } from '@mui/material';
import { useTheme } from '../Settings/ThemeContext';
import Button from 'react-bootstrap/Button';
import './BrowseSpreads.css';

const SpreadModal = ({ onClose, spreadName, spreadDescription, imageUrl }) => {
    const theme = useTheme();

    return (
        <Card className='spreads-modal-card'>
            <div className='card-styling'>
                <div className='infoWrapper'>
                    <div className='modal-title'>
                        <h2 className='custom-underline'>{spreadName}</h2>
                    </div>
                    {/* <div className='subTitle'>
                        <h2 className='custom-underline'>Daily Draw</h2>
                    </div> */}
                    <p className='modal-description'>{spreadDescription}</p>
                </div>
                <img
                    className='modalImg'
                    src={imageUrl}
                    alt={spreadName}
                />

                <Button
                    className='button'
                    onClick={onClose}>
                    Close
                </Button>
            </div>
        </Card>
    );
};

export default SpreadModal;
