import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import api from '../api/axios';
import { DollarSign, Clock, CheckCircle, CreditCard, Banknote, Smartphone, Receipt } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const CashierDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const { user } = useAuth();

    useEffect(() => {
        const newSocket = io('http://localhost:5000');

        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();

        newSocket.on('newOrder', (order) => {
            setOrders((prev) => {
                if (prev.find(o => o.id === order.id)) return prev;
                return [order, ...prev];
            });
        });

        newSocket.on('orderPaymentUpdated', (order) => {
            setOrders((prev) => prev.map(o => o.id === order.id ? order : o));
        });

        return () => newSocket.close();
    }, []);

    const handleProcessPayment = async () => {
        if (!selectedOrder) return;
        try {
            await api.put(`/orders/${selectedOrder.id}/payment`, {
                payment_status: 'paid',
                payment_method: paymentMethod
            });
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, payment_status: 'paid', payment_method: paymentMethod } : o));
            setIsPaymentOpen(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed.');
        }
    };

    const pendingOrders = orders.filter(o => o.payment_status === 'pending');
    const todayPaidOrders = orders.filter(o => o.payment_status === 'paid' && new Date(o.updatedAt).toDateString() === new Date().toDateString());

    const totalCash = todayPaidOrders.filter(o => (o.payment_method || '').toLowerCase() === 'cash').reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const totalCard = todayPaidOrders.filter(o => (o.payment_method || '').toLowerCase() === 'card').reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const totalUpi = todayPaidOrders.filter(o => (o.payment_method || '').toLowerCase() === 'upi').reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const grandTotal = totalCash + totalCard + totalUpi;

    return (
        <div className="relative min-h-screen flex flex-col bg-[#070b19] p-6 overflow-hidden">
            {/* Dark abstract geometric light streaks background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>

            <div className="relative z-10 h-full flex flex-col space-y-6 max-w-7xl mx-auto w-full">
                <header className="shrink-0 flex justify-between items-center glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            <span className="text-white">Cashier</span> Dashboard
                        </h1>
                        <p className="text-emerald-200/60 font-medium">Manage tables and process payments</p>
                    </div>
                    {user && (
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-white font-bold text-sm leading-tight">{user.name || 'Cashier'}</p>
                                <p className="text-emerald-300/70 text-xs capitalize">{user.role || 'Cashier'}</p>
                            </div>
                        </div>
                    )}
                </header>

                {/* Top Metrics Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                    <div className="glass-panel p-4 border-l-4 border-l-emerald-500 bg-black/20 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-slate-400 text-sm font-medium mb-2 relative z-10 flex items-center justify-between">Total Cash <Banknote size={16} className="text-emerald-500/50" /></p>
                        <h3 className="text-2xl font-black text-white relative z-10">${totalCash.toFixed(2)}</h3>
                    </div>
                    <div className="glass-panel p-4 border-l-4 border-l-blue-500 bg-black/20 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-slate-400 text-sm font-medium mb-2 relative z-10 flex items-center justify-between">Total Card <CreditCard size={16} className="text-blue-500/50" /></p>
                        <h3 className="text-2xl font-black text-white relative z-10">${totalCard.toFixed(2)}</h3>
                    </div>
                    <div className="glass-panel p-4 border-l-4 border-l-purple-500 bg-black/20 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-slate-400 text-sm font-medium mb-2 relative z-10 flex items-center justify-between">Total UPI <Smartphone size={16} className="text-purple-500/50" /></p>
                        <h3 className="text-2xl font-black text-white relative z-10">${totalUpi.toFixed(2)}</h3>
                    </div>
                    <div className="glass-panel p-4 border-t border-t-emerald-500/50 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 flex flex-col justify-between relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <p className="text-emerald-300/80 text-sm font-black tracking-widest uppercase mb-1 flex items-center justify-between">Grand Total <DollarSign size={16} className="text-emerald-400" /></p>
                        <h3 className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">${grandTotal.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden pb-10 mt-4">

                    {/* Pending Payments */}
                    <div className="flex flex-col overflow-hidden gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-orange-500/20 shrink-0">
                            <h2 className="text-xl font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] flex items-center gap-2">
                                <Clock size={20} /> Pending Payment
                            </h2>
                            <span className="bg-orange-500/20 text-orange-400 text-xs font-black px-2 py-1 rounded-full border border-orange-500/30">
                                {pendingOrders.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                            {pendingOrders.map(order => (
                                <div key={order.id} className="glass-panel border-t-0 border-r-0 border-b-0 border-l-4 border-l-orange-500 p-5 flex flex-col relative animate-in fade-in zoom-in duration-300 bg-black/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(249,115,22,0.15)] transition-all group cursor-pointer" onClick={() => { setSelectedOrder(order); setIsPaymentOpen(true); }}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    <div className="flex justify-between items-start mb-4 relative z-10 border-b border-white/10 pb-3">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Table</span>
                                            <h3 className="text-2xl font-black text-white">{order.table_no || 'T/A'}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] text-slate-400 block font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5 mb-1.5">#{order.id.toString().padStart(4, '0')}</span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1 justify-end"><Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 relative z-10 pt-2 mb-4">
                                        <p className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">Total Bill</p>
                                        <p className="text-3xl font-bold text-orange-400/90">${order.total_amount.toFixed(2)}</p>
                                    </div>
                                    <button className="w-full py-3 bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold transition-all relative z-10 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2">
                                        <DollarSign size={18} /> Process Payment
                                    </button>
                                </div>
                            ))}
                            {pendingOrders.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 bg-black/20 rounded-3xl border border-white/5 border-dashed h-[300px]">
                                    <CheckCircle size={48} className="mb-4 opacity-20 text-orange-400" />
                                    <p className="text-xl font-bold text-slate-400 tracking-wide">All tables settled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completed Bills */}
                    <div className="flex flex-col overflow-hidden gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 shrink-0">
                            <h2 className="text-xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] flex items-center gap-2">
                                <CheckCircle size={20} /> Completed Bills
                            </h2>
                            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-2 py-1 rounded-full border border-emerald-500/30">
                                {todayPaidOrders.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                            {todayPaidOrders.map(order => (
                                <div key={order.id} className="glass-panel border-t-0 border-r-0 border-b-0 border-l-4 border-l-emerald-500 p-5 flex flex-col relative animate-in fade-in duration-300 bg-black/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] opacity-80 hover:opacity-100 transition-all group overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3 relative z-10">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Table</span>
                                            <h3 className="text-xl font-black text-emerald-300/80">{order.table_no || 'T/A'}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] text-slate-400 block font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5 mb-1.5">#{order.id.toString().padStart(4, '0')}</span>
                                            <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">Paid</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 relative z-10 mb-2 flex items-end justify-between">
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Total Paid</p>
                                            <p className="text-2xl font-bold text-white">${order.total_amount.toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-slate-400 uppercase flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5">
                                                {(order.payment_method || '').toLowerCase() === 'cash' && <Banknote size={14} className="text-emerald-400" />}
                                                {(order.payment_method || '').toLowerCase() === 'card' && <CreditCard size={14} className="text-blue-400" />}
                                                {(order.payment_method || '').toLowerCase() === 'upi' && <Smartphone size={14} className="text-purple-400" />}
                                                {order.payment_method}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {todayPaidOrders.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 bg-black/20 rounded-3xl border border-white/5 border-dashed h-[300px]">
                                    <Receipt size={48} className="mb-4 opacity-20 text-emerald-400" />
                                    <p className="text-xl font-bold text-slate-400 tracking-wide">No completed bills yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PAYMENT MODAL */}
                {isPaymentOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
                        <div className="glass-panel neon-border neon-border-emerald w-full max-w-xl shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col !rounded-3xl p-6 relative">
                            <button onClick={() => setIsPaymentOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-white">
                                <span className="opacity-0">Close</span>
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Process Payment</h2>

                            <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm">Table {selectedOrder.table_no || 'T/A'}</p>
                                    <p className="font-mono text-slate-500 text-xs">Order #{selectedOrder.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-sm">Total Due</p>
                                    <p className="text-3xl font-black text-emerald-400">${selectedOrder.total_amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[
                                    { id: 'cash', icon: Banknote, label: 'Cash' },
                                    { id: 'card', icon: CreditCard, label: 'Card' },
                                    { id: 'upi', icon: Smartphone, label: 'UPI' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${paymentMethod === method.id
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <method.icon size={28} className="mb-2" />
                                        <span className="font-bold">{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleProcessPayment}
                                className="w-full py-4 rounded-xl text-lg text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all flex justify-center items-center gap-2"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashierDashboard;
