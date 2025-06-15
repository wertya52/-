document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація кошика
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Оновлення лічильника кошика
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = count;
        });
    }
    
    // Додавання товару до кошика
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`"${name}" додано до кошика!`);
    }
    
    // Видалення товару з кошика
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
    
    // Зміна кількості товару
    function updateQuantity(id, newQuantity) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    }
    
    // Відображення товарів у кошику
    function renderCartItems() {
        const cartItemsEl = document.getElementById('cart-items');
        const totalPriceEl = document.getElementById('total-price');
        
        if (!cartItemsEl) return;
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Ваш кошик порожній</p>';
            totalPriceEl.textContent = '0';
            return;
        }
        
        let total = 0;
        let itemsHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">${item.price} грн/шт</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">${itemTotal} грн</div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
                </div>
            `;
        });
        
        cartItemsEl.innerHTML = itemsHTML;
        totalPriceEl.textContent = total;
    }
    
    // Обробка кнопки "Купити"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCart(id, name, price);
        });
    });
    
    // Обробка кнопки "Оформити замовлення"
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Ваш кошик порожній!');
                return;
            }
            
            alert('Замовлення оформлено! Дякуємо за покупку!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        });
    }
    
    // Ініціалізація
    updateCartCount();
    renderCartItems();
    
    // Додавання функцій до глобального об'єкта window
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
});