import * as React from 'react';
import {
    Drawer,
    Box,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Card
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Button from 'react-bootstrap/Button';

const TemporaryDrawer = ({ open, setOpen, theme, dimensions }) => {
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen); // Control drawer open/close state
    };

    const cartData = sessionStorage.getItem('cartItems');
    const displayInfoSession = sessionStorage.getItem('checkoutPromptsDisplayInfo');

    const displayInfo = JSON.parse(displayInfoSession) || {
        orderId: '',
        cartTotal: 0,
        cartCount: 0
    };

    let newCartItem;

    if (cartData) {
        const data = JSON.parse(cartData);
        const lastItem = data[data.length - 1];
        newCartItem = lastItem;
    } else if (open === true) {
        console.log('Cart data not found in sessionStorage');
    }

    const dimensionsKey = newCartItem?.type; // Safely access 'type'
    const dimensionInfo = dimensions[dimensionsKey] || { width: '0px', height: '0px' }; // Fallback

    // Function to scale dimensions
    const scaleDimensions = (dimensions, scale) => {
        return {
            width: `${parseFloat(dimensions.width) * scale}px`,
            height: `${parseFloat(dimensions.height) * scale}px`
        };
    };

    const scaledDimensions = dimensionInfo ? scaleDimensions(dimensionInfo, 0.75) : { width: '0px', height: '0px' };

    const price = `$${newCartItem?.price}`;
    const totalPrice = `$${displayInfo?.cartTotal}`;

    // const LoadingSection = (
    //     <Box
    //         sx={{
    //             display: 'flex',
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //             height: '100%'
    //         }}>
    //         <CircularProgress />
    //     </Box>
    // );

    const DrawerList = (
        <Box
            sx={{ width: '500px' }}
            role='presentation'>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.8rem'
                }}
                className='addedToCartContainer'>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ paddingRight: '0.8rem', color: '#12bd6a', fontSize: '31px' }} />
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.25' }}>
                        Added to Cart
                    </Typography>
                </Box>
                <CloseIcon
                    sx={{ fontSize: '31px', cursor: 'pointer' }}
                    onClick={toggleDrawer(false)}
                />
            </Box>

            <Box sx={{ width: '100%', padding: '0.8em', display: 'inline-flex' }}>
                <Card
                    sx={{
                        margin: 0,
                        width: scaledDimensions.width,
                        height: scaledDimensions.height,
                        border: `3px solid ${theme.universalImageBorder}`,
                        borderRadius: dimensionInfo.borderRadius,
                        backgroundImage: `url(${newCartItem?.image})`,
                        backgroundSize: 'cover', // Ensure the image covers the entire box
                        backgroundPosition: 'center', // Center the image
                        backgroundRepeat: 'no-repeat', // Prevent tiling
                        marginRight: '0.8em'
                    }}
                />
                <Box sx={{ minWidth: '50%', maxWidth: '60%' }}>
                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: '1.2rem',
                            lineHeight: '1.25'
                        }}>
                        {newCartItem?.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            lineHeight: '1.25'
                        }}>
                        {newCartItem?.description}
                        <br />
                        <br />
                        Qty: 1
                        <br />
                        <br />
                        {price}
                    </Typography>
                </Box>
            </Box>
            <Divider variant='middle' />
            <Box sx={{ padding: '0.8em' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>Cart Total: {totalPrice}</Typography>
                <Typography sx={{ padding: '8px 0', fontSize: '12px' }}>
                    Taxes are calculated during checkout.
                </Typography>
                <Button
                    className='cartDrawerButton'
                    style={{ margin: '8px 0' }}>
                    View Cart
                </Button>
            </Box>
            <Divider variant='middle' />
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor='right' // Drawer appears on the right
                open={open}
                onClose={toggleDrawer(false)}>
                {DrawerList}
                {/* {newCartItem ? { DrawerList } : { LoadingSection }} */}
            </Drawer>
        </div>
    );
};

export default TemporaryDrawer;
