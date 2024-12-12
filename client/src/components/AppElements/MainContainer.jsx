import { useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

import DashboardLeft from '../../pages/Dashboard/DashboardLeft';
import DashboardRight from '../../pages/Dashboard/DashboardRight';
import SettingsLeft from '../../pages/Settings/SettingsLeft/SettingsLeft';
import SettingsRight from '../../pages/Settings/SettingsRight/SettingsRight';
import NewReading from '../../pages/NewReading/NewReading';

import CardLeft from '../../pages/CardDetails/CardLeft';
import CardRight from '../../pages/CardDetails/CardRight';

import Community from '../../pages/Community/Community';
import BrowseSpreads from '../../pages/BrowseSpreads/BrowseSpreads';
import BrowseDecks from '../../pages/BrowseDecks/BrowseDecks';
import AppShop from '../../pages/Shop/Shop';

import Terms from '../../pages/InfoPages/Terms';
import Privacy from '../../pages/InfoPages/Privacy';
import FAQs from '../../pages/InfoPages/FAQs';
import Landing from '../../pages/Landing/Landing';
import AboutUs from '../../pages/InfoPages/AboutUs';
import ContactUs from '../../pages/InfoPages/ContactUs';
import JournalLeft from '../../pages/JournalEntry/JournalLeft';
import JournalRight from '../../pages/JournalEntry/JournalRight';

const routeToMainComponents = {
    '/dashboard': () => (
        <section
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
            <DashboardLeft style={{ width: '50%' }} />
            <DashboardRight style={{ width: '50%' }} />
        </section>
    ),
    '/settings': () => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
            <SettingsLeft style={{ width: '50%' }} />
            <SettingsRight style={{ width: '50%' }} />
        </div>
    ),

    '/journal': () => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
            <JournalLeft style={{ width: '50%' }} />
            <JournalRight style={{ width: '50%' }} />
        </div>
    ),
    '/cardDetails': () => (
        <section
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
            <CardLeft />
            <CardRight />
        </section>
    ),
    '/newReading': NewReading,
    '/community': Community,
    '/browseSpreads': BrowseSpreads,
    '/browseDecks': BrowseDecks,
    '/appShop': AppShop,
    '/aboutUs': AboutUs,
    '/terms': Terms,
    '/privacy': Privacy,
    '/faqs': FAQs,
    '/contactUs': ContactUs,
    '/landing': Landing,
    '/': Landing
};

const MainContainer = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const MainComponent = routeToMainComponents[location.pathname];

    const publicInfoRoutes = [
        '/terms',
        '/privacy',
        '/contactUs',
        '/faqs',
        '/aboutUs',
        '/browseSpreads',
        '/browseDecks'
    ];
    const isPublicInfoPage = publicInfoRoutes.includes(location.pathname);

    const containerClassName = isPublicInfoPage && !isAuthenticated ? 'landing-page' : '';

    return (
        <main style={{ flex: '1' }}>
            <div className={containerClassName}>{MainComponent && <MainComponent />}</div>
        </main>
    );
};

export default MainContainer;
