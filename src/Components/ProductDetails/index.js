import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../services/productApi';
import { wishlistAPI } from '../../services/api';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft, FaTruck, FaShieldAlt } from 'react-icons/fa';

const ProductDetails = ({ handleAddClick, cart = [], isLoggedIn }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await fetchProductById(id);
                setProduct(data);
                setActiveImage(data.images ? data.images[0] : data.thumbnail);

                // Check wishlist status if logged in
                if (isLoggedIn) {
                    try {
                        const wishlistData = await wishlistAPI.getWishlist();
                        if (wishlistData && wishlistData.wishlist) {
                            const exists = wishlistData.wishlist.some(item => String(item.productId) === String(data.id));
                            setIsInWishlist(exists);
                        }
                    } catch (err) {
                        console.error("Wishlist check failed", err);
                        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                            // Silent fail or optional: perform logout? 
                            // For now, we rely on the action to trigger explicit login redirect if needed
                        }
                    }
                }
            } catch (err) {
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id, isLoggedIn]);

    const handleWishlistToggle = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!product) return;

        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await wishlistAPI.removeFromWishlist(product.id);
                setIsInWishlist(false);
            } else {
                await wishlistAPI.addToWishlist({
                    productId: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.thumbnail
                });
                setIsInWishlist(true);
            }
        } catch (err) {
            console.error("Wishlist action failed", err);
            // Handle Auth errors explicitly
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert("Session expired. Please login again.");
                navigate('/login');
            } else {
                alert("Failed to update wishlist. Please try again.");
            }
        } finally {
            setWishlistLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="h-full bg-slate-50 flex items-center justify-center text-red-500">
                {error || 'Product not found'}
            </div>
        );
    }

    const discountPrice = product.price / (1 - product.discountPercentage / 100);

    return (
        <div className="h-full overflow-y-auto bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn custom-scrollbar">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-8 transition-colors font-medium"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="p-4 bg-slate-50 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 relative">
                            <div className="w-full aspect-square max-w-lg relative mb-4">
                                <img
                                    src={activeImage}
                                    alt={product.title}
                                    className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 max-w-full no-scrollbar">
                                {product.images?.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-20 h-20 rounded-xl border-2 p-1 bg-white flex-shrink-0 transition-all ${activeImage === img ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent hover:border-slate-300'}`}
                                    >
                                        <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-6 lg:p-8 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                        {product.category}
                                    </span>
                                    <h1 className="text-2xl lg:text-3xl font-bold font-heading text-slate-900 mb-2 leading-tight">
                                        {product.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                        <div className="flex text-amber-400 text-base">
                                            <FaStar />
                                            <span className="text-slate-700 font-bold ml-1">{product.rating}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                                        <span>•</span>
                                        <span>SKU: {product.sku || product.id}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    className={`p-3 rounded-full border transition-all ${isInWishlist ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-slate-400 border-slate-200 hover:border-red-200 hover:text-red-500'}`}
                                >
                                    <FaHeart className={`text-xl ${isInWishlist ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-3xl font-bold text-slate-900">${product.price}</span>
                                <span className="text-lg text-slate-400 line-through">${discountPrice.toFixed(2)}</span>
                                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                    {Math.round(product.discountPercentage)}% OFF
                                </span>
                            </div>

                            <p className="text-slate-600 text-base leading-relaxed mb-6 flex-grow">
                                {product.description}
                            </p>

                            <div className="space-y-6 mt-auto">
                                {/* Quantity & Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 w-fit">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 hover:bg-white text-slate-600 rounded-l-xl transition-colors font-bold text-lg"
                                        >-</button>
                                        <span className="px-4 font-bold text-slate-900 min-w-[3rem] text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-3 hover:bg-white text-slate-600 rounded-r-xl transition-colors font-bold text-lg"
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={() => handleAddClick({
                                            id: product.id,
                                            name: product.title,
                                            price: product.price,
                                            imageUrl: product.thumbnail,
                                            quantity: quantity
                                        })}
                                        className="flex-1 bg-slate-900 text-white rounded-xl font-bold py-3.5 hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        <FaShoppingCart />
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <FaTruck className="text-primary-600 text-xl" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">Free Delivery</p>
                                            <p className="text-xs text-slate-500">Orders over $50</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <FaShieldAlt className="text-primary-600 text-xl" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">Secure Payment</p>
                                            <p className="text-xs text-slate-500">100% Protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 lg:p-8">
                            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-8">Customer Reviews</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.reviews.map((review, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                    {review.reviewerName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{review.reviewerName}</p>
                                                    <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < review.rating ? "fill-current" : "text-slate-200"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
