import { useNavigate, Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';
import { ShoppingBag, ChevronDown, ArrowRight } from 'lucide-react';

const HomePage = () => {
    const { products } = useProductContext();
    const navigate = useNavigate();

    // Extract Categories
    const categories = ['All', ...new Set(products.map(p => p.category))].filter(c => c !== 'All').slice(0, 8); // Show top 8 categories

    // Featured Products (Mock logic: take first 12 for now or random)
    // ideally we would mark them in data, but taking first 12 of different cats works for visual
    const featuredProducts = products.slice(0, 12);

    return (
        <div className="pb-20">
            {/* Premium Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-dark">
                {/* Background Image & Gradient */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transform transition-transform duration-[30s] ease-linear hover:scale-105"
                    style={{ backgroundImage: "url('/assets/hero.png')" }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1412]/70 via-[#1a1412]/40 to-[#1a1412]/80" />

                {/* Hero Content */}
                <div className="relative z-10 text-center max-w-[800px] px-4 mt-24">

                    {/* Badge */}
                    <div className="inline-block border border-secondary bg-secondary/10 rounded-full px-6 py-2 mb-8 animate-fade-in backdrop-blur-sm">
                        <span className="text-secondary tracking-[0.2em] text-xs font-bold uppercase">
                            Est. Since Years of Trust
                        </span>
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl font-bold text-white leading-none mb-6 tracking-tight drop-shadow-2xl">
                        Sindhi <br />
                        <span className="text-4xl md:text-5xl lg:text-6xl font-normal text-secondary tracking-wide mt-4 block font-display">
                            Namkeen & Dry Fruits
                        </span>
                    </h1>

                    <p className="font-display text-2xl md:text-3xl text-secondary-500 italic mb-6 font-medium tracking-wide drop-shadow-md">
                        Always Fresh, Crispy & Crunchy
                    </p>

                    <p className="text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Premium quality Indian snacks and dry fruits, crafted with tradition and served with love.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-primary-700 text-white rounded-full font-bold tracking-widest uppercase text-sm shadow-xl shadow-primary/20 hover:bg-primary-600 hover:scale-105 transition-all duration-300 min-w-[180px]"
                        >
                            Explore Products
                        </Link>
                        <Link
                            to="/#contact"
                            className="px-8 py-4 bg-transparent text-white border border-white/30 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-w-[180px]"
                        >
                            Visit Store
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
                    <span className="text-white text-xs tracking-[0.3em] uppercase">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                </div>
            </div>

            {/* Shop by Category */}
            <div className="py-20 px-6 w-full max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-neutral-900 mb-4">Shop by Category</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, index) => {
                        // Cyclic gradients for visual variety
                        const gradients = [
                            'from-orange-50 to-amber-100',
                            'from-rose-50 to-pink-100',
                            'from-emerald-50 to-green-100',
                            'from-blue-50 to-indigo-100',
                            'from-purple-50 to-violet-100',
                            'from-teal-50 to-cyan-100'
                        ];
                        const gradient = gradients[index % gradients.length];

                        return (
                            <Link
                                key={cat}
                                to={`/products?category=${cat}`}
                                className="group relative h-48 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

                                {/* Decorative Circle */}
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4 text-center">
                                    <span className="font-display text-lg md:text-xl font-bold text-neutral-800 group-hover:scale-105 transition-transform">
                                        {cat}
                                    </span>
                                    <span className="text-xs text-neutral-500 mt-2 font-medium bg-white/60 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        View Collection
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className="text-center mt-12">
                    <Link to="/products" className="text-primary font-medium hover:text-primary-700 flex items-center justify-center gap-2">
                        View all categories <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Featured Products (Most Ordered) */}
            <div className="py-20 bg-neutral-50">
                <div className="w-full max-w-[1200px] mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Collection</span>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mt-3">Premium Products</h2>
                            <p className="text-neutral-500 mt-2">Handpicked selections of the finest namkeen and dry fruits</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.name} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                            View All Products <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* About & Contact */}
            <AboutSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;
