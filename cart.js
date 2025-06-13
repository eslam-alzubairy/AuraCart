
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}
// --- Cart State & DOM Elements ---
let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
const cartSidebar = document.querySelector('.cart-sidebar');
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart-btn');
const cartBody = document.querySelector('.cart-body');
const cartCounter = document.querySelector('.cart-counter');
const totalPriceEl = document.querySelector('.total-price');
const overlay = document.querySelector('.overlay');

// --- Core Cart Functions ---
const saveCart = () => {
    localStorage.setItem('auraCart', JSON.stringify(cart));
};

const addToCart = (productId, product) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, id: productId, quantity: 1 });
    }
    saveCart();
    renderCart();
    // openCart();
    showNotification(`تمت إضافة "${product.name}" إلى السلة!`);

};

const updateQuantity = (productId, newQuantity) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            cart = cart.filter(cartItem => cartItem.id !== productId);
        }
        saveCart();
        renderCart();
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
};

// --- Rendering Functions ---
const renderCart = () => {
    cartBody.innerHTML = '';
    if (cart.length === 0) {
        cartBody.innerHTML = '<p class="cart-empty-message">عربتك فارغة.</p>';
    } else {
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.images[0]}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">
                            <span class="icon-saudi_riyal"></span> ${item.price.toFixed(2)}
                        </p>
                        <div class="cart-item-actions">
                            <button class="quantity-btn decrease-btn">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-btn">+</button>
                            <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
            cartBody.innerHTML += cartItemHTML;
        });
    }
    updateCartInfo();
};

const updateCartInfo = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCounter.textContent = totalItems;
    totalPriceEl.innerHTML = `<span class="icon-saudi_riyal"></span> ${totalPrice.toFixed(2)}`;
;
};

// --- UI Interaction Functions ---
const openCart = () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
};

const closeCart = () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
};

// --- Event Listeners ---
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

cartBody.addEventListener('click', (e) => {
    const target = e.target;
    const cartItem = target.closest('.cart-item');
    if (!cartItem) return;

    const productId = Number(cartItem.dataset.id);
    const item = cart.find(i => i.id === productId);

    if (target.matches('.increase-btn')) {
        updateQuantity(productId, item.quantity + 1);
    } else if (target.matches('.decrease-btn')) {
        updateQuantity(productId, item.quantity - 1);
    } else if (target.matches('.remove-item-btn, .remove-item-btn *')) {
        removeFromCart(productId);
    }
});

// Initial Render
document.addEventListener('DOMContentLoaded', renderCart);