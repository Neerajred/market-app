/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../../services/api';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const Wishlist = ({ handleAddClick, cart = [], isLoggedIn }) => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [isLoggedIn, navigate]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistAPI.getWishlist();
            setWishlist(data.wishlist || []);
        } catch (err) {
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistAPI.removeFromWishlist(productId);
            setWishlist(wishlist.filter(item => item.productId.toString() !== productId.toString()));
        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-8 transition-colors font-medium">
                    <FaArrowLeft /> Keep Shopping
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[50vh]">
                    <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
                        <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                            <FaHeart className="text-red-500" />
                            My Wishlist
                            <span className="bg-slate-100 text-slate-600 text-sm py-1 px-3 rounded-full font-sans font-bold">{wishlist.length}</span>
                        </h1>
                    </div>

                    {wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-slate-50 p-6 rounded-full mb-6">
                                <FaHeart className="text-slate-300 text-6xl" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">Browse our premium collection and save your favorite items for later.</p>
                            <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                Discover Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                            {wishlist.map((item) => (
                                <div key={item._id || item.productId} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 transition-all hover:shadow-lg flex flex-col group relative">
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                        title="Remove"
                                    >
                                        <FaTrash size={14} />
                                    </button>

                                    <Link to={`/product/${item.productId}`} className="relative pt-[100%] bg-slate-50 rounded-xl overflow-hidden mb-4 block">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    <div className="flex-1 flex flex-col">
                                        <Link to={`/product/${item.productId}`} className="font-bold text-slate-900 hover:text-primary-600 transition-colors line-clamp-1 mb-1 text-lg" title={item.name}>
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-slate-400 mb-3">Added on {new Date(item.addedAt).toLocaleDateString()}</p>

                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
                                            <span className="text-xl font-bold text-slate-900">${item.price}</span>
                                            <button
                                                onClick={() => handleAddClick({
                                                    id: item.productId,
                                                    name: item.name,
                                                    price: item.price,
                                                    imageUrl: item.image,
                                                    quantity: 1
                                                })}
                                                className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
                                                title="Add to Cart"
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
