// Shopping cart functionality

let cart = JSON.parse(localStorage.getItem('helionis-cart')) || [];

// Add item to cart
window.addToCart = function(productId, quantity = 1) {
    const products = {
        1: { id: 1, name: 'Schutz-Amulett "Aegis"', price: 89.90, image: 'assets/images/products/amulett-schutz.svg' },
        2: { id: 2, name: 'Kristallpyramide "Lumina"', price: 149.90, image: 'assets/images/products/pyramide-kristall.svg' },
        3: { id: 3, name: 'Orakeldeck "Visions"', price: 49.90, image: 'assets/images/products/orakel-deck.svg' }
    };
    
    const product = products[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    updateCartUI();
    saveCart();
    
    if (window.showNotification) {
        window.showNotification(`${product.name} wurde zum Warenkorb hinzugefügt!`);
    }
};

// Remove item from cart
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
};

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('helionis-cart', JSON.stringify(cart));
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});

// Get cart items
window.getCart = function() {
    return cart;
};

// Clear cart
window.clearCart = function() {
    cart = [];
    updateCartUI();
    saveCart();
};