import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { useTheme } from '../../pages/Settings/ThemeContext';
import settingsPicture from '../../assets/08_Strength.jpg';
import { CookieSettingsContext } from '../../pages/Settings/SettingsRight/CookiesSettings';
const LargeHeader = () => {
    const { theme } = useTheme();

    const { preferences } = useContext(CookieSettingsContext);

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
                padding: '.3rem'
            }}>
            <div>
                <Link to='/'>
                    <img
                        src={theme.logo}
                        alt='Tarot Deck logo'
                        style={{
                            border: `4px solid ${theme.avatarSettingsBorder}`,
                            borderRadius: '50%',
                            marginLeft: '20px',
                            width: '75px'
                        }}
                    />{' '}
                    {/* Example icon */}
                </Link>
            </div>
            <div>
                <img
                    src={preferences.avatar.circleImageUrl}
                    alt='settings'
                    style={{
                        width: '65px',
                        borderRadius: '50%',
                        border: `4px solid ${theme.avatarSettingsBorder}`,
                        marginRight: '20px'
                    }}
                />
            </div>
        </header>
    );
};

export default LargeHeader;
