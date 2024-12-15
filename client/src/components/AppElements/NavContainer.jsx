import { useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import NavIcons from '../../components/NavigationPane/NavigationIcons';
import NavLinks from '../../components/NavigationPane/NaviationLinks';

const NavContainer = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const getNavComponent = () => {
        const commonNav = (
            <div style={{ display: 'flex', height: '100%' }}>
                <NavLinks />
                <NavIcons />
            </div>
        );

        // Mapping routes to components
        const routes = {
            '/dashboard': commonNav,
            '/settings': commonNav,
            '/reading': commonNav,
            '/community': commonNav,
            '/browseSpreads': commonNav,
            '/browseDecks': commonNav,
            '/appShop': commonNav,
            '/cart': commonNav,
            '/newReading': <NavIcons />,
            '/cardDetails': commonNav,
            '/journal': commonNav,
            '/aboutUs': isAuthenticated ? <NavIcons /> : null,
            '/faqs': isAuthenticated ? <NavIcons /> : null,
            '/contactUs': isAuthenticated ? <NavIcons /> : null,
            '/terms': isAuthenticated ? <NavIcons /> : null,
            '/privacy': isAuthenticated ? <NavIcons /> : null
        };

        // Fallback for routes not explicitly defined
        return routes[location.pathname] || null;
    };

    const NavComponent = getNavComponent();

    return <div style={{ display: 'flex' }}>{NavComponent}</div>;
};

export default NavContainer;
