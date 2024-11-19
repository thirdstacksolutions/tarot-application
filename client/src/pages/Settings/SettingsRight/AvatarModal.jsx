import { useState, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import '../Settings.css';
import './SettingsRight.css';
import { useTheme } from '../ThemeContext';

import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_AVATAR_DETAILS, QUERY_AVATAR_DATA, QUERY_DEFAULT_DATA } from '../../../utils/queries';
import { EDIT_USER_SETTINGS } from '../../../utils/mutations';
import { CookieSettingsContext } from './CookiesSettings';

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 'auto',
//     height: '90%',
//     aspectRatio: '8/9',
//     backgroundColor: `var(--panel-color)`,
//     border: `3px solid var(--universal-image-border)`,
//     borderRadius: '8px',
//     boxShadow: 24,
//     p: 0
// };

const AvatarModal = ({ onClose }) => {
    const theme = useTheme();
    const { preferences, updatePreferences } = useContext(CookieSettingsContext);
    const [userAvatars, { data: userAvatarsData, loading: userAvatarLoading }] = useLazyQuery(QUERY_AVATAR_DATA);
    const [getAvatarDetails] = useLazyQuery(GET_AVATAR_DETAILS);
    const [editUserSettings] = useMutation(EDIT_USER_SETTINGS, {
        refetchQueries: [{ query: QUERY_DEFAULT_DATA }]
    });
    const [selectedAvatar, setSelectedAvatar] = useState(preferences.avatar);

    const [avatarInfo, setAvatar] = useState({});

    useEffect(() => {
        userAvatars();
    }, [userAvatars]);

    useEffect(() => {
        const fetchAvatarDetails = async () => {
            if (!userAvatarsData || !userAvatarsData.me || !userAvatarsData.me.avatars) {
                return; // Prevent further execution if data is undefined
            }

            if (userAvatarsData.me.avatars.length > 0) {
                const avatarIds = userAvatarsData.me.avatars.map((avatar) => avatar._id);

                const avatarDetailsArray = [];

                for (const avatarId of avatarIds) {
                    const { data } = await getAvatarDetails({ variables: { avatarId } });
                    if (data && data.avatarDetails) {
                        avatarDetailsArray.push(data.avatarDetails);
                    }
                }
                setAvatar(avatarDetailsArray);
            }
        };

        // Call fetch function only if userAvatarsData is loaded
        if (!userAvatarLoading) {
            fetchAvatarDetails();
        }
    }, [userAvatarsData, userAvatarLoading, getAvatarDetails]);

    const handleClose = (name) => {
        if (name === 'save') {
            setSelectedAvatar();
        }
        onClose(); // Call the onClose function passed from the parent
    };

    const selectAvatar = (avatar) => {
        setSelectedAvatar(avatar);
    };

    const AvatarImages = () => {
        const maxAvatarsPerRow = 3;

        if (avatarInfo.length === 0) {
            return <p>Loading avatars...</p>;
        }

        const rows = [];

        for (let i = 0; i < avatarInfo.length; i += maxAvatarsPerRow) {
            rows.push(
                <Box
                    key={i}
                    sx={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {avatarInfo.slice(i, i + maxAvatarsPerRow).map((avatar) => (
                        <Avatar
                            key={avatar._id}
                            src={avatar.circleImageUrl}
                            sx={{ width: 100, height: 100, margin: '0.5rem' }}
                            draggable='false'
                            className='avatarImg'
                            alt={avatar.avatarName}
                            onClick={() => selectAvatar(avatar)}
                        />
                    ))}
                </Box>
            );
        }

        return <>{rows}</>;
    };

    // const CancelButton = styled(Button)(({ theme }) => ({
    //     fontFamily: 'Quicksand',
    //     backgroundColor: 'white',
    //     color: '#a89467',
    //     border: '2px solid white',
    //     padding: '6px 12px',
    //     width: '120px',
    //     height: '40px',
    //     '&:hover': {
    //         backgroundColor: 'white',
    //         color: '#121212',
    //         border: '2px solid #A89467'
    //     }
    // }));
    // const SaveButton = styled(Button)(({ theme }) => ({
    //     fontFamily: 'Quicksand',
    //     backgroundColor: '#A89467',
    //     color: 'white',
    //     border: '2px solid #382337',
    //     padding: '6px 12px',
    //     width: '120px',
    //     height: '43px',
    //     '&:hover': {
    //         backgroundColor: '#A89467',
    //         color: 'white',
    //         border: '2px solid white'
    //     }
    // }));

    const handleSelectorChange = async (value) => {
        const userId = await userAvatarsData.me._id;

        try {
            const { data } = await editUserSettings({
                variables: {
                    userId: userId,
                    input: {
                        activeAvatar: value._id
                    }
                }
            });
        } catch (e) {
            console.error('Error updating user settings:', e);
        }

        handleClose();
    };

    return (
        <Card className='avatar-modal-card'>
            <div className='avatar-card-styling'>
                <AvatarImages />
                <Box className='avatar-modal-container'>
                    <Box>
                        <img
                            alt='avatar'
                            src={selectedAvatar.circleImageUrl}
                            className='selectedAvatar'
                        />
                    </Box>
                    <Box className='avatar-content'>
                        <CardContent>
                            <Typography
                                // gutterBottom
                                variant='h4'
                                className='avatar-title'
                                fontFamily='Macondo'
                                component='div'>
                                Avatar Selection
                            </Typography>
                            <Typography
                                className='avatar-headline'
                                variant='body2'
                                fontFamily='Quicksand'>
                                Choose your avatar! You can change it at any time.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                className='button-secondary button-modal'
                                onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                className='button button-modal'
                                onClick={() => handleSelectorChange(selectedAvatar)}>
                                Save
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </div>
        </Card>
    );
};

export default AvatarModal;
