// On attend que la page soit complètement chargée
document.addEventListener('DOMContentLoaded', () => {
    // 1. On récupère les éléments du DOM
    const cartCountElement = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    // 2. On initialise le panier depuis le localStorage (ou vide s'il n'y a rien)
    let cart = JSON.parse(localStorage.getItem('nathpepper_cart')) || [];

    // 3. Fonction pour mettre à jour l'affichage du compteur dans le header
    function updateCartCount() {
        if (!cartCountElement) return;
        
        // On additionne les quantités de tous les articles du panier
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // 4. Fonction pour ajouter un produit au panier
    function addToCart(event) {
        const button = event.target;
        
        // On récupère la carte du produit la plus proche pour extraire ses infos
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        // Extraction des données (on utilise des datasets ou le texte brut des balises)
        const productName = productCard.querySelector('.product-name').textContent.trim();
        const productPriceText = productCard.querySelector('.product-price').textContent.trim();
        // On extrait juste le nombre du prix (ex: "15.00 €" -> 15.00)
        const productPrice = parseFloat(productPriceText.replace(/[^0-9.,]/g, '').replace(',', '.'));
        const productImage = productCard.querySelector('.product-image').src;

        // On vérifie si l'article est déjà présent dans le panier
        const existingProductIndex = cart.findIndex(item => item.name === productName);

        if (existingProductIndex > -1) {
            // Si oui, on augmente simplement sa quantité
            cart[existingProductIndex].quantity += 1;
        } else {
            // Si non, on ajoute le nouvel objet dans le tableau
            cart.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        // On sauvegarde le panier mis à jour dans le localStorage
        localStorage.setItem('nathpepper_cart', JSON.stringify(cart));

        // On met à jour le compteur visuel
        updateCartCount();

        // Petite animation optionnelle sur le bouton pour confirmer l'ajout
        const originalText = button.textContent;
        button.textContent = "✓ Ajouté !";
        button.style.backgroundColor = "#2e7d32"; // Vert discret de confirmation
        button.style.color = "#ffffff";

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = ""; // Reprend le style CSS d'origine
            button.style.color = "";
        }, 1200);
    }

    // 5. On attribue l'événement de clic à chaque bouton "Ajouter au panier"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // 6. On affiche la bonne quantité dès le chargement de la page
    updateCartCount();
});