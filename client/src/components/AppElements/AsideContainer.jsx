// AsideContainer.jsx
import { useLocation } from 'react-router-dom';
import QuickUserInfo from '../AsidePane/QuickUserInfo/QuickUserInfo';
import QuickLinks from '../AsidePane/QuickLinks';
import AppUpdates from '../AsidePane/AppUpdates';
import ReadingAside from '../AsidePane/ReadingAside';
import { useTheme } from '../../pages/Settings/ThemeContext';

const AsideContainer = () => {
    const location = useLocation();
    const { theme } = useTheme();

    const routeToAsideComponents = {
        '/dashboard': () => (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
                <QuickUserInfo />
                <QuickLinks />
                <AppUpdates />
            </div>
        ),
        '/settings': () => (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
                <QuickUserInfo />
                <QuickLinks />
                <AppUpdates />
            </div>
        ),
        '/newReading': () => (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
                <ReadingAside />
            </div>
        ),
        '/community': () => (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
                <QuickUserInfo />
                <QuickLinks />
                <AppUpdates />
            </div>
        ),
        '/cardDetails': () => (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
                <QuickUserInfo />
                <QuickLinks />
                <AppUpdates />
            </div>
        ),
        '/cart': () => (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
                <QuickUserInfo />
                <QuickLinks />
                <AppUpdates />
            </div>
        )
    };

    const AsideComponents = routeToAsideComponents[location.pathname];

    return <aside style={{ backgroundColor: theme.panelColor }}>{AsideComponents && <AsideComponents />}</aside>;
};

export default AsideContainer;
