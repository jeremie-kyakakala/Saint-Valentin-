// --------------------------
// RÉCUPÉRATION INFOS ENTREPRISE
// --------------------------
const companyData = JSON.parse(localStorage.getItem('companyData'));

if (!companyData) {
  alert("Accès non autorisé : veuillez d'abord configurer l'entreprise");
  window.location.href = 'create.html';
}

// Affichage infos entreprise
document.getElementById('companyLogo').src = companyData.logo;
document.getElementById('companyName').textContent = companyData.name;

// --------------------------
// DONNÉES SIMULÉES
// --------------------------

// Commandes : statut = "attente", "preparation", "pret"
let orders = [
  {
    id: 1,
    table: "T01",
    productName: "Riz + Poulet",
    quantity: 2,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=100&h=100&fit=crop",
    status: "attente"
  },
  {
    id: 2,
    table: "T04",
    productName: "Pâtes Carbonara",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=100&h=100&fit=crop",
    status: "attente"
  },
  {
    id: 3,
    table: "C02",
    productName: "Soda",
    quantity: 3,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
    status: "preparation"
  }
];

// Produits : disponible = true / false
let products = [
  { id: 1, name: "Riz + Poulet", price: "5 000 FC", available: true, image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=100&h=100&fit=crop" },
  { id: 2, name: "Pâtes Carbonara", price: "4 500 FC", available: true, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=100&h=100&fit=crop" },
  { id: 3, name: "Soda", price: "1 000 FC", available: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
  { id: 4, name: "Pain au chocolat", price: "1 500 FC", available: false, image: "" },
  { id: 5, name: "Eau minérale", price: "800 FC", available: true, image: "" }
];

// --------------------------
// AFFICHAGE COMMANDES
// --------------------------
function displayOrders() {
  const container = document.getElementById('ordersContainer');
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = '<p class="empty-message">Aucune commande pour le moment</p>';
    return;
  }

  // Tri : attente → préparation → prêt
  const orderSort = { "attente": 1, "preparation": 2, "pret": 3 };
  const sortedOrders = [...orders].sort((a, b) => orderSort[a.status] - orderSort[b.status]);

  sortedOrders.forEach(order => {
    const card = document.createElement('div');
    card.className = `order-card status-${order.status}`;

    let statusText;
    if (order.status === "attente") statusText = "En attente";
    if (order.status === "preparation") statusText = "En préparation";
    if (order.status === "pret") statusText = "Prêt";

    // Boutons selon statut
    let buttons = "";
    if (order.status === "attente") {
      buttons = `<button class="btn btn-start" onclick="changeStatus(${order.id}, 'preparation')">Commencer</button>`;
    } else if (order.status === "preparation") {
      buttons = `<button class="btn btn-finish" onclick="changeStatus(${order.id}, 'pret')">Terminer</button>`;
    } else if (order.status === "pret") {
      // ✅ Bouton SUPPRIMER uniquement si terminé
      buttons = `<button class="btn btn-delete" onclick="deleteOrder(${order.id})">Supprimer</button>`;
    }

    card.innerHTML = `
      <div class="order-header">
        <span class="table-code">${order.table}</span>
        <span class="order-status">${statusText}</span>
      </div>
      <div class="order-product">
        <img src="${order.image}" alt="${order.productName}" class="product-img">
        <div class="product-details">
          <h3>${order.productName}</h3>
          <p class="qty">Quantité : ${order.quantity}</p>
        </div>
      </div>
      <div class="order-actions">
        ${buttons}
      </div>
    `;

    container.appendChild(card);
  });
}

// --------------------------
// CHANGER STATUT COMMANDE
// --------------------------
function changeStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    displayOrders();
  }
}

// --------------------------
// ✅ SUPPRIMER COMMANDE TERMINÉE
// --------------------------
function deleteOrder(orderId) {
  orders = orders.filter(o => o.id !== orderId);
  displayOrders();
}

// --------------------------
// ✅ AJOUTER UN NOUVEAU PLAT
// --------------------------
const addProductForm = document.getElementById('addProductForm');
const newProductImage = document.getElementById('newProductImage');
const imagePreview = document.getElementById('imagePreview');
let newProductImageBase64 = "";

// Aperçu de l'image
newProductImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      newProductImageBase64 = evt.target.result;
      imagePreview.style.backgroundImage = `url(${newProductImageBase64})`;
      imagePreview.textContent = "";
    };
    reader.readAsDataURL(file);
  }
});

// Soumission formulaire
addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('newProductName').value.trim();
  const price = document.getElementById('newProductPrice').value;

  // Création nouvel objet produit
  const newProduct = {
    id: products.length + 1,
    name: name,
    price: price + " FC",
    available: true, // Par défaut disponible
    image: newProductImageBase64
  };

  // Ajout au tableau
  products.push(newProduct);

  // Réinitialisation formulaire
  addProductForm.reset();
  imagePreview.style.backgroundImage = "";
  imagePreview.textContent = "Aperçu";
  newProductImageBase64 = "";

  // Mise à jour affichage
  displayProducts();

  alert("✅ Plat publié avec succès !");
});

// --------------------------
// AFFICHAGE PRODUITS
// --------------------------
function displayProducts() {
  const container = document.getElementById('productsContainer');
  container.innerHTML = "";

  products.forEach(product => {
    const item = document.createElement('div');
    item.className = "product-item";

    item.innerHTML = `
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-price">${product.price}</p>
      </div>
      <button 
        class="btn-toggle ${product.available ? 'available' : 'unavailable'}" 
        onclick="toggleProduct(${product.id})"
      >
        ${product.available ? '✅ Disponible' : '❌ Indisponible'}
      </button>
    `;

    container.appendChild(item);
  });
}

// --------------------------
// ACTIVER/DÉSACTIVER PRODUIT
// --------------------------
function toggleProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.available = !product.available;
    displayProducts();
  }
}

// --------------------------
// INITIALISATION
// --------------------------
document.addEventListener('DOMContentLoaded', () => {
  displayOrders();
  displayProducts();
});