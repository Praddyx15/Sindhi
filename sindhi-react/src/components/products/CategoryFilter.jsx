import React, { useRef } from 'react';
import { useProductContext } from '../../context/ProductContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryFilter = () => {
    const { categories, selectedCategory, setSelectedCategory } = useProductContext();
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const allCategories = ['All', ...Object.values(categories)];

    return (
        <div className="w-full bg-white border-b border-neutral-200 py-3 shadow-sm relative group">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-neutral-500 hover:text-primary border border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Categories Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/30 scale-105 border-transparent'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary/50 hover:text-primary hover:bg-neutral-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-neutral-500 hover:text-primary border border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default CategoryFilter;
