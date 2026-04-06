import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ChevronLeft } from 'lucide-react';
import { wishlistAPI } from '../../../services/api';
import EmptyState from '../EmptyState/EmptyState';

const WishlistPage = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [navigate]);

    const fetchWishlist = async () => {
        setIsLoading(true);
        try {
            const res = await wishlistAPI.getWishlist();
            if (res.success) {
                setWishlist(res.wishlist);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (id) => {
        try {
            const res = await wishlistAPI.removeFromWishlist(id);
            if (res.success) {
                setWishlist(wishlist.filter(item => String(item.productId) !== String(id)));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-green-100 rounded-full"></div>
                        <div className="absolute top-0 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing Wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar p-6 lg:p-12">
            <div className="mx-auto animate-fadeIn">
                {wishlist.length === 0 ? (
                    <header className="flex items-center mb-6">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-green-700 font-bold hover:gap-3 transition-all text-sm">
                            <ChevronLeft size={18} /> Continue Shopping
                        </button>
                    </header>
                ) : (
                    <header className="flex items-center gap-5 mb-10">
                        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all hover:-translate-x-1">
                            <ChevronLeft size={20} className="text-gray-800" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Personal Wishlist</h1>
                            <p className="text-sm text-gray-400 mt-1 font-medium">Your favorite items, saved for later.</p>
                        </div>
                    </header>
                )}

                {wishlist.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="Your Wishlist is Empty"
                        subtitle="Looks like you haven't added any items yet"
                        buttonText="Start Shopping"
                        accentColor="red"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 p-4 flex flex-col gap-4 shadow-md group hover:border-red-100 transition-all hover:-translate-y-1">
                                <div className="w-full h-44 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                    <img src={item.product?.image || item.product?.imageUrl} className="max-w-[80%] max-h-[80%] object-contain" alt="" />
                                    <button
                                        onClick={() => removeFromWishlist(item.productId)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-2.5 bg-white shadow-sm rounded-xl transition-all hover:scale-110 active:scale-95"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="flex-1 flex flex-col justify-between px-2 pb-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.product?.category}</p>
                                        <h3 className="font-extrabold text-gray-800 line-clamp-1">{item.product?.name}</h3>
                                        <p className="text-green-600 font-black text-xl mt-1 tracking-tight">₹{item.product?.price}</p>
                                    </div>
                                    <div className="mt-6">
                                        <button className="w-full bg-green-600 text-white text-[10px] font-black uppercase py-3.5 rounded-2xl hover:bg-green-700 shadow-md shadow-green-50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                            <ShoppingBag size={14} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
