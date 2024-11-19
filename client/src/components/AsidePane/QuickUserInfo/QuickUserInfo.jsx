import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, useContext } from 'react';
import { GET_ME } from '../../../utils/queries';
import { CookieSettingsContext } from '../../../pages/Settings/SettingsRight/CookiesSettings';
import { useTheme } from '../../../pages/Settings/ThemeContext';
import './QuickUserInfo.css';

const QuickUserInfo = () => {
    const { theme } = useTheme();
    const [getMe, { data: currentUserData }] = useLazyQuery(GET_ME);
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        dateCreated: '',
        totalReadings: 0
    });
    const [firstName, setFirstName] = useState(false);

    useEffect(() => {
        getMe();
    }, [getMe]); // Empty dependency array to run once on component mount

    const formatDateCreated = (value) => {
        // Remove any non-digit characters from the input
        const cleaned = value.replace(/\D/g, '');

        // Parse the cleaned input to extract month, day, and year
        const month = cleaned.substring(4, 6);
        const day = cleaned.substring(6, 8);
        const year = cleaned.substring(0, 4);

        // Rearrange the components to form the desired format (YYYY-MM-DD)
        const formatedDateCreated = `${month}-${day}-${year}`;

        return formatedDateCreated;
    };

    useEffect(() => {
        if (currentUserData && currentUserData.me) {
            const dateCreated = formatDateCreated(currentUserData.me.dateCreated);
            if (currentUserData.me.firstName === null) {
                setFirstName(false);
            } else {
                setFirstName(true);
            }
            setUserData((prevUserData) => ({
                ...prevUserData,
                username: currentUserData.me.username,
                firstName: currentUserData.me.firstName,
                dateCreated: dateCreated,
                totalReadings: currentUserData.me.totalReadings
            }));
        }
    }, [currentUserData]);

    // Sample user data (replace with actual data)
    const user = {
        username: userData.username,
        message: `Welcome back, ${userData.firstName}!`,
        date: userData.dateCreated,
        readingCount: userData.totalReadings
    };

    const { preferences } = useContext(CookieSettingsContext);
    const [avatar, setAvatar] = useState(preferences.avatar);

    useEffect(() => {
        setAvatar(preferences.avatar.squareImageUrl);
    }, [preferences.avatar]);

    return (
        <section
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '2.5rem',
                color: theme.userTextColor
            }}>
            <div
                className='bodyColor'
                style={{
                    color: theme.bodyColor, // Use theme for username color
                    textShadow: `1px 1px 1px ${theme.h2TextShadow}`, // Dynamic text shadow
                    fontSize: '24px'
                }}>
                {user.username}
            </div>
            <img
                src={avatar}
                alt='settings'
                style={{
                    width: '150px',
                    borderRadius: '5px',
                    border: `6px solid ${theme.avatarSettingsBorder}`,
                    marginTop: '1rem',
                    marginBottom: '1rem'
                }}
            />
            <div>{firstName ? user.message : 'Welcome Back!'}</div>
            <div>Member since: {user.date}</div>
            <div>Total readings: {user.readingCount}</div>
        </section>
    );
};

export default QuickUserInfo;
