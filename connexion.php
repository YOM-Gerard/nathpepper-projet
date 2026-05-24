<?php
// On démarre la session PHP pour pouvoir connecter l'utilisateur
session_start();
require_once 'includes/db.php';

$error = '';
$success = '';

// --- INSCRIPTION ---
if (isset($_POST['register'])) {
    $name = htmlspecialchars($_POST['reg_name']);
    $email = htmlspecialchars($_POST['reg_email']);
    $password = $_POST['reg_password'];

    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $error = "Cet email est déjà utilisé.";
    } else {
        // Hachage sécurisé du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        if ($stmt->execute([$name, $email, $hashedPassword])) {
            $success = "Compte créé avec succès ! Vous pouvez vous connecter.";
        } else {
            $error = "Une erreur est survenue lors de l'inscription.";
        }
    }
}

// --- CONNEXION ---
if (isset($_POST['login'])) {
    $email = htmlspecialchars($_POST['login_email']);
    $password = $_POST['login_password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // On vérifie si l'utilisateur existe et si le mot de passe correspond
    if ($user && password_verify($password, $user['password'])) {
        // On stocke les infos de l'utilisateur dans la Session PHP
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];

        header('Location: produits.php'); // Redirection vers la boutique
        exit;
    } else {
        $error = "Email ou mot de passe incorrect.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nathpepper - Connexion / Inscription</title>
    <link rel="stylesheet" href="styles/produits.css"> <style>
        .auth-container { display: flex; max-width: 900px; margin: 50px auto; gap: 50px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .auth-box { flex: 1; display: flex; flex-direction: column; }
        .auth-box h2 { margin-bottom: 20px; color: #333; border-bottom: 2px solid #222; padding-bottom: 10px; width: fit-content; }
        .form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
        .form-group label { margin-bottom: 5px; font-weight: bold; font-size: 0.9rem; }
        .form-group input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn-auth { background: #222; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }
        .btn-auth:hover { background: #444; }
        .alert { padding: 10px; margin-bottom: 20px; border-radius: 4px; text-align: center; }
        .alert-error { background: #f8d7da; color: #721c24; }
        .alert-success { background: #d4edda; color: #155724; }
    </style>
</head>
<body>

    <div style="max-width: 900px; margin: 20px auto; text-align: center;">
        <a href="produits.php" style="color: #666; text-decoration: none;">← Retour à la boutique</a>
    </div>

    <div class="auth-container">
        <div class="auth-box">
            <h2>Connexion</h2>
            <?php if (!empty($error) && isset($_POST['login'])): ?>
                <div class="alert alert-error"><?php echo $error; ?></div>
            <?php endif; ?>
            <form action="connexion.php" method="POST">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="login_email" required>
                </div>
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" name="login_password" required>
                </div>
                <button type="submit" name="login" class="btn-auth">Se connecter</button>
            </form>
        </div>

        <div style="width: 1px; background: #eee;"></div>

        <div class="auth-box">
            <h2>Inscription</h2>
            <?php if (!empty($error) && isset($_POST['register'])): ?>
                <div class="alert alert-error"><?php echo $error; ?></div>
            <?php endif; ?>
            <?php if (!empty($success)): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            <form action="connexion.php" method="POST">
                <div class="form-group">
                    <label>Nom complet</label>
                    <input type="text" name="reg_name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="reg_email" required>
                </div>
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" name="reg_password" required>
                </div>
                <button type="submit" name="register" class="btn-auth">Créer mon compte</button>
            </form>
        </div>
    </div>

</body>
</html>