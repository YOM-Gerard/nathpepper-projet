<header class="site-header">
    <div class="nav-container">
        <div class="logo">
            <a href="produits.php">Nathpepper</a>
        </div>
        
        <nav class="main-nav">
            <a href="produits.php">Boutique</a>
            <a href="index.html#story">Notre Histoire</a>
            
            <?php if (isset($_SESSION['user_id'])): ?>
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