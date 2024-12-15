import { Link } from 'react-router-dom';
import { useTheme } from '../../pages/Settings/ThemeContext';
import { useContext } from 'react';
import { CookieSettingsContext } from '../../pages/Settings/SettingsRight/CookiesSettings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const ShopHeader = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { preferences } = useContext(CookieSettingsContext);

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
                padding: '.5rem 1rem',
                // position: 'fixed',
                top: '0',
                width: '100%',
                zIndex: 1000,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                backgroundImage: `url(${theme.headerImage})`,
                backgroundSize: 'cover'
            }}>
            <div>
                <Link to='/'>
                    <img
                        src={theme.logo}
                        alt='Tarot Deck Logo'
                        style={{
                            width: '75px',
                            height: '75px',
                            borderRadius: '50%',
                            border: `4px solid ${theme.avatarSettingsBorder}`
                        }}
                    />{' '}
                </Link>
            </div>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    '&:hover': {
                        color: theme.buttonSecondaryColor // Change border color on hover
                    }
                }}
                onClick={() => navigate('/cart')}
                className='cart_link'>
                <span style={{ marginRight: '10px', color: theme.h3Color, textShadow: theme.h2TextShadow }}>Cart</span>
                <ShoppingCartIcon style={{ fontSize: '2rem', color: theme.h3Color }} />
            </Box>
        </header>
    );
};

export default ShopHeader;
