import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from './services/productApi';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';

const ProductsList = ({ selectedCategory, handleAddClick, cart = [], searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const unwantedTags = ['pet supplies', 'cat food', 'dog food', 'health supplements', 'condiments', 'cooking essentials'];
    if (p.tags.some(tag => unwantedTags.includes(tag.toLowerCase()))) return false;

    // Search Query Filter
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      return p.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-red-500 font-medium text-lg min-h-[50vh]">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-4 px-3 sm:px-4 lg:px-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-2 tracking-tight">
            {selectedCategory || 'Our Collection'}
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            Handpicked premium groceries just for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => {
            const isInCart = cart.some(item => item.id === product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col animate-slide-up"
              >
                <Link to={`/product/${product.id}`} className="relative pt-[90%] overflow-hidden bg-slate-100 block cursor-pointer">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md">
                      -{Math.round(product.discountPercentage)}%
                    </div>
                  )}
                </Link>

                <div className="p-3 flex flex-col flex-grow">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider truncate max-w-[60%]">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                      <FaStar />
                      <span className="text-slate-700 font-semibold">{product.rating}</span>
                    </div>
                  </div>

                  <Link to={`/product/${product.id}`} className="font-heading font-bold text-sm text-slate-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors block" title={product.title}>
                    {product.title}
                  </Link>

                  {/* ... rest of the card ... */}

                  <p className="text-slate-500 text-[10px] mb-3 line-clamp-2 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-900">
                        ${product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => !isInCart && handleAddClick({
                        id: product.id,
                        name: product.title,
                        price: product.price,
                        imageUrl: product.thumbnail,
                        quantity: 1
                      })}
                      disabled={isInCart}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-300 shadow-sm text-[11px]
                        ${isInCart
                          ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                          : 'bg-slate-900 hover:bg-primary-600 text-white hover:shadow hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                      {isInCart ? (
                        <>In Cart</>
                      ) : (
                        <>
                          <FaShoppingCart className="text-[10px]" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;