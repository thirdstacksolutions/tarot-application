import { useLocation } from 'react-router-dom';

import LargeHeader from '../HeaderPane/LargeHeader';
import SimpleHeader from '../HeaderPane/SimpleHeader';
import ShopHeader from '../HeaderPane/ShopHeader';
import { useTheme } from '../../pages/Settings/ThemeContext';

const routeToHeader = {
    '/dashboard': LargeHeader,
    '/settings': LargeHeader,
    '/newReading': SimpleHeader,
    '/cardDetails': LargeHeader,
    '/journal': LargeHeader,
    '/appShop': ShopHeader
};

const Header = () => {
    const location = useLocation();
    const { theme } = useTheme();

    const HeaderComponent = routeToHeader[location.pathname];

    return (
        <div style={{ width: '100vw', backgroundImage: `url(${theme.headerImage})`, backgroundSize: 'cover' }}>
            {HeaderComponent && <HeaderComponent />}
        </div>
    );
};

export default Header;
