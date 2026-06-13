import React, { useState } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { Plus, ShoppingBag, X } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useProductContext();
    const [showSizeSelector, setShowSizeSelector] = useState(false);

    const handleAddToCart = () => {
        if (!product.sizes || product.sizes.length <= 1) {
            addToCart(product, product.sizes?.[0] ?? null);
        } else {
            setShowSizeSelector(true);
        }
    };

    return (
        <div className="group bg-white rounded-[1rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-neutral-100 flex flex-col h-full">

            {/* Image Container - Matches HTML height 280px */}
            <div className="relative h-[280px] w-full overflow-hidden bg-neutral-100">
                <span className="absolute top-4 left-4 z-10 bg-primary/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-widest uppercase text-white shadow-md">
                    {product.category}
                </span>

                <img
                    src={product.image && product.image.startsWith('http') ? product.image : `/assets/${(product.image || 'namkeen.png').split('/').pop()}`}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                />
            </div>

            {/* Content - Matches HTML padding 2rem (32px) */}
            <div className="p-8 flex-grow flex flex-col">
                <div className="flex-grow">
                    <h3 className="font-display text-2xl font-bold text-neutral-900 leading-tight mb-3 line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="mb-6 font-normal leading-relaxed text-base text-neutral-600">
                        <span className="line-clamp-2">
                            Premium quality {product.name.toLowerCase()}. Fresh and authentic.
                        </span>
                        <div className="mt-3 text-neutral-900">
                            {product.discount > 0 ? (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-neutral-400 line-through text-sm">₹{product.price}</span>
                                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                            {Math.round(product.discount)}% OFF
                                        </span>
                                    </div>
                                    <strong className="text-lg text-primary">
                                        {product.sizes && product.sizes.length > 1 ? 'From ' : ''}₹{product.effectivePrice}
                                    </strong>
                                </div>
                            ) : (
                                <strong className="text-lg">
                                    {product.sizes && product.sizes.length > 1 ? 'From ' : ''}₹{product.price}
                                </strong>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-0">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-gradient-to-br from-primary to-primary-600 text-white py-2 rounded-full font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center group/btn"
                    >
                        {product.sizes && product.sizes.length > 1 ? 'Choose Size' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Size Selector Modal */}
            {showSizeSelector && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowSizeSelector(false)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-neutral-800">Select Size</h3>
                            <button
                                onClick={() => setShowSizeSelector(false)}
                                className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-neutral-500 mb-4 line-clamp-1">{product.name}</p>
                        <div className="space-y-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => {
                                        addToCart(product, size);
                                        setShowSizeSelector(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 border-2 border-neutral-200 hover:border-primary hover:bg-primary/5 rounded-xl transition-all group"
                                >
                                    <span className="font-semibold text-neutral-800 group-hover:text-primary">{size.size_name}</span>
                                    <div className="text-right">
                                        {product.discount > 0 ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-neutral-400 line-through">₹{size.price}</span>
                                                <span className="font-bold text-primary">₹{size.effective_price}</span>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-primary">₹{size.price}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
