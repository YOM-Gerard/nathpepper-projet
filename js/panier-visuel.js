document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('cart-table-body');
    const cartWrapper = document.getElementById('cart-content-wrapper');
    const emptyView = document.getElementById('empty-cart-view');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total-price');

    // Charger le panier
    let cart = JSON.parse(localStorage.getItem('nathpepper_cart')) || [];

    function renderCart() {
        // Si le panier est vide
        if (cart.length === 0) {
            cartWrapper.style.display = 'none';
            emptyView.style.display = 'block';
            return;
        }

        cartWrapper.style.display = 'block';
        emptyView.style.display = 'none';
        tableBody.innerHTML = ''; // On vide le tableau avant de le recréer

        let grandTotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" class="cart-item-img"></td>
                <td style="font-weight: 500; font-family: var(--font-primary); font-size: 1.1rem;">${item.name}</td>
                <td>${item.price.toFixed(2)} €</td>
                <td>
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </td>
                <td style="font-weight: 600;">${itemTotal.toFixed(2)} €</td>
                <td><button class="remove-btn" data-index="${index}">Supprimer</button></td>
            `;
            tableBody.appendChild(tr);
        });

        // Mettre à jour les prix globaux
        subtotalElement.textContent = `${grandTotal.toFixed(2)} €`;
        totalElement.textContent = `${grandTotal.toFixed(2)} €`;
        
        // Mettre aussi à jour le petit compteur du header s'il est présent sur la page
        const globalCounter = document.getElementById('cart-count');
        if (globalCounter) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            globalCounter.textContent = totalItems;
        }
    }

    // Écouter les clics sur le tableau (Quantités et Suppression)
    tableBody.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (index === null) return;

        if (e.target.classList.contains('plus')) {
            cart[index].quantity += 1;
        } else if (e.target.classList.contains('minus')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1); // Supprime si descend en dessous de 1
            }
        } else if (e.target.classList.contains('remove-btn')) {
            cart.splice(index, 1);
        }

        // Sauvegarder et rafraîchir
        localStorage.setItem('nathpepper_cart', JSON.stringify(cart));
        cart = JSON.parse(localStorage.getItem('nathpepper_cart')) || [];
        renderCart();
    });

    // Écouter le bouton de paiement
    document.getElementById('checkout-button').addEventListener('click', () => {
        alert("Félicitations ! Le panier visuel fonctionne. Prochaine étape : Brancher l'envoi sécurisé vers l'API Stripe.");
    });

    // Premier affichage au chargement
    renderCart();
});