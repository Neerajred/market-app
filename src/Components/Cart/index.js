import { MdOutlineDelete } from "react-icons/md";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";


const Cart = ({ cart, setCart, handleChange }) => {
    const navigate = useNavigate();
    const [price, setPrice] = useState(0);

    const handlePrice = () => {
        let sumAmount = 0;
        cart.map(item => (
            sumAmount += item.price * item.quantity
        ))
        setPrice(sumAmount.toFixed(2))
    }

    useEffect(() => {
        handlePrice();
    })

    const handleRemove = (id) => {
        const cartFlt = cart.filter(item => item.id !== id)
        setCart(cartFlt);
    }

    const handleCheckout = () => {
        navigate('/checkout');
    }


    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/">
                    <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold mb-8 transition duration-200 font-heading text-sm">
                        <FaArrowLeft />Continue Shopping
                    </button>
                </Link>

                {cart.length === 0 ? (
                    <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center animate-fade-in">
                        <div className="bg-slate-50 p-6 rounded-full mb-6">
                            <FaShoppingCart className="text-6xl text-slate-300" />
                        </div>
                        <h2 className='text-slate-900 font-bold font-heading text-2xl mb-2'>Your Cart is Empty</h2>
                        <p className='text-slate-500 mb-8 max-w-sm mx-auto'>Looks like you haven't added any premium items to your cart yet.</p>
                        <Link to="/">
                            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl hover:bg-primary-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
                                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-8">Shopping Cart ({cart.length})</h2>
                                <div className="space-y-6">
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                            <div className="h-24 w-24 flex-shrink-0 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <img
                                                    src={item.imageUrl}
                                                    className="w-full h-full object-contain"
                                                    alt={item.name}
                                                />
                                            </div>

                                            <div className="flex-1 w-full text-center sm:text-left">
                                                <h3 className="font-bold text-lg text-slate-900 truncate mb-1">{item.name}</h3>
                                                <p className="text-sm font-medium text-slate-500">${item.price} each</p>
                                            </div>

                                            <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-2 py-1 border border-slate-100">
                                                    <button
                                                        onClick={() => handleChange(item, -1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-primary-600 transition-colors bg-white rounded-lg shadow-sm"
                                                    >
                                                        <FaMinus className="text-xs" />
                                                    </button>
                                                    <span className="font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleChange(item, +1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-primary-600 transition-colors bg-white rounded-lg shadow-sm"
                                                    >
                                                        <FaPlus className="text-xs" />
                                                    </button>
                                                </div>

                                                <div className="min-w-[80px] text-right">
                                                    <p className="font-bold text-xl text-slate-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                >
                                                    <MdOutlineDelete className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 sticky top-8">
                                <h3 className="text-xl font-bold font-heading text-slate-900 mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-slate-900">${price}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Shipping</span>
                                        <span className="font-bold text-primary-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tax (8%)</span>
                                        <span className="font-bold text-slate-900">${(price * 0.08).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-4 flex justify-between text-xl font-bold text-slate-900 mt-2">
                                        <span>Total</span>
                                        <span>${(parseFloat(price) + parseFloat(price) * 0.08).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-primary-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Proceed to Checkout
                                </button>
                                <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                                    <AiFillLock /> Secure checkout with SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
