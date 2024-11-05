import { createContext, useState, useEffect, useContext } from 'react';
import { useTheme } from '../Settings/ThemeContext';
import Cookies from 'js-cookie';
import { CookieSettingsContext } from '../Settings/SettingsRight/CookiesSettings.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import { useAuth } from '../../utils/AuthContext';
import themes from '../Settings/ThemeConfig.jsx';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const { preferences, dataLoaded: userLoading } = useContext(CookieSettingsContext);
    const { defaultTheme, loading: themeLoading } = useTheme();
    const { checkLoggedIn } = useAuth();
    const [globalLoading, setGlobalLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        const verifyLogin = async () => {
            const loggedIn = await checkLoggedIn();
            setUserLoggedIn(loggedIn);
        };

        verifyLogin();
    }, [checkLoggedIn]);

    useEffect(() => {
        // let timeout;
        // const minimumLoadingTime = 250; // Ensure at least 1 second loading screen
        if (userLoading && !themeLoading && userLoggedIn) {
            setGlobalLoading(false); // Stop loading screen

            // timeout = setTimeout(() => {
            //     setGlobalLoading(false); // Stop loading screen
            // }, minimumLoadingTime);
        } else if (userLoggedIn === false) {
            setGlobalLoading(false);
        } else {
            setGlobalLoading(true); // Show loading screen while waiting
        }

        // return () => clearTimeout(timeout);
    }, [userLoading, themeLoading, userLoggedIn]);

    const manageCookies = () => {
        const cookiesData = Cookies.get('defaultData');
        const themeData = Cookies.get('themeData');
        const localStorageBackgroundColor = localStorage.getItem('backgroundColor');

        const defaultCookies = cookiesData ? JSON.parse(cookiesData) : {};
        const themeCookies = themeData ? JSON.parse(themeData) : {};
        let defaultBackgroundColor;
        if (localStorageBackgroundColor) {
            defaultBackgroundColor = localStorageBackgroundColor;
        } else {
            defaultBackgroundColor = '';
        }

        const shouldUpdateCookies = (cookies, data) => {
            return Object.keys(data).some((key) => cookies[key] !== data[key]);
        };

        const shouldUpdateBackgroundColor = (backgroundColorInfo, data) => {
            const key = data.defaultTheme.value;
            if (themes[key]) {
                if (themes[key].backgroundColor === backgroundColorInfo.color) {
                    return false;
                }
            } else {
                return true;
            }
        };

        const setBackgroundColor = (data) => {
            const key = data.value;
            console.log(key);
            let backgroundColor = themes['main'].backgroundColor;
            if (themes[key]) {
                backgroundColor = themes[key].backgroundColor;
            }

            localStorage.setItem('backgroundColor', backgroundColor);
        };

        // Check and update defaultData cookies
        if (Object.keys(defaultCookies).length && preferences?.defaultData) {
            if (shouldUpdateCookies(defaultCookies, preferences.defaultData)) {
                Cookies.set('defaultData', JSON.stringify(preferences.defaultData));
            }
        } else if (preferences?.defaultData) {
            Cookies.set('defaultData', JSON.stringify(preferences.defaultData));
        }

        // Check and update theme cookies
        if (Object.keys(themeCookies).length && defaultTheme) {
            if (shouldUpdateCookies(themeCookies, { defaultTheme })) {
                Cookies.set('themeData', JSON.stringify({ defaultTheme }));
            }
        } else if (defaultTheme) {
            Cookies.set('themeData', JSON.stringify({ defaultTheme }));
        }

        // Check and update backgroundColors cookies
        if (defaultBackgroundColor.length && defaultTheme) {
            if (shouldUpdateBackgroundColor(localStorageBackgroundColor, { defaultTheme })) {
                setBackgroundColor(defaultTheme);
            }
        } else if (defaultTheme) {
            setBackgroundColor(defaultTheme);
        }
    };

    // Call manageCookies inside useEffect
    useEffect(() => {
        manageCookies();
    }, [preferences?.defaultData, defaultTheme]);

    return (
        <GlobalContext.Provider value={{ globalLoading }}>
            {globalLoading ? <LoadingScreen /> : children}
        </GlobalContext.Provider>
    );
};
