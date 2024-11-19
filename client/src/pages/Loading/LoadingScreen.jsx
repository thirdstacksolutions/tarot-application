import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingScreen = () => {
    return (
        <div
            className='loading-screen'
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>
    );
};

export default LoadingScreen;
