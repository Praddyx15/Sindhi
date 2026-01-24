/**
 * Data Service
 * Handles all data operations for Products and Orders.
 * Uses StorageService for persistence.
 */

window.SindhiApp = window.SindhiApp || {};
window.SindhiApp.Services = window.SindhiApp.Services || {};

(function () {
    'use strict';

    const Storage = window.SindhiApp.Services.Storage;

    // specific category constants
    const CATEGORIES = {
        SWEET: 'Sweet',
        NAMKEEN: 'Namkeen',
        DRY_FRUITS: 'Dry Fruits'
    };

    // Base products to generate variations from
    const BASE_PRODUCTS = [
        { name: 'Classic Salted', category: CATEGORIES.NAMKEEN, basePrice: 150, image: 'assets/namkeen.png' },
        { name: 'Spicy Masala', category: CATEGORIES.NAMKEEN, basePrice: 160, image: 'assets/namkeen.png' },
        { name: 'Aloo Bhujia', category: CATEGORIES.NAMKEEN, basePrice: 180, image: 'assets/namkeen.png' },
        { name: 'Navratan Mix', category: CATEGORIES.NAMKEEN, basePrice: 200, image: 'assets/namkeen.png' },
        { name: 'Moong Dal', category: CATEGORIES.NAMKEEN, basePrice: 170, image: 'assets/namkeen.png' },
        { name: 'Kaju Katli', category: CATEGORIES.SWEET, basePrice: 800, image: 'assets/hero.png' },
        { name: 'Gulab Jamun', category: CATEGORIES.SWEET, basePrice: 300, image: 'assets/hero.png' },
        { name: 'Rasgulla', category: CATEGORIES.SWEET, basePrice: 280, image: 'assets/hero.png' },
        { name: 'Soan Papdi', category: CATEGORIES.SWEET, basePrice: 250, image: 'assets/hero.png' },
        { name: 'Premium Almonds', category: CATEGORIES.DRY_FRUITS, basePrice: 900, image: 'assets/dryfruits.png' },
        { name: 'Cashews', category: CATEGORIES.DRY_FRUITS, basePrice: 850, image: 'assets/dryfruits.png' },
        { name: 'Pistachios', category: CATEGORIES.DRY_FRUITS, basePrice: 1200, image: 'assets/dryfruits.png' },
        { name: 'Walnuts', category: CATEGORIES.DRY_FRUITS, basePrice: 1100, image: 'assets/dryfruits.png' },
        { name: 'Raisins', category: CATEGORIES.DRY_FRUITS, basePrice: 400, image: 'assets/dryfruits.png' }
    ];

    // Generate 400 products
    function generateProducts() {
        let products = [];
        for (let i = 1; i <= 400; i++) {
            const base = BASE_PRODUCTS[Math.floor(Math.random() * BASE_PRODUCTS.length)];
            products.push({
                id: i,
                name: `${base.name} - Pack ${i}`,
                category: base.category,
                price: base.basePrice + Math.floor(Math.random() * 50),
                image: base.image,
                rating: (4 + Math.random()).toFixed(1),
                reviews: Math.floor(Math.random() * 500)
            });
        }
        return products;
    }

    // Initialize data logic
    function initData() {
        if (!Storage.get('products')) {
            const products = generateProducts();
            Storage.set('products', products);
        }
        if (!Storage.get('orders')) {
            Storage.set('orders', []);
        }
    }

    // Product Service
    const ProductService = {
        getAll: () => {
            return Storage.get('products', []);
        },
        getByCategory: (category) => {
            const products = ProductService.getAll();
            if (category === 'All') return products;
            return products.filter(p => p.category === category);
        },
        add: (product) => {
            const products = ProductService.getAll();
            product.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.unshift(product);
            Storage.set('products', products);
            return product;
        },
        update: (product) => {
            let products = ProductService.getAll();
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) {
                products[index] = product;
                Storage.set('products', products);
                return true;
            }
            return false;
        },
        delete: (id) => {
            let products = ProductService.getAll();
            products = products.filter(p => p.id !== id);
            Storage.set('products', products);
        }
    };

    // Order Service
    const OrderService = {
        getAll: () => {
            return Storage.get('orders', []);
        },
        add: (order) => {
            const orders = OrderService.getAll();
            order.id = Date.now();
            order.date = new Date().toISOString();
            order.status = 'Pending';
            orders.unshift(order);
            Storage.set('orders', orders);
            return order;
        }
    };

    // Initialize on load
    initData();

    // Expose
    window.SindhiApp.Services.Products = ProductService;
    window.SindhiApp.Services.Orders = OrderService;

})();
