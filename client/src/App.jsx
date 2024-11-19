import PropTypes from 'prop-types';
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ThemeProvider } from '../src/pages/Settings/ThemeContext';
import { GlobalProvider } from './pages/Loading/GlobalProvider';
import { GlobalContext } from './pages/Loading/GlobalProvider';
import { ReadingContextProvider } from './context/ReadingContext';
import Layout from './components/AppLayout/Layout';
// import Theme from '../../server/models/Theme';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <GlobalProvider>
                    <Router>
                        <MainRoutes />
                    </Router>
                </GlobalProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

const MainRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path='/dashboard'
                element={<ProtectedContent content='dashboard' />}
            />
            <Route
                path='/newReading'
                element={
                    <ReadingContextProvider>
                        <Layout content='newReading' /> {/* Wrap only for newReading */}
                    </ReadingContextProvider>
                }
            />
            <Route
                path='/profile'
                element={<ProtectedContent content='profile' />}
            />
            <Route
                path='/journal'
                element={<ProtectedContent content='journal' />}
            />
            <Route
                path='/cardDetails'
                element={<ProtectedContent content='cardDetails' />}
            />
            <Route
                path='/community'
                element={<ProtectedContent content='community' />}
            />
            <Route
                path='/aboutUs'
                element={<Layout content='aboutUs' />}
            />
            <Route
                path='/faqs'
                element={<Layout content='faqs' />}
            />
            <Route
                path='/contactUs'
                element={<Layout content='contactUs' />}
            />
            <Route
                path='/privacy'
                element={<Layout content='privacy' />}
            />
            <Route
                path='/terms'
                element={<Layout content='terms' />}
            />
            <Route
                path='/'
                element={isAuthenticated ? <Navigate to='/dashboard' /> : <Layout content='landing' />}
            />
            <Route
                path='/landing'
                element={isAuthenticated ? <Navigate to='/dashboard' /> : <Layout content='landing' />}
            />
            <Route
                path='/dashboard'
                element={<ProtectedContent content='dashboard' />}
            />
            <Route
                path='/newReading'
                element={<ProtectedContent content='newReading' />}
            />
            <Route
                path='/settings'
                element={<ProtectedContent content='settings' />}
            />
            <Route
                path='/reading'
                element={<ProtectedContent content='reading' />}
            />
            <Route
                path='/community'
                element={<ProtectedContent content='community' />}
            />

            <Route
                path='/aboutUs'
                element={<Layout content='aboutUs' />}
            />
            <Route
                path='/faqs'
                element={<Layout content='faqs' />}
            />
            <Route
                path='/contactUs'
                element={<Layout content='contactUs' />}
            />
            <Route
                path='/privacy'
                element={<Layout content='privacy' />}
            />
            <Route
                path='/terms'
                element={<Layout content='terms' />}
            />
            <Route
                path='/appShop'
                element={<Layout content='appShop' />}
            />
            <Route
                path='/browseDecks'
                element={<Layout content='browseDecks' />}
            />
            <Route
                path='/browseSpreads'
                element={<Layout content='browseSpreads' />}
            />
        </Routes>
    );
};

const ProtectedContent = ({ content }) => {
    const { isAuthenticated } = useAuth();
    const { globalLoading } = useContext(GlobalContext);

    // Wait for loading to complete
    if (globalLoading && isAuthenticated) {
        conosole.log('inside thing');
        return <LoadingScreen />; // Show loading screen if still loading
    }

    return isAuthenticated ? <Layout content={content} /> : <Navigate to='/landing' />;
};

ProtectedContent.propTypes = {
    content: PropTypes.string
};

Layout.propTypes = {
    content: PropTypes.string
};

export default App;
