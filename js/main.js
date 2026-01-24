/**
 * Main Application Logic
 * Orchestrates UI, Navigation, and Product Rendering.
 */

window.SindhiApp = window.SindhiApp || {};

(function () {
    'use strict';

    // Services
    const ProductService = window.SindhiApp.Services.Products;

    // Constants
    const ITEMS_PER_PAGE = 12;

    // State
    let state = {
        currentCategory: 'All',
        currentPage: 1
    };

    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });

    function initApp() {
        console.log('Sindhi App Initializing...');
        initPillNavigation();
        initMobileMenu();
        initSmoothScroll();
        initScrollReveal();
        initHeaderScroll();
        initProductCatalog();
    }

    /* ===================================
       PRODUCT CATALOG LOGIC
       =================================== */

    function initProductCatalog() {
        setupFilterButtons();
        loadProducts();
    }

    function setupFilterButtons() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active UI
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update State
                state.currentCategory = btn.dataset.filter;
                state.currentPage = 1;
                loadProducts();
            });
        });
    }

    function loadProducts() {
        const grid = document.getElementById('productsGrid');
        const pagination = document.getElementById('pagination');

        if (!grid) return;

        const products = ProductService.getByCategory(state.currentCategory);

        // Pagination
        const start = 0;
        const end = state.currentPage * ITEMS_PER_PAGE;
        const displayed = products.slice(start, end);
        const hasMore = products.length > end;

        // Render
        if (state.currentPage === 1) {
            grid.innerHTML = displayed.map(createProductCard).join('');
        } else {
            const newProducts = products.slice((state.currentPage - 1) * ITEMS_PER_PAGE, end);
            grid.insertAdjacentHTML('beforeend', newProducts.map(createProductCard).join(''));
        }

        // Animate new
        const newCards = grid.querySelectorAll('.product-card:not(.reveal)');
        requestAnimationFrame(() => {
            newCards.forEach(card => card.classList.add('reveal', 'active'));
        });

        // Load More Button
        if (hasMore) {
            pagination.innerHTML = `<button class="load-more-btn" id="loadMoreBtn">Load More (${products.length - end} remaining)</button>`;
            document.getElementById('loadMoreBtn').addEventListener('click', () => {
                state.currentPage++;
                loadProducts();
            });
        } else {
            pagination.innerHTML = '';
        }
    }

    function createProductCard(product) {
        return `
            <article class="product-card">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-overlay">
                        <span class="product-tag">${product.category}</span>
                    </div>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">
                        Premium quality ${product.name.toLowerCase()}. Fresh and authentic.
                        <br>
                        <strong>₹${product.price}</strong> <small>(${product.reviews} reviews)</small>
                    </p>
                    <div class="product-features">
                        <button class="btn btn-primary js-add-cart" data-id="${product.id}" style="padding: 0.5rem 1rem; width: 100%;">Add to Cart</button>
                    </div>
                </div>
            </article>
        `;
    }

    // Event delegation for dynamic elements
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-add-cart')) {
            const id = e.target.dataset.id;
            alert(`Product ${id} added to cart!`);
        }
    });

    /* ===================================
       UI INTERACTIONS (Navigation, etc)
       =================================== */

    function initPillNavigation() {
        const pillNav = document.getElementById('pillNav');
        const pillIndicator = document.getElementById('pillIndicator');
        const navItems = document.querySelectorAll('.pill-nav-item');

        if (!pillNav || !pillIndicator) return;

        function updateIndicator(item) {
            const itemRect = item.getBoundingClientRect();
            const navRect = pillNav.getBoundingClientRect();
            pillIndicator.style.width = `${itemRect.width}px`;
            pillIndicator.style.left = `${itemRect.left - navRect.left}px`;
        }

        const activeItem = pillNav.querySelector('.active');
        if (activeItem) setTimeout(() => updateIndicator(activeItem), 100);

        navItems.forEach(item => {
            item.addEventListener('click', function () {
                navItems.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
                updateIndicator(this);
            });
        });

        // Scroll listener for active link
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                const sections = ['home', 'products', 'about', 'contact'];
                const scrollPos = window.scrollY + 200;

                for (let id of sections) {
                    const el = document.getElementById(id);
                    if (el && el.offsetTop <= scrollPos) {
                        navItems.forEach(n => {
                            n.classList.remove('active');
                            if (n.dataset.section === id) {
                                n.classList.add('active');
                                updateIndicator(n);
                            }
                        });
                    }
                }
            });
        });
    }

    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const nav = document.getElementById('mobileNav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    window.scrollTo({
                        top: target.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none';
        });
    }

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-card, .section-header, .about-feature').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

})();
