import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle, Package, Truck, AlertCircle } from 'lucide-react';
import { orderAPI } from '../../../services/api';
import EmptyState from '../EmptyState/EmptyState';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await orderAPI.getOrders();
            if (res.success) setOrders(res.orders);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
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
                    <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing History...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar p-6 lg:p-12">
            <div className="mx-auto animate-fadeIn">
                {orders.length === 0 ? (
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
                            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Purchase History</h1>
                            <p className="text-sm text-gray-400 mt-1 font-medium">Review and track your past orders.</p>
                        </div>
                    </header>
                )}

                {orders.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="Your Order History is Empty"
                        subtitle="Looks like you haven't added any items yet"
                        buttonText="Start Shopping"
                        accentColor="green"
                    />
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-green-200 transition-all hover:-translate-y-0.5 group">
                                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-green-600 border border-gray-100">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                                            <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-tight">#{order.id.split('-')[0]}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5 text-green-600">Total</p>
                                            <p className="text-sm font-black text-green-600 tracking-tight">₹{order.totalPrice}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400 text-[9px] mb-4 bg-gray-50 px-3 py-1 rounded-lg w-fit font-bold">
                                    <Clock size={12} />
                                    <span>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {order.items?.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="w-9 h-9 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm flex items-center justify-center p-1 transition-transform group-hover:translate-x-1 duration-300">
                                                <img src={item.product?.image || 'https://via.placeholder.com/50'} className="max-w-full max-h-full object-contain" alt="" title={item.product?.name} />
                                            </div>
                                        ))}
                                        {order.items?.length > 5 && (
                                            <div className="w-9 h-9 rounded-xl border-2 border-white bg-green-50 flex items-center justify-center text-[9px] font-black text-green-600 tracking-tight group-hover:translate-x-1 duration-300">
                                                +{order.items.length - 5}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-green-600 text-green-600 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-green-50 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        <Truck size={14} />
                                        Track Order
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const normalized = (status || 'processing').toLowerCase();
    let colors = 'bg-yellow-50 text-yellow-600 border-yellow-100';
    let icon = <Clock size={10} />;
    if (normalized === 'delivered') { colors = 'bg-green-50 text-green-600 border-green-100'; icon = <CheckCircle size={10} />; }
    if (normalized === 'shipped') { colors = 'bg-blue-50 text-blue-600 border-blue-100'; icon = <Truck size={10} />; }
    if (normalized === 'cancelled') { colors = 'bg-red-50 text-red-600 border-red-100'; icon = <AlertCircle size={10} />; }

    return (
        <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border shadow-sm ${colors}`}>
            {icon}
            {normalized}
        </span>
    );
};

export default OrdersPage;
