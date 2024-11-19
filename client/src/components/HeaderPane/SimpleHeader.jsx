import { Link } from 'react-router-dom';
import { useTheme } from '../../pages/Settings/ThemeContext';
import { useContext } from 'react';
import Icon from '../../assets/Icons/Crystals_wh.png';
import settingsPicture from '../../assets/08_Strength.jpg';
import { CookieSettingsContext } from '../../pages/Settings/SettingsRight/CookiesSettings';

const SimpleHeader = () => {
    const { theme } = useTheme();

    const { preferences } = useContext(CookieSettingsContext);

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
                padding: '.5rem',
                overflowX: 'hidden'
            }}>
            <div>
                <Link to='/'>
                    <img
                        src={Icon}
                        style={{ width: '40px' }}
                    />
                </Link>
            </div>
            <div>
                <img
                    src={preferences.avatar.circleImageUrl}
                    alt='settings'
                    style={{ width: '40px', borderRadius: '50%', border: `4px solid ${theme.avatarSettingsBorder}` }}
                />
            </div>
        </header>
    );
};

export default SimpleHeader;
