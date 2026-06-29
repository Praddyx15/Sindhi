import React, { useState, useEffect } from 'react';
import { useProductContext } from '../../context/ProductContext';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    Package,
    Search,
    Plus,
    Edit2,
    Trash2,
    X,
    Upload,
    Loader2,
    AlertCircle,
    CheckCircle,
    Square,
    CheckSquare,
    Minus as MinusIcon,
} from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, getCategories } from '../../services/api';

const ProductManagement = () => {
    const { products, loading: contextLoading, fetchProducts } = useProductContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        in_stock: true,
        stock_quantity: '',
        image: null
    });
    const [sizes, setSizes] = useState([{ size_name: '', price: '' }]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

    useEffect(() => {
        getCategories({ page_size: 100 })
            .then(data => setCategories(data.results || data))
            .catch(() => { });
    }, []);

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Open modal for adding new product
    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            category: '',
            in_stock: true,
            stock_quantity: '',
            image: null
        });
        setSizes([{ size_name: '', price: '' }]);
        setImagePreview(null);
        setError('');
        setSuccess('');
        setShowModal(true);
    };

    // Open modal for editing product
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            category: product.category,
            in_stock: product.in_stock,
            stock_quantity: product.stock_quantity || '',
            image: null
        });
        setSizes(
            product.sizes && product.sizes.length > 0
                ? product.sizes.map(s => ({ size_name: s.size_name, price: String(s.price) }))
                : [{ size_name: '', price: '' }]
        );
        setImagePreview(product.image);
        setError('');
        setSuccess('');
        setShowModal(true);
    };

    // Sizes helpers
    const updateSize = (index, field, value) => {
        setSizes(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    };
    const addSize = () => setSizes(prev => [...prev, { size_name: '', price: '' }]);
    const removeSize = (index) => setSizes(prev => prev.filter((_, i) => i !== index));

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate sizes
        const validSizes = sizes.filter(s => s.size_name.trim() && s.price !== '');
        if (validSizes.length === 0) {
            setError('At least one size with a name and price is required.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('in_stock', formData.in_stock);
            formDataToSend.append('sizes_input', JSON.stringify(
                validSizes.map(s => ({ size_name: s.size_name.trim(), price: parseFloat(s.price) }))
            ));
            if (formData.stock_quantity) {
                formDataToSend.append('stock_quantity', formData.stock_quantity);
            }
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            if (editingProduct) {
                await updateProduct(editingProduct.id, formDataToSend);
                setSuccess('Product updated successfully!');
            } else {
                await createProduct(formDataToSend);
                setSuccess('Product created successfully!');
            }

            await fetchProducts();

            setTimeout(() => {
                setShowModal(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    // Handle product deletion
    const handleDelete = async (productId) => {
        setLoading(true);
        try {
            await deleteProduct(productId);
            await fetchProducts();
            setDeleteConfirm(null);
            setSuccess('Product deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    // Bulk selection helpers
    const allVisibleIds = filteredProducts.map(p => p.id);
    const allSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.has(id));
    const someSelected = allVisibleIds.some(id => selectedIds.has(id)) && !allSelected;

    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? new Set() : new Set(allVisibleIds));
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Handle bulk deletion
    const handleBulkDelete = async () => {
        const count = selectedIds.size;
        const ids = [...selectedIds];
        setLoading(true);
        setBulkDeleteConfirm(false);
        try {
            await Promise.all(ids.map(id => deleteProduct(id)));
            setSelectedIds(new Set());
            await fetchProducts();
            setSuccess(`${count} product(s) deleted successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete selected products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header with Actions */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">Product Management</h1>
                        <p className="text-neutral-600 mt-1">{filteredProducts.length} products total</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add Product
                    </button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{success}</span>
                    </div>
                )}
                {error && !showModal && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white rounded-xl p-4 shadow-lg border border-neutral-200/50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Bulk Action Bar */}
                {selectedIds.size > 0 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-primary">
                            {selectedIds.size} product{selectedIds.size > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setBulkDeleteConfirm(true)}
                                disabled={loading}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete {selectedIds.size} product{selectedIds.size > 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-4 py-4 w-10">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="text-neutral-400 hover:text-primary transition-colors"
                                            title={allSelected ? 'Deselect all' : 'Select all'}
                                        >
                                            {allSelected
                                                ? <CheckSquare className="h-5 w-5 text-primary" />
                                                : someSelected
                                                    ? <CheckSquare className="h-5 w-5 text-primary/50" />
                                                    : <Square className="h-5 w-5" />
                                            }
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Image</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {contextLoading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                            <p className="text-neutral-600">Loading products...</p>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-neutral-600">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className={`hover:bg-neutral-50 transition-colors ${selectedIds.has(product.id) ? 'bg-primary/5' : ''}`}
                                        >
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleSelectOne(product.id)}
                                                    className="text-neutral-400 hover:text-primary transition-colors"
                                                >
                                                    {selectedIds.has(product.id)
                                                        ? <CheckSquare className="h-5 w-5 text-primary" />
                                                        : <Square className="h-5 w-5" />
                                                    }
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                                            🥘
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-neutral-800">{product.name}</p>
                                                {product.description && (
                                                    <p className="text-sm text-neutral-500 truncate max-w-xs">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700">{product.category}</td>
                                            <td className="px-6 py-4 font-semibold text-neutral-800">₹{product.price}</td>
                                            <td className="px-6 py-4 text-neutral-700">
                                                {product.stock_quantity || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${product.in_stock
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                        title="Edit product"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(product)}
                                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                        title="Delete product"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-neutral-800">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">{success}</span>
                                </div>
                            )}

                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Enter product name"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                                    placeholder="Enter product description"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sizes */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-neutral-700">
                                        Sizes &amp; Prices *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addSize}
                                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-600 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add Size
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {sizes.map((size, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Size (e.g. 250g)"
                                                value={size.size_name}
                                                onChange={(e) => updateSize(index, 'size_name', e.target.value)}
                                                className="flex-1 px-3 py-2.5 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                                            />
                                            <div className="relative w-32">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={size.price}
                                                    onChange={(e) => updateSize(index, 'price', e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSize(index)}
                                                disabled={sizes.length === 1}
                                                className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="Remove size"
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-neutral-400 mt-1.5">At least one size is required. The lowest price will be used as the display price.</p>
                            </div>

                            {/* Stock Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Enter stock quantity"
                                />
                            </div>

                            {/* In Stock Checkbox */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="in_stock"
                                    id="in_stock"
                                    checked={formData.in_stock}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-primary border-neutral-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="in_stock" className="text-sm font-semibold text-neutral-700">
                                    Product is in stock
                                </label>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Product Image
                                </label>
                                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                                    {imagePreview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, image: null }));
                                                }}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                                            <p className="text-neutral-600 mb-2">Click to upload or drag and drop</p>
                                            <p className="text-sm text-neutral-500">PNG, JPG, WEBP up to 10MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    {!imagePreview && (
                                        <label
                                            htmlFor="image-upload"
                                            className="mt-4 inline-block px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium text-neutral-700 cursor-pointer transition-colors"
                                        >
                                            Choose File
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Delete Confirmation Modal */}
            {bulkDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">
                                Delete {selectedIds.size} Product{selectedIds.size > 1 ? 's' : ''}?
                            </h3>
                            <p className="text-neutral-600">
                                This will permanently delete {selectedIds.size > 1 ? 'these products' : 'this product'}. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBulkDelete}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading
                                    ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Deleting...</span></>
                                    : <span>Delete {selectedIds.size} Product{selectedIds.size > 1 ? 's' : ''}</span>
                                }
                            </button>
                            <button
                                onClick={() => setBulkDeleteConfirm(false)}
                                className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Delete Product?</h3>
                            <p className="text-neutral-600">
                                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Delete</span>
                                )}
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductManagement;
