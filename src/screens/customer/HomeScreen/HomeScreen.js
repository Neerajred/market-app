import React, { useEffect, useRef, useState } from 'react';
import { AiFillPlusCircle, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import RatingStar from './RatingStar';
import { wishlistAPI } from '../../../services/api';

import { useToast } from '../../Toast/ToastProvider';

const Home = ({ categories, selectedCategory, products, handleAddClick, handleRemoveClick, cartItems, searchQuery }) => {
  const { addToast } = useToast();
  const contentRef = useRef(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    fetchWishlist();
  }, [selectedCategory]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await wishlistAPI.getWishlist();
      if (res.success) {
        // IDs from database might be strings (UUID or stringified int), 
        // static IDs are numbers. Converting all to String for robust comparison.
        const ids = new Set(res.wishlist.map(item => String(item.productId)));
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error('Wishlist sync failed:', err);
    }
  };

  const toggleWishlist = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast("Please login to save your wishlist!", 'info');
      return;
    }

    const prodIdStr = String(product.id);

    try {
      if (wishlistIds.has(prodIdStr)) {
        await wishlistAPI.removeFromWishlist(product.id);
        const newIds = new Set(wishlistIds);
        newIds.delete(prodIdStr);
        setWishlistIds(newIds);
      } else {
        await wishlistAPI.addToWishlist(product.id);
        const newIds = new Set(wishlistIds);
        newIds.add(prodIdStr);
        setWishlistIds(newIds);
      }
    } catch (err) {
      console.error('Toggle wishlist error:', err);
    }
  };

  // Filter products by both category (selection or all) and search query
  const filteredProducts = products ? products.filter(p =>
    p.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  ) : [];

  const getCategoryContent = () => {
    const orderedCategories = selectedCategory
      ? [selectedCategory, ...categories.filter((cat) => cat !== selectedCategory)]
      : categories;

    return orderedCategories.map((category) => {
      const sectionProducts = filteredProducts.filter((product) => product.category === category);
      if (sectionProducts.length === 0) return null; // Hide categories with no matches

      return (
        <div key={category} className='flex flex-col gap-3 mb-6 animate-fadeIn'>
          <h2 className='font-black text-lg sm:text-xl text-gray-800 border-b-2 border-green-500 pb-1 w-fit'>{category}</h2>
          <section className='overflow-x-auto scrollbar-hide'>
            <div className="products flex gap-4 pb-4 px-1">
              {sectionProducts.map((product) => {
                const isInCart = cartItems.some((item) => String(item.id) === String(product.id));
                const isWishlisted = wishlistIds.has(String(product.id));

                return (
                  <div
                    key={product.id}
                    className="relative min-w-[140px] sm:min-w-[160px] md:min-w-[180px] bg-white flex flex-col gap-2 p-3 justify-between shadow-sm rounded-[1.5rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-green-100"
                  >
                    <div className='p-2 w-full h-28 sm:h-36 flex items-center justify-center bg-gray-50 rounded-2xl relative overflow-hidden group'>
                      <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors" />
                      <img
                        className='max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-110'
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <p className='text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none'>{product.category}</p>
                      <h3 className='font-black text-xs sm:text-sm text-gray-900 truncate'>{product.name}</h3>
                      <div><RatingStar value={product.rating} /></div>
                      <p className='text-sm sm:text-base font-black text-green-600 tracking-tight'>₹{product.price}</p>

                      {/* Action Row: Wishlist and AddToCart Side-by-Side */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                          className={`flex items-center justify-center p-2.5 rounded-2xl border transition-all ${isWishlisted
                            ? 'bg-red-50 text-red-500 border-red-100 shadow-sm'
                            : 'bg-white text-gray-300 border-gray-100 hover:text-red-400 hover:border-red-50 hover:bg-red-50/30'
                            }`}
                          title="Wishlist"
                        >
                          {isWishlisted ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
                        </button>

                        {isInCart ? (
                          <button
                            className='flex-1 flex items-center justify-center gap-1 bg-white text-red-600 border border-red-100 py-2.5 rounded-2xl hover:bg-red-50 transition-all font-black uppercase text-[9px] tracking-wider'
                            onClick={(e) => { e.stopPropagation(); handleRemoveClick(product); }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className='flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-2xl hover:bg-green-700 shadow-md shadow-green-50 transition-all active:scale-95 font-black uppercase text-[9px] tracking-widest'
                            onClick={(e) => { e.stopPropagation(); handleAddClick(product); }}
                          >
                            <AiFillPlusCircle className='text-sm' />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      );
    });

  }
  return (
    <main ref={contentRef} className="content min-h-full overflow-y-auto bg-gray-50 p-2 sm:p-2 lg:p-6 w-full lg:w-auto lg:flex-1 custom-scrollbar">
      {getCategoryContent()}
    </main>
  );
};

export default Home;
