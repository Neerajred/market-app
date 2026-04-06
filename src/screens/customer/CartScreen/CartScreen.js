import { MdOutlineDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from '../EmptyState/EmptyState';

const Cart = ({ cart, setCart, handleChange, handleRemoveClick }) => {
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

    const handleCheckout = () => {
        navigate('/checkout');
    }


    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar p-6 lg:p-12">
            <div className="mx-auto animate-fadeIn">
                <header className="flex items-center mb-6">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-green-700 font-bold hover:gap-3 transition-all text-sm">
                        <ChevronLeft size={18} /> Continue Shopping
                    </button>
                </header>

                {cart.length === 0 ? (
                    <EmptyState
                        icon={ShoppingCart}
                        title="Your Cart is Empty"
                        subtitle="Looks like you haven't added any items yet"
                        buttonText="Start Shopping"
                        accentColor="green"
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
                                <ul className="space-y-4">
                                    {cart.map((item, index) => (
                                        <li key={index} className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b last:border-b-0">
                                            <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                                                <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                                                    <img
                                                        src={item.imageUrl}
                                                        className="w-full h-full object-contain"
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-base sm:text-lg text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-sm text-gray-600 mt-1">₹{item.price} each</p>
                                                    <p className="text-green-600 font-semibold mt-1 sm:hidden">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                                                    <button
                                                        onClick={() => handleChange(item, -1)}
                                                        className="text-green-600 hover:text-green-700 transition duration-200"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="font-bold text-lg min-w-[30px] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleChange(item, +1)}
                                                        className="text-green-600 hover:text-green-700 transition duration-200"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>

                                                <p className="font-bold text-lg text-gray-800 min-w-[80px] text-right hidden sm:block">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>

                                                <button
                                                    onClick={() => handleRemoveClick(item)}
                                                    className="text-red-500 hover:text-red-600 transition duration-200"
                                                >
                                                    <MdOutlineDelete className="text-2xl" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
                                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{price}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax (8%)</span>
                                        <span className="font-semibold">₹{(price * 0.08).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-green-600">₹{(parseFloat(price) + parseFloat(price) * 0.08).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold text-lg shadow-md hover:shadow-lg"
                                >
                                    Proceed to Checkout
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Secure checkout with SSL encryption
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
