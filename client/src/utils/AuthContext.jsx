import { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (idToken) => {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('id_token');
        localStorage.removeItem('tokenExpiration');
        window.location.assign('/');
    };

    const checkLoggedIn = async () => {
        try {
            const token = await getToken();
            const expired = await isTokenExpired(token);
            if (token && !expired) {
                setIsAuthenticated(true);
                return true;
            } else {
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
            return false;
        }
    };

    const isTokenExpired = async (token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
                localStorage.removeItem('id_token');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    const checkLogout = () => {
        const token = getToken();
        const decoded = jwtDecode(token);
        const storedExpiration = decoded.exp;
        if (!storedExpiration) {
            console.warn('Token expiration not found in local storage');
            return; // Handle missing expiration or logout immediately
        }

        const now = Date.now() / 1000;
        const expirationTime = parseFloat(storedExpiration); // Ensure expiration is a number
        let timeToLogout = expirationTime - now;
        console.log(timeToLogout);

        // Ensure a minimum logout time (optional)
        const minimumLogoutTime = 30;
        if (timeToLogout < minimumLogoutTime) {
            console.log('Token expiration too close, logging out immediately');
            timeToLogout = minimumLogoutTime;
        }

        if (timeToLogout <= 0) {
            logout(); // Logout if expiration time has already passed
        } else {
            // Schedule logout for remaining time
            setTimeout(() => {
                logout();
            }, timeToLogout * 1000);
        }
    };

    const getToken = () => {
        try {
            const token = localStorage.getItem('id_token');
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
        }
    };

    useEffect(() => {
        const updateAuthStatus = async () => {
            const isLoggedIn = await checkLoggedIn();
            // checkLogout();
            setIsAuthenticated(isLoggedIn);
        };
        updateAuthStatus();
    }, []);

    const value = {
        isAuthenticated,
        login,
        logout,
        checkLoggedIn
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);
