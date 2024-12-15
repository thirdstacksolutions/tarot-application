import { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [displayInfo, setDisplayInfo] = useState({
        orderId: '',
        cartTotal: 0,
        cartCount: 0
    });

    // Initialize state on component mount
    useEffect(() => {
        const cartData = sessionStorage.getItem('cartItems');
        const displayInfoSession = sessionStorage.getItem('checkoutPromptsDisplayInfo');

        if (cartData) {
            const parsedCartData = JSON.parse(cartData);
            setCartItems(parsedCartData);
        }

        if (displayInfoSession) {
            setDisplayInfo(JSON.parse(displayInfoSession));
        }
    }, []);

    const salesTax = (displayInfo?.cartTotal * 0.0625).toFixed(2);
    let total = 0;
    if (salesTax) {
        total = Number(displayInfo?.cartTotal) + Number(salesTax);
    }

    // Function to handle item removal
    const removeItem = (indexToRemove) => {
        const updatedCartData = cartItems.filter((_, index) => index !== indexToRemove);

        // Update cartItems state
        setCartItems(updatedCartData);

        // Update cartCount and cartTotal in displayInfo
        const updatedCartCount = updatedCartData.length;
        const updatedCartTotal = updatedCartData.reduce((total, item) => total + parseFloat(item.price), 0);

        const updatedDisplayInfo = {
            ...displayInfo,
            cartCount: updatedCartCount,
            cartTotal: updatedCartTotal.toFixed(2)
        };

        // Update displayInfo state
        setDisplayInfo(updatedDisplayInfo);

        // Update sessionStorage
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartData));
        sessionStorage.setItem('checkoutPromptsDisplayInfo', JSON.stringify(updatedDisplayInfo));
    };

    // Function to handle clearing all items from the cart
    const removeAll = () => {
        // Clear cartItems state
        setCartItems([]);

        // Reset cartCount and cartTotal
        const updatedDisplayInfo = {
            ...displayInfo,
            cartCount: 0,
            cartTotal: 0
        };

        // Update displayInfo state
        setDisplayInfo(updatedDisplayInfo);

        // Update sessionStorage
        sessionStorage.setItem('cartItems', JSON.stringify([]));
        sessionStorage.setItem('checkoutPromptsDisplayInfo', JSON.stringify(updatedDisplayInfo));
    };

    const CartItem = ({ imageUrl, title, description, price, index }) => {
        return (
            <>
                <div className='cart_item_container'>
                    <div className='cart_item_image'>
                        <img
                            className='cart_image'
                            src={imageUrl}
                            alt={title}
                        />
                    </div>
                    <div className='cart_item_info'>
                        <div>
                            <h3 className='cart_item_title'>{title}</h3>
                            <p className='cart_item_text'>{description}</p>
                        </div>
                        <div className='cart_item_remove'>
                            <a
                                className='remove_items'
                                onClick={() => removeItem(index)}>
                                Remove
                            </a>
                        </div>
                    </div>
                    <div className='cart_item_price'>
                        <p>${price}</p>
                    </div>
                </div>
                <Divider
                    className='cart_divider'
                    sx={{ width: '100%', height: '1px' }}
                />
            </>
        );
    };

    return (
        <section className='cart_container'>
            <div className='cart_wrapper'>
                <div className='left_column'>
                    <div className='cart_title_container'>
                        <h2 className='cart_title'>
                            Your Cart
                            <span className='cart_total'> ({displayInfo?.cartCount})</span>
                        </h2>
                        <a
                            className='remove_items'
                            onClick={removeAll}>
                            Remove All Items
                        </a>
                    </div>
                    <Divider
                        className='cart_divider'
                        sx={{ width: '100%', height: '1px', marginTop: '1rem' }}
                    />
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <CartItem
                                key={item._id} // Use a unique identifier for the key
                                index={index}
                                imageUrl={item.image}
                                title={item.name}
                                description={item.description}
                                price={item.price}
                            />
                        ))
                    ) : (
                        <p>No items in your cart.</p>
                    )}
                </div>
                <div className='right_column'>
                    <div className='order_container'>
                        <h3 className='order_title'>Your Order</h3>
                        <Divider
                            className='cart_divider'
                            sx={{ width: '100%', height: '1px', marginTop: '1rem' }}
                        />
                        <div className='summary_container'>
                            <div className='summary_label summary_subtotal'>Subtotal:</div>
                            <div className='summary_value'>${displayInfo?.cartTotal}</div>
                            <div className='summary_label'>Sales Tax:</div>
                            <div className='summary_value'>${salesTax}</div>
                        </div>
                        <Divider
                            className='cart_divider'
                            sx={{ width: '100%', height: '1px', marginTop: '1rem' }}
                        />
                        <div className='summary_container'>
                            <div className='summary_label summary_total'>Total:</div>
                            <div className='summary_value summary_total'>${total}</div>
                        </div>
                        <button className='cartDrawerButton summary_button'>Checkout</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
