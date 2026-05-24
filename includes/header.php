<header class="main-header">
    <div class="header-container">
        <div class="logo">
            <a href="produits.php"><h1>Nathpepper</h1></a>
        </div>

        <nav class="main-nav">
            <ul>
                <li><a href="produits.php">Boutique</a></li>
                
                <?php if (isset($_SESSION['user_id'])): ?>
                    <li class="user-welcome">Bonjour, <strong><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong></li>
                    <li><a href="deconnexion.php" class="btn-logout">Déconnexion</a></li>
                <?php else: ?>
                    <li><a href="connexion.php" class="btn-login">Connexion / Inscription</a></li>
                <?php endif; ?>
            </ul>
        </nav>

        <div class="header-cart">
            <button id="btn-cart" class="cart-button">
                <span class="cart-icon">🛒</span>
                <span id="cart-count" class="cart-badge">0</span>
            </button>
        </div>
    </div>
</header>