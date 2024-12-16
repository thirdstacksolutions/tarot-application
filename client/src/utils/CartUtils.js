const generateOrderId = () => {
    return `HB${Date.now()}`;
};

export const addToCart = (itemId, itemType, itemImage, itemPrice, itemName, itemDescription) => {
    const operationTimeKey = 'checkoutPromptsOperationTime';
    const displayInfoKey = 'checkoutPromptsDisplayInfo';
    const cartItemsKey = 'cartItems';

    // Load current metadata and items from Session Storage or initialize them
    let operationTime = JSON.parse(sessionStorage.getItem(operationTimeKey)) || {};
    let displayInfo = JSON.parse(sessionStorage.getItem(displayInfoKey)) || {
        orderId: generateOrderId(),
        cartTotal: 0,
        cartCount: 0
    };
    let cartItems = JSON.parse(sessionStorage.getItem(cartItemsKey)) || [];

    // Check if the cart is valid
    const now = Date.now();
    if (operationTime.validTill && now > operationTime.validTill) {
        // Expired cart, reset
        displayInfo = { orderId: generateOrderId(), cartTotal: 0, cartCount: 0 };
        cartItems = [];
    }

    // Add new item to the cart (store itemId and other data)
    const newItem = {
        _id: itemId,
        type: itemType,
        image: itemImage,
        price: itemPrice,
        name: itemName,
        description: itemDescription
    };
    cartItems.push(newItem);

    // Update cart metadata
    displayInfo.cartCount = cartItems.length;
    displayInfo.cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

    // Update operation time (e.g., 24 hours from now)
    operationTime.validTill = now + 24 * 60 * 60 * 1000;

    // Save updated data to Session Storage
    sessionStorage.setItem(operationTimeKey, JSON.stringify(operationTime));
    sessionStorage.setItem(displayInfoKey, JSON.stringify(displayInfo));
    sessionStorage.setItem(cartItemsKey, JSON.stringify(cartItems));

    console.log('Cart updated:', displayInfo, cartItems);
};

export const isCartValid = () => {
    const operationTime = JSON.parse(localStorage.getItem('checkoutPromptsOperationTime')) || {};
    return operationTime.validTill && Date.now() < operationTime.validTill;
};

export const getCartItemIdsForMutation = () => {
    const cartItemsKey = 'cartItems';
    const cartItems = JSON.parse(sessionStorage.getItem(cartItemsKey)) || [];
    return cartItems.map((item) => item._id);
};
