import React, { useState } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const { login, isAdmin } = useProductContext();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/admin/dashboard');
            } else {
                setError('Invalid credentials or insufficient permissions');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 px-4 py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Login Card */}
            <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-neutral-200/50 backdrop-blur-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-br from-primary to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
                        <Lock className="text-white h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                        Sindhi Namkeen
                    </h1>
                    <h2 className="text-xl font-semibold text-neutral-700 mb-1">
                        Admin Portal
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Sign in with your superuser credentials
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-shake">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-neutral-800 placeholder:text-neutral-400"
                            placeholder="Enter your username"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-neutral-800 placeholder:text-neutral-400"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                    <p className="text-xs text-center text-neutral-500">
                        Protected area. Authorized personnel only.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
