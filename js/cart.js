// Gestion du panier
let cart = JSON.parse(localStorage.getItem('nathpepper-cart')) || [];

// Fonction pour ajouter un produit au panier (mise à jour avec les infos directes)
function addToCart(productId, name, price, image, quantity = 1) {
    // On regarde si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // On crée l'article directement avec les données reçues du bouton HTML
        cart.push({
            id: productId,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    saveCart();
    showNotification(`${name} ajouté au panier`, 'success');
}

// Fonction pour retirer un produit du panier
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        saveCart();
        showNotification(`${item.name} retiré du panier`, 'info');
    }
}

// Fonction pour modifier la quantité d'un produit
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCart();
        }
    }
}

// Fonction pour vider le panier
function clearCart() {
    cart = [];
    updateCartDisplay();
    saveCart();
    showNotification('Panier vidé', 'info');
}

// Fonction pour calculer le total du panier
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Fonction pour obtenir le nombre d'articles dans le panier
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Fonction pour mettre à jour l'affichage du panier
function updateCartDisplay() {
    // Mettre à jour le compteur dans le header
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = getCartItemCount();
    }
    
    // Mettre à jour le contenu du modal panier
    updateCartModal();
}

// Fonction pour mettre à jour le modal du panier
function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
        cartTotal.textContent = '0,00 €';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA0MEw1MCAzMEgzMEw0MCA0MFoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+Cg=='">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} €</div>
                <div class="cart-item-quantity">
                    <button class="cart-quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="cart-quantity-display">${item.quantity}</span>
                    <button class="cart-quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Supprimer">×</button>
        </div>
    `).join('');
    
    cartTotal.textContent = getCartTotal().toFixed(2) + ' €';
}

// Fonction pour sauvegarder le panier
function saveCart() {
    localStorage.setItem('nathpepper-cart', JSON.stringify(cart));
}

// Fonction pour ouvrir le modal panier
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    updateCartModal();
    if (modal) {
        modal.classList.add('show');
    }
}

// Nouvelle fonction pour procéder au checkout (avec sauvegarde en BDD)
function checkout() {
    if (!cart || cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }
    
    showNotification('Sauvegarde de votre commande...', 'info');
    
    fetch('save_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart: cart })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Le serveur a répondu avec un statut " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification(`Commande validée ! (N° ${data.order_id})`, 'success');
            clearCart();
            const modal = document.getElementById('cart-modal');
            if (modal) {
                modal.classList.remove('show');
            }
        } else {
            showNotification('Erreur : ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error("Erreur Fetch complète :", error);
        showNotification('Erreur technique lors de la validation.', 'error');
    });
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialiser le panier au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    const cartBtn = document.getElementById('btn-cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCartModal);
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                clearCart();
            }
        });
    }
});

// Exporter les fonctions pour les autres modules
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.openCartModal = openCartModal;
window.checkout = checkout;
window.showNotification = showNotification;