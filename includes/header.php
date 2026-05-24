<header>
    <div class="nav-container">
        <div class="logo">
            <a href="produits.php">Nathpepper</a>
        </div>
        
        <a href="produits.php">Boutique</a>
        <a href="#story">Notre Histoire</a>
        
        <?php if (isset($_SESSION['user_id'])): ?>
            <!-- Si connecté : Le 3ème lien devient le prénom (cliquable pour se déconnecter) -->
            <a href="deconnexion.php" class="auth-link connected" title="Cliquez pour vous déconnecter">
                👤 <?php echo htmlspecialchars($_SESSION['user_name']); ?> (Quitter)
            </a>
        <?php else: ?>
            <!-- Si anonyme : Le 3ème lien reste ton lien Contact / Connexion classique -->
            <a href="connexion.php" class="auth-link">Connexion</a>
        <?php endif; ?>

        <div class="cart-icon" id="btn-cart">
            🛒 <span id="cart-count">0</span>
        </div>
    </div>
</header>