import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as REAL_PRODUCTS, CATEGORIES } from '../data/products';

const ProductContext = createContext();

export const useProductContext = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isAdmin, setIsAdmin] = useState(false);

    // Initialize Products
    useEffect(() => {
        // In a real app, we might check localStorage or an API here
        // For now, mapping real products to add IDs if strictly necessary, 
        // though index-based IDs are used in the legacy data.js
        const initializedProducts = REAL_PRODUCTS.map((p, index) => ({
            id: index + 1,
            ...p,
            inStock: true,
            rating: (4.5 + Math.random() * 0.5).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 50
        }));
        setProducts(initializedProducts);
    }, []);

    // Load Cart from LocalStorage
    useEffect(() => {
        const storedCart = localStorage.getItem('sindhi_cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('sindhi_cart', JSON.stringify(cart));
    }, [cart]);

    // Cart Operations
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    // Admin Operations
    const login = (username, password) => {
        if (username === 'admin' && password === 'admin123') {
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logout = () => setIsAdmin(false);

    const updateProductConfig = (productId, updates) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    };

    const addProduct = (newProduct) => {
        setProducts(prev => {
            const maxId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) : 0;
            return [...prev, { ...newProduct, id: maxId + 1, inStock: true, rating: 0, reviews: 0 }];
        });
    };

    const deleteProduct = (productId) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        removeFromCart(productId);
    };

    // Derived State
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const value = {
        products,
        categories: CATEGORIES,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        cartTotal,
        cartCount,
        isAdmin,
        login,
        logout,
        updateProductConfig,
        addProduct,
        deleteProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
