import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ShoppingCart } from 'lucide-react';

const OrderManagement = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Order Management</h1>
                    <p className="text-neutral-600 mt-1">Track and manage customer orders</p>
                </div>

                {/* Coming Soon Placeholder */}
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-neutral-200/50 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-3">
                            Order Management Coming Soon
                        </h2>
                        <p className="text-neutral-600">
                            View and manage all customer orders, update order status, and track deliveries.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderManagement;
