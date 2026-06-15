// --------------------------
// DONNÉES SIMULÉES
// --------------------------
const produits = [
    {
        id: 1,
        nom: "Poulet Frites",
        prix: 8.50,
        images: [
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Poulet+1",
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Poulet+2",
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Poulet+3"
        ]
    },
    {
        id: 2,
        nom: "Salade César",
        prix: 6.20,
        images: [
            "https://via.placeholder.com/300x200/222222/FFFFFF?text=Salade+1"
        ]
    },
    {
        id: 3,
        nom: "Burger Classique",
        prix: 7.80,
        images: [
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Burger+1",
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Burger+2"
        ]
    },
    {
        id: 4,
        nom: "Pâtes Carbonara",
        prix: 7.00,
        images: [
            "https://via.placeholder.com/300x200/222222/FFFFFF?text=Pates+1"
        ]
    },
    {
        id: 5,
        nom: "Dessert Chocolat",
        prix: 4.50,
        images: [
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Dessert+1",
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Dessert+2",
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Dessert+3",
            "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Dessert+4"
        ]
    }
];

// Panier : tableau d'objets { produit, quantite }
let panier = [];

// État modal image
let currentImages = [];
let currentImageIndex = 0;

// --------------------------
// ÉLÉMENTS DU DOM
// --------------------------
const productsGrid = document.getElementById('productsGrid');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModal');
const prevImageBtn = document.getElementById('prevImage');
const nextImageBtn = document.getElementById('nextImage');

const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const totalAmountEl = document.getElementById('totalAmount');
const validateOrderBtn = document.getElementById('validateOrder');

// --------------------------
// INITIALISATION
// --------------------------
document.addEventListener('DOMContentLoaded', () => {
    afficherProduits();
    ajouterEcouteursModaux();
    ajouterEcouteursPanier();
});

// --------------------------
// AFFICHAGE PRODUITS
// --------------------------
function afficherProduits() {
    productsGrid.innerHTML = '';

    produits.forEach(produit => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-images" data-images='${JSON.stringify(produit.images)}'>
                <img src="${produit.images[0]}" alt="${produit.nom}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-name">${produit.nom}</h3>
                <p class="product-price">${produit.prix.toFixed(2)} $</p>
                <button class="order-btn" data-id="${produit.id}">Commander</button>
            </div>
        `;

        productsGrid.appendChild(card);
    });

    // Écouteurs boutons commander
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            ajouterAuPanier(id);
        });
    });

    // Écouteurs images pour modal
    document.querySelectorAll('.product-images').forEach(container => {
        container.addEventListener('click', (e) => {
            currentImages = JSON.parse(container.dataset.images);
            currentImageIndex = 0;
            afficherImageModal();
            imageModal.classList.add('active');
        });
    });
}

// --------------------------
// MODAL IMAGE
// --------------------------
function afficherImageModal() {
    modalImage.src = currentImages[currentImageIndex];
}

function ajouterEcouteursModaux() {
    closeModalBtn.addEventListener('click', () => {
        imageModal.classList.remove('active');
    });

    prevImageBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        afficherImageModal();
    });

    nextImageBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        afficherImageModal();
    });

    // Fermer en cliquant sur l'overlay
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) imageModal.classList.remove('active');
    });
}

// --------------------------
// GESTION DU PANIER
// --------------------------
function ajouterAuPanier(idProduit) {
    const produit = produits.find(p => p.id === idProduit);
    const dansPanier = panier.find(item => item.produit.id === idProduit);

    if (dansPanier) {
        dansPanier.quantite++;
    } else {
        panier.push({ produit, quantite: 1 });
    }

    mettreAJourPanier();
}

function modifierQuantite(idProduit, nouvelleQuantite) {
    if (nouvelleQuantite <= 0) {
        panier = panier.filter(item => item.produit.id !== idProduit);
    } else {
        const item = panier.find(item => item.produit.id === idProduit);
        if (item) item.quantite = nouvelleQuantite;
    }

    mettreAJourPanier();
}

function calculerTotal() {
    return panier.reduce((somme, item) => {
        return somme + (item.produit.prix * item.quantite);
    }, 0);
}

function mettreAJourPanier() {
    // Mise à jour badge
    const totalArticles = panier.reduce((total, item) => total + item.quantite, 0);
    cartBadge.textContent = totalArticles;

    // Mise à jour liste panier
    if (panier.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        panier.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.produit.nom}</h4>
                    <p>${item.produit.prix.toFixed(2)} $ × ${item.quantite} = ${(item.produit.prix * item.quantite).toFixed(2)} $</p>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" data-id="${item.produit.id}" data-action="minus">-</button>
                    <span>${item.quantite}</span>
                    <button class="qty-btn" data-id="${item.produit.id}" data-action="plus">+</button>
                    <button class="remove-btn" data-id="${item.produit.id}">Supprimer</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        // Écouteurs boutons quantité
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const action = e.target.dataset.action;
                const item = panier.find(i => i.produit.id === id);
                if (item) {
                    modifierQuantite(id, action === 'plus' ? item.quantite + 1 : item.quantite - 1);
                }
            });
        });

        // Écouteurs supprimer
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                modifierQuantite(id, 0);
            });
        });
    }

    // Mise à jour total
    totalAmountEl.textContent = calculerTotal().toFixed(2);
}

function ajouterEcouteursPanier() {
    // Ouvrir/fermer panier
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    const fermerPanier = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    closeCartBtn.addEventListener('click', fermerPanier);
    cartOverlay.addEventListener('click', fermerPanier);

    // Validation commande
    validateOrderBtn.addEventListener('click', () => {
        if (panier.length === 0) {
            alert("Votre panier est vide !");
            return;
        }

        let resume = "📋 RÉSUMÉ DE LA COMMANDE :\n\n";
        panier.forEach(item => {
            resume += `- ${item.produit.nom} × ${item.quantite} : ${(item.produit.prix * item.quantite).toFixed(2)} $\n`;
        });
        resume += `\n💰 TOTAL : ${calculerTotal().toFixed(2)} $`;

        alert(resume);
        console.log("Commande envoyée :", panier, "Total :", calculerTotal());

        // Réinitialisation après envoi
        panier = [];
        mettreAJourPanier();
        fermerPanier();
    });
}