<header>
    <div class="nav-container">
        <div class="logo">
            <a href="index.html">Nathpepper</a>
        </div>
        <nav>
            <a href="produits.php">Boutique</a>
            <a href="#story">Notre Histoire</a>
            <a href="#contact">Contact</a>
            
            <?php if (isset($_SESSION['user_id'])): ?>
                <span class="user-welcome">Bonjour, <strong><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong></span>
                <a href="deconnexion.php" class="btn-logout">Déconnexion</a>
            <?php else: ?>
                <a href="connexion.php" class="btn-login">Connexion</a>
            <?php endif; ?>
        </nav>
        <div class="cart-icon" id="btn-cart">
            🛒 <span id="cart-count">0</span>
        </div>
    </div>
</header>