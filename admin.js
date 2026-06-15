 // --------------------------
// UTILITAIRES
// --------------------------

// Générer un ID unique de 6 caractères
function generateUniqueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Sauvegarder dans localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Récupérer depuis localStorage
function getFromStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// --------------------------
// PAGE CRÉATION COMPTE
// --------------------------
if (document.getElementById('createForm')) {
  const form = document.getElementById('createForm');
  const logoInput = document.getElementById('companyLogo');
  const logoPreview = document.getElementById('logoPreview');

  // Aperçu du logo
  logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        logoPreview.style.backgroundImage = `url(${evt.target.result})`;
        logoPreview.textContent = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // Soumission du formulaire
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const companyName = document.getElementById('companyName').value.trim();
    const companyType = document.querySelector('input[name="companyType"]:checked').value;
    const logoFile = logoInput.files[0];

    if (!logoFile) return alert('Veuillez ajouter un logo');

    // Lire le logo en base64
    const reader = new FileReader();
    reader.onload = (evt) => {
      const companyData = {
        id: generateUniqueId(),
        name: companyName,
        type: companyType,
        logo: evt.target.result
      };

      // Sauvegarde
      saveToStorage('companyData', companyData);

      // Redirection
      window.location.href = 'admin.html';
    };
    reader.readAsDataURL(logoFile);
  });
}

// --------------------------
// PAGE ADMIN
// --------------------------
if (document.querySelector('.page-admin')) {
  // Vérifier si l'entreprise existe
  const companyData = getFromStorage('companyData');
  if (!companyData) {
    alert('Veuillez d\'abord créer votre espace');
    window.location.href = 'create.html';
  }

  // Données simulées : commandes validées uniquement
  const salesData = [
    { product: 'Riz + Poulet', quantity: 2, price: 5000 },
    { product: 'Soda', quantity: 3, price: 1000 },
    { product: 'Pain au chocolat', quantity: 5, price: 1500 },
    { product: 'Eau minérale', quantity: 4, price: 800 }
  ];

  // Initialisation interface
  document.addEventListener('DOMContentLoaded', () => {
    // Infos entreprise dans la sidebar
    document.getElementById('sidebarLogo').src = companyData.logo;
    document.getElementById('sidebarName').textContent = companyData.name;

    // Générer les liens d'accès
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '');
    document.getElementById('linkAdmin').value = `${baseUrl}admin/${companyData.id}`;
    document.getElementById('linkCuisine').value = `${baseUrl}cuisine/${companyData.id}`;
    document.getElementById('linkMenu').value = `${baseUrl}menu/${companyData.id}`;

    // Calculs statistiques
    const totalOrders = salesData.length;
    const totalProductsSold = salesData.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = salesData.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Affichage statistiques
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalProductsSold').textContent = totalProductsSold;
    document.getElementById('totalRevenue').textContent = totalRevenue + ' FC';

    // Remplir tableau des ventes
    const tableBody = document.getElementById('salesTableBody');
    let grandTotal = 0;

    salesData.forEach(item => {
      const lineTotal = item.quantity * item.price;
      grandTotal += lineTotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.product}</td>
        <td>${item.quantity}</td>
        <td>${item.price} FC</td>
        <td>${lineTotal} FC</td>
      `;
      tableBody.appendChild(row);
    });

    // Total général
    document.getElementById('grandTotal').textContent = grandTotal + ' FC';

    // Navigation entre sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Retirer actif
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        // Ajouter actif
        link.classList.add('active');
        const target = link.getAttribute('data-section');
        document.getElementById(target).classList.add('active');
      });
    });

    // Copier les liens
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.select();
        navigator.clipboard.writeText(input.value);
        btn.textContent = 'Copié !';
        setTimeout(() => btn.textContent = 'Copier', 2000);
      });
    });

    // Toggle menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');

    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      mainWrapper.classList.toggle('sidebar-active');
    });

    // Déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
      // On ne supprime pas les données, juste retour à la création
      window.location.href = 'create.html';
    });
  });
}