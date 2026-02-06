import React, { useEffect, useState } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, Edit2, LogOut, X } from 'lucide-react';

const AdminDashboard = () => {
    const { products, isAdmin, logout, updateProductConfig, categories, addProduct, deleteProduct } = useProductContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAdminProducts, setFilteredAdminProducts] = useState(products);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'Namkeen',
        image: '/assets/namkeen.png' // Default image
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        setFilteredAdminProducts(
            products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleStock = (id, currentStatus) => {
        updateProductConfig(id, { inStock: !currentStatus });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addProduct({
            ...newProduct,
            price: Number(newProduct.price)
        });
        setIsAddModalOpen(false);
        setNewProduct({ name: '', price: '', category: 'Namkeen', image: '/assets/namkeen.png' });
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-900 text-white px-3 py-1 rounded-lg font-bold text-sm">ADMIN</div>
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden md:block">Welcome, Admin</span>
                        <button
                            onClick={handleLogout}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{Object.keys(categories).length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Out of Stock</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {products.filter(p => p.inStock === false).length}
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full md:w-auto bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={18} />
                        Add New Product
                    </button>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAdminProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-md object-contain bg-gray-50 border border-gray-100" src={`/assets/${product.image.split('/').pop()}`} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => toggleStock(product.id, product.inStock)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                                            >
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-gray-400 hover:text-orange-600 transition-colors p-1">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        {Object.values(categories).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Default: /assets/namkeen.png</p>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20">
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
