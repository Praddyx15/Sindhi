/**
 * Admin Dashboard Logic
 */

window.SindhiApp = window.SindhiApp || {};

(function () {
    'use strict';

    // Services
    const ProductService = window.SindhiApp.Services.Products;
    const OrderService = window.SindhiApp.Services.Orders;

    // State
    let editingProductId = null;

    // DOM Elements
    const els = {};

    document.addEventListener('DOMContentLoaded', () => {
        cacheElements();
        checkAuth();
        bindEvents();
    });

    function cacheElements() {
        els.loginSection = document.getElementById('loginSection');
        els.dashboardSection = document.getElementById('dashboardSection');
        els.loginForm = document.getElementById('loginForm');
        els.logoutBtn = document.getElementById('logoutBtn');
        els.productModal = document.getElementById('productModal');
        els.productForm = document.getElementById('productForm');
        els.totalProducts = document.getElementById('totalProducts');
        els.totalOrders = document.getElementById('totalOrders');
        els.inventoryBody = document.getElementById('inventoryTableBody');
        els.ordersBody = document.getElementById('ordersTableBody');
    }

    function bindEvents() {
        els.loginForm.addEventListener('submit', handleLogin);
        els.productForm.addEventListener('submit', handleSaveProduct);
        els.logoutBtn.addEventListener('click', logout);

        window.onclick = (e) => {
            if (e.target === els.productModal) closeModal();
        };

        // Tab Switching
        window.switchTab = function (tabName) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Find clicked button (this approach relies on inline onclick, which we should ideally replace, but for now we keep it compatible with HTML)
            // Better: event delegation or finding button by text/attribute.
            // Since onclick="switchTab()" is in HTML, event.target works.
            if (event && event.target) event.target.classList.add('active');

            document.getElementById(`${tabName}Tab`).classList.add('active');
        };

        // Expose global functions for HTML onclicks
        window.openProductModal = openProductModal;
        window.closeModal = closeModal;
        window.editProduct = editProduct;
        window.deleteProduct = deleteProduct;
        window.logout = logout;
    }

    /* ===================================
       AUTH
       =================================== */

    function checkAuth() {
        if (localStorage.getItem('adminUser')) {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;

        if (u === 'admin' && p === 'admin123') {
            localStorage.setItem('adminUser', u);
            showDashboard();
        } else {
            alert('Invalid credentials');
        }
    }

    function logout() {
        localStorage.removeItem('adminUser');
        showLogin();
    }

    function showLogin() {
        els.loginSection.style.display = 'block';
        els.dashboardSection.style.display = 'none';
        els.logoutBtn.style.display = 'none';
    }

    function showDashboard() {
        els.loginSection.style.display = 'none';
        els.dashboardSection.style.display = 'block';
        els.logoutBtn.style.display = 'block';
        updateDashboard();
    }

    /* ===================================
       DASHBOARD LOGIC
       =================================== */

    function updateDashboard() {
        const products = ProductService.getAll();
        const orders = OrderService.getAll();

        els.totalProducts.innerText = products.length;
        els.totalOrders.innerText = orders.length;

        renderInventory(products);
        renderOrders(orders);
    }

    function renderInventory(products) {
        els.inventoryBody.innerHTML = products.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td><img src="${p.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
                <td><strong>${p.name}</strong></td>
                <td><span style="padding: 2px 8px; background: #eee; border-radius: 12px; font-size: 0.8em;">${p.category}</span></td>
                <td>₹${p.price}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function renderOrders(orders) {
        els.ordersBody.innerHTML = orders.map(o => {
            let color = o.status === 'Delivered' ? '#5cb85c' : o.status === 'Processing' ? '#5bc0de' : '#f0ad4e';
            return `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.customer}</td>
                    <td>${o.items}</td>
                    <td>₹${o.total}</td>
                    <td><span style="padding: 2px 8px; background: ${color}; color: white; border-radius: 4px; font-size: 0.8em;">${o.status}</span></td>
                    <td><button class="action-btn" onclick="alert('Details coming soon')">View</button></td>
                </tr>
            `;
        }).join('');
    }

    /* ===================================
       CRUD ACTIONS
       =================================== */

    function openProductModal(product = null) {
        const title = document.getElementById('modalTitle');
        const idInput = document.getElementById('editProductId');
        const nameInput = document.getElementById('prodName');
        const catInput = document.getElementById('prodCategory');
        const priceInput = document.getElementById('prodPrice');

        if (product) {
            title.innerText = 'Edit Product';
            editingProductId = product.id;
            idInput.value = product.id;
            nameInput.value = product.name;
            catInput.value = product.category;
            priceInput.value = product.price;
        } else {
            title.innerText = 'Add New Product';
            editingProductId = null;
            idInput.value = '';
            nameInput.value = '';
            catInput.value = 'Namkeen';
            priceInput.value = '';
        }
        els.productModal.classList.add('active');
    }

    function closeModal() {
        els.productModal.classList.remove('active');
    }

    function editProduct(id) {
        const products = ProductService.getAll();
        const p = products.find(x => x.id === id);
        if (p) openProductModal(p);
    }

    function deleteProduct(id) {
        if (confirm('Delete this product?')) {
            ProductService.delete(id);
            updateDashboard();
        }
    }

    function handleSaveProduct(e) {
        e.preventDefault();
        const name = document.getElementById('prodName').value;
        const category = document.getElementById('prodCategory').value;
        const price = parseInt(document.getElementById('prodPrice').value);

        // Demo image logic
        let image = 'assets/namkeen.png';
        if (category === 'Sweet') image = 'assets/hero.png';
        if (category === 'Dry Fruits') image = 'assets/dryfruits.png';

        const data = { name, category, price, image, rating: 4.5, reviews: 0 };

        if (editingProductId) {
            data.id = editingProductId;
            // Since we don't have a real update method in Service that merges, we can use our updated logic
            ProductService.update(data);
        } else {
            ProductService.add(data);
        }

        closeModal();
        updateDashboard();
    }

})();
