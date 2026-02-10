import React, { useState } from 'react';
import { useProductContext } from '../../context/ProductContext';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    FolderOpen,
    Search,
    Plus,
    Edit2,
    Trash2,
    X,
    Upload,
    Loader2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '../../services/api';

const CategoryManagement = () => {
    const { fullCategories, loading: contextLoading, fetchCategories } = useProductContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filter categories based on search
    const filteredCategories = fullCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Auto-generate slug from name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            // Auto-generate slug when name changes
            if (name === 'name' && !editingCategory) {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
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

    // Open modal for adding new category
    const handleAddNew = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            image: null
        });
        setImagePreview(null);
        setError('');
        setSuccess('');
        setShowModal(true);
    };

    // Open modal for editing category
    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image: null
        });
        setImagePreview(category.image);
        setError('');
        setSuccess('');
        setShowModal(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('slug', formData.slug);
            if (formData.description) {
                formDataToSend.append('description', formData.description);
            }
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            if (editingCategory) {
                await updateCategory(editingCategory.id, formDataToSend);
                setSuccess('Category updated successfully!');
            } else {
                await createCategory(formDataToSend);
                setSuccess('Category created successfully!');
            }

            // Refresh categories list
            await fetchCategories();

            // Close modal after short delay
            setTimeout(() => {
                setShowModal(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    // Handle category deletion
    const handleDelete = async (categoryId) => {
        setLoading(true);
        try {
            await deleteCategory(categoryId);
            await fetchCategories();
            setDeleteConfirm(null);
            setSuccess('Category deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete category');
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
                        <h1 className="text-2xl font-bold text-neutral-800">Category Management</h1>
                        <p className="text-neutral-600 mt-1">{filteredCategories.length} categories total</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add Category
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
                            placeholder="Search categories by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {contextLoading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                            <p className="text-neutral-600 ml-3">Loading categories...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-neutral-600">
                            No categories found
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden hover:shadow-xl transition-all group"
                            >
                                {/* Category Image */}
                                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center overflow-hidden">
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <span className="text-6xl opacity-30">🥘</span>
                                    )}
                                </div>

                                {/* Category Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-neutral-800 mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-1">
                                        Slug: {category.slug}
                                    </p>
                                    {category.description && (
                                        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                                            {category.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-200">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(category)}
                                            className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-neutral-800">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
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

                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Enter category name"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="category-slug"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    Auto-generated from name. Use lowercase letters, numbers, and hyphens only.
                                </p>
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
                                    placeholder="Enter category description"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Category Image
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
                                            <p className="text-sm text-neutral-500">PNG, JPG up to 10MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="category-image-upload"
                                    />
                                    {!imagePreview && (
                                        <label
                                            htmlFor="category-image-upload"
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
                                        <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
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

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Delete Category?</h3>
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

export default CategoryManagement;
