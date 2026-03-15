import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import api from '../api/axios';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const KitchenDisplay = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get('/orders');
            // Show all orders for today (we assume backend returns today's or we filter recent)
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, []);

    useEffect(() => {
        // Connect to Socket.IO
        const newSocket = io('http://localhost:5000');

        // Fetch initial active orders
        fetchOrders();

        // Listen for new orders
        newSocket.on('newOrder', (order) => {
            console.log("New Order Received:", order);
            setOrders((prev) => {
                // Prevent duplicate orders
                if (prev.find(o => o.id === order.id)) return prev;
                return [order, ...prev];
            });
            // Optional: Add sound alert here
            // const audio = new Audio('/notification.mp3');
            // audio.play().catch(e => console.log("Audio play failed", e));
        });

        return () => newSocket.close();

    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}`, { status });
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const ongoingOrders = orders.filter(o => o.status !== 'completed');
    const completedOrders = orders.filter(o => o.status === 'completed');

    return (
        <div className="relative min-h-screen bg-[#070b19] p-6 overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

            <div className="relative z-10 h-full overflow-y-auto custom-scrollbar pr-2">
                <div className="flex justify-between items-center mb-8 glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                        <span className="text-white">Kitchen</span> Display
                    </h1>
                    {user && (
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'K'}
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-white font-bold text-sm leading-tight">{user.name || 'Kitchen Staff'}</p>
                                <p className="text-orange-300/70 text-xs capitalize">{user.role || 'Kitchen'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20 mt-4">
                    {/* Ongoing Orders */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-orange-500/20 mb-2">
                            <h2 className="text-xl font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] flex items-center gap-2">
                                <Clock size={20} /> Ongoing Orders
                            </h2>
                            <span className="bg-orange-500/20 text-orange-400 text-xs font-black px-2 py-1 rounded-full border border-orange-500/30">
                                {ongoingOrders.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ongoingOrders.map((order) => (
                                <div key={order.id} className="glass-panel border-t-0 border-r-0 border-b-0 border-l-4 border-l-orange-500 p-5 flex flex-col relative animate-in fade-in zoom-in duration-300 bg-black/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(249,115,22,0.15)] transition-all group overflow-hidden">
                                    {/* Card Background Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="flex justify-between items-start mb-5 border-b border-white/10 pb-3 relative z-10">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Order ID</span>
                                            <h3 className="text-2xl font-black text-white drop-shadow-md">#{order.id.toString().padStart(4, '0')}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] text-slate-400 block font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5 mb-1.5">
                                                <Clock size={10} className="inline mr-1 mb-0.5" />
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-orange-500/20 border border-orange-500/30 text-orange-400 uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-3 mb-6 relative z-10">
                                        {order.OrderItems && order.OrderItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-slate-200 group/item hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                                                <div className="flex gap-3">
                                                    <span className="font-black text-xl text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)] bg-orange-500/10 px-2 rounded h-fit">{item.qty}x</span>
                                                    <span className="font-medium text-lg leading-tight mt-0.5 group-hover/item:text-white transition-colors">{item.MenuItem?.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-4 flex gap-2 relative z-10 border-t border-white/5">
                                        <button
                                            onClick={() => updateStatus(order.id, 'completed')}
                                            className="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <CheckCircle size={20} className="group-hover/btn:scale-110 transition-transform" /> Mark Ready
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {ongoingOrders.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-black/20 rounded-3xl border border-white/5 border-dashed">
                                <Clock size={48} className="mb-4 opacity-20 text-orange-400" />
                                <p className="text-xl font-bold text-slate-400 tracking-wide">No active orders</p>
                                <p className="text-slate-600 mt-1">Waiting for new tickets...</p>
                            </div>
                        )}
                    </div>

                    {/* Completed Orders */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-2">
                            <h2 className="text-xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] flex items-center gap-2">
                                <CheckCircle size={20} /> Completed Today
                            </h2>
                            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-2 py-1 rounded-full border border-emerald-500/30">
                                {completedOrders.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {completedOrders.map((order) => (
                                <div key={order.id} className="glass-panel border-t-0 border-r-0 border-b-0 border-l-4 border-l-emerald-500 p-5 flex flex-col relative animate-in fade-in duration-300 bg-black/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] opacity-80 hover:opacity-100 transition-all group overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3 relative z-10">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Order ID</span>
                                            <h3 className="text-xl font-black text-emerald-300/80 drop-shadow-md">#{order.id.toString().padStart(4, '0')}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] text-slate-400 block font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5 mb-1.5 line-through decoration-emerald-500/50">
                                                <Clock size={10} className="inline mr-1 mb-0.5" />
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2 mb-4 relative z-10">
                                        {order.OrderItems && order.OrderItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-slate-400 text-sm p-1">
                                                <div className="flex gap-2.5 items-center">
                                                    <span className="font-black text-emerald-500">{item.qty}x</span>
                                                    <span className="font-medium line-through decoration-emerald-500/30">{item.MenuItem?.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-white/5">
                                        <button
                                            onClick={() => updateStatus(order.id, 'pending')}
                                            className="w-full py-2 rounded-lg text-slate-300 font-bold bg-white/5 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            <XCircle size={16} /> Mark Pending
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {completedOrders.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-black/20 rounded-3xl border border-white/5 border-dashed">
                                <CheckCircle size={48} className="mb-4 opacity-20 text-emerald-400" />
                                <p className="text-xl font-bold text-slate-400 tracking-wide">No completed orders yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KitchenDisplay;
