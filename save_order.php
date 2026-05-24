<?php
// On active l'affichage des erreurs au cas où
ini_set('display_errors', 1);
error_reporting(E_ALL);

// On inclut la connexion à la BDD
require_once 'includes/db.php';

// On indique qu'on va répondre au format JSON (très pratique pour le JS)
header('Content-Type: application/json');

// 1. Récupérer les données envoyées par le JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Vérification si le panier n'est pas vide
if (empty($data['cart'])) {
    echo json_encode(['success' => false, 'message' => 'Le panier est vide.']);
    exit;
}

$cart = $data['cart'];
$totalPrice = 0;

// 2. Calculer le prix total sécurisé (côté serveur)
foreach ($cart as $item) {
    // On cherche le vrai prix en BDD pour éviter la triche en JS
    $stmt = $pdo->prepare("SELECT price FROM products WHERE id = ?");
    $stmt->execute([$item['id']]);
    $product = $stmt->fetch();
    
    if ($product) {
        $totalPrice += $product['price'] * $item['quantity'];
    }
}

try {
    // 3. Démarrer une "Transaction" (Si une étape plante, on annule tout pour éviter les bugs)
    $pdo->beginTransaction();

    // 4. Insérer la commande générale dans la table `orders`
    $stmt = $pdo->prepare("INSERT INTO orders (total_price, status) VALUES (?, 'en_attente')");
    $stmt->execute([$totalPrice]);
    
    // On récupère l'ID de la commande qui vient d'être créée
    $orderId = $pdo->lastInsertId();

    // 5. Insérer chaque produit du panier dans la table `order_items`
    $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    
    foreach ($cart as $item) {
        // On récupère à nouveau le vrai prix pour la sécurité
        $stmtPrice = $pdo->prepare("SELECT price FROM products WHERE id = ?");
        $stmtPrice->execute([$item['id']]);
        $prodPrice = $stmtPrice->fetchColumn();

        $stmtItem->execute([
            $orderId,
            $item['id'],
            $item['quantity'],
            $prodPrice
        ]);
    }

    // Si tout s'est bien passé, on valide définitivement dans la BDD
    $pdo->commit();

    // On renvoie une réponse positive au JavaScript
    echo json_encode(['success' => true, 'order_id' => $orderId]);

} catch (Exception $e) {
    // En cas d'erreur, on annule tout ce qui a été fait pendant la transaction
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde : ' . $e->getMessage()]);
}