import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { ShoppingCart, Search, Utensils, Receipt, X, CreditCard, Banknote, Smartphone, Calculator, Check, Printer } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import CartItem from '../components/CartItem';
import useAuth from '../hooks/useAuth';

const BillingScreen = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(false);
    const [tableNo, setTableNo] = useState('');
    const [existingOrder, setExistingOrder] = useState(null);
    const { user } = useAuth();

    // Payment States
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountTendered, setAmountTendered] = useState('');
    const [isOrderComplete, setIsOrderComplete] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

    useEffect(() => {
        if (!tableNo) {
            setExistingOrder(null);
            return;
        }
        const findOrder = async () => {
            try {
                const res = await api.get('/orders');
                const pending = res.data.find(o => o.table_no === tableNo && o.payment_status === 'pending');
                setExistingOrder(pending || null);
            } catch (err) { }
        };
        const timer = setTimeout(findOrder, 500);
        return () => clearTimeout(timer);
    }, [tableNo]);

    const fetchMenu = async () => {
        try {
            const res = await api.get('/menu');
            setMenuItems(res.data);
            const cats = ['All', ...new Set(res.data.map(i => i.category))];
            setCategories(cats);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, qty: Math.max(1, i.qty + delta) };
            }
            return i;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const handlePlaceOrderClick = () => {
        if (cart.length === 0 && !existingOrder) return;
        setPaymentMethod('cash');
        setAmountTendered('');
        setIsOrderComplete(false);
        setIsPaymentOpen(true);
    };

    const confirmOrder = async () => {
        setLoading(true);
        try {
            let orderIdToPay = null;

            if (existingOrder) {
                if (cart.length > 0) {
                    const appendData = { items: cart.map(i => ({ menu_item_id: i.id, qty: i.qty })) };
                    await api.post(`/orders/${existingOrder.id}/items`, appendData);
                }
                orderIdToPay = existingOrder.id;
            } else {
                const orderData = {
                    items: cart.map(i => ({ menu_item_id: i.id, qty: i.qty })),
                    payment_method: paymentMethod,
                    payment_status: 'pending',
                    table_no: tableNo || null
                };
                const res = await api.post('/orders', orderData);
                orderIdToPay = res.data.id;
            }

            await api.put(`/orders/${orderIdToPay}/payment`, {
                payment_status: 'paid',
                payment_method: paymentMethod
            });

            // Show Success State
            setIsOrderComplete(true);

            // Reset after a delay or manual close
            setTimeout(() => {
                setCart([]);
                setTableNo('');
                setExistingOrder(null);
                setIsPaymentOpen(false);
                setIsOrderComplete(false);
            }, 3000);

        } catch (err) {
            console.error(err);
            alert('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    const sendToKitchen = async () => {
        setLoading(true);
        try {
            if (existingOrder) {
                if (cart.length > 0) {
                    const appendData = { items: cart.map(i => ({ menu_item_id: i.id, qty: i.qty })) };
                    await api.post(`/orders/${existingOrder.id}/items`, appendData);
                }
            } else {
                const orderData = {
                    items: cart.map(i => ({ menu_item_id: i.id, qty: i.qty })),
                    payment_status: 'pending',
                    table_no: tableNo || null
                };
                await api.post('/orders', orderData);
            }

            setCart([]);
            setTableNo('');
            setExistingOrder(null);
            alert('Order sent to kitchen!');
        } catch (err) {
            console.error(err);
            alert('Failed to send order.');
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter === 'All' || item.category === categoryFilter)
    );

    const totalNewAmount = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const totalExistingAmount = existingOrder ? existingOrder.total_amount : 0;
    const subtotal = totalNewAmount + totalExistingAmount;
    const taxAmount = subtotal * 0.05;
    const grandTotal = subtotal + taxAmount;

    const changeAmount = useMemo(() => {
        const tendered = parseFloat(amountTendered) || 0;
        return Math.max(0, tendered - grandTotal);
    }, [amountTendered, grandTotal]);

    const canConfirm = paymentMethod !== 'cash' || (parseFloat(amountTendered) >= grandTotal);

    return (
        <>
            <div className="relative flex h-screen bg-[#070b19] overflow-hidden font-sans print:hidden">
                {/* Dark abstract geometric light streaks background */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
                <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
                <div className="fixed top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
                <div className="fixed bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

                {/* Left Side: Menu */}
                <div className="relative z-10 flex-1 flex flex-col p-6 min-w-0">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <span className="p-2 bg-primary/20 rounded-lg text-primary"><Utensils size={28} /></span>
                                    Menu
                                </h1>
                                <p className="text-slate-400 mt-1">Select items to add to order</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search menu..."
                                        className="input-field search-input mb-0 w-64 bg-slate-800/80 border-slate-700 focus:bg-slate-800 transition-all"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>

                                {user && (
                                    <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="hidden sm:block text-right pr-1">
                                            <p className="text-white font-bold text-xs leading-tight">{user.name || 'Staff'}</p>
                                            <p className="text-cyan-400/80 text-[10px] capitalize">{user.role || 'User'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((cat, idx) => {
                                const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-pink-500', 'bg-purple-500', 'bg-blue-500'];
                                const selectedColor = colors[idx % colors.length];

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${categoryFilter === cat
                                            ? `${selectedColor} text-white border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]`
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border-white/10'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </header>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <MenuCard key={item.id} item={item} onAdd={addToCart} />
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    <Utensils size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">No items found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Cart */}
                <div className="relative z-20 w-[400px] glass-panel rounded-none border-y-0 border-r-0 border-l border-white/10 flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.5)]">
                    <div className="p-6 border-b border-white/10 bg-black/20">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="p-2 bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.3)] rounded-lg text-indigo-400"><ShoppingCart size={24} /></span>
                            Current Order
                        </h2>
                        <div className="mt-2 text-sm text-slate-400 flex justify-between">
                            <span>Transaction ID: #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {/* Render Existing Items if they exist */}
                        {existingOrder && existingOrder.OrderItems && existingOrder.OrderItems.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-xs uppercase font-bold text-slate-500 mb-2 px-2 tracking-wider">Previously Ordered</h3>
                                {existingOrder.OrderItems.map(item => (
                                    <div key={`ex-${item.id}`} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 mb-2 opacity-60">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white mb-0.5">{item.MenuItem?.name || 'Unknown Item'}</span>
                                            <span className="text-xs text-slate-400">${item.price.toFixed(2)} x {item.qty}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white opacity-80">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-b border-dashed border-white/10 my-4"></div>
                                <h3 className="text-xs uppercase font-bold text-slate-500 mb-2 px-2 tracking-wider">New Items</h3>
                            </div>
                        )}

                        {cart.length === 0 ? (
                            <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-slate-500 space-y-4">
                                <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center">
                                    <ShoppingCart size={32} className="opacity-20" />
                                </div>
                                <p>Your cart is empty</p>
                                <p className="text-sm px-10 text-center text-slate-600">Start adding items from the menu to build an order.</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQty={updateQty}
                                    onRemove={removeFromCart}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-black/40 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                                <span>Table Number / Name</span>
                                <span className="text-slate-600 font-normal">Optional</span>
                            </label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="e.g. T4, Bar"
                                value={tableNo}
                                onChange={e => setTableNo(e.target.value)}
                            />
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>Tax (5%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-white pt-4 border-t border-dashed border-slate-600">
                                <span>Total</span>
                                <span className="text-primary">${grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={sendToKitchen}
                                disabled={loading || (cart.length === 0 && !existingOrder)}
                                className="w-full py-3 rounded-lg text-sm text-orange-400 font-bold bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                <Utensils size={18} className="group-hover:scale-110 transition-transform" /> Pay Later
                            </button>
                            <button
                                onClick={handlePlaceOrderClick}
                                disabled={loading || (cart.length === 0 && !existingOrder)}
                                className="w-full py-3 rounded-lg text-sm text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                <Receipt size={18} className="group-hover:scale-110 transition-transform" /> Checkout
                            </button>
                            <button
                                onClick={() => window.print()}
                                disabled={!existingOrder}
                                className={`col-span-2 w-full py-2 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${existingOrder ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}
                            >
                                <Printer size={14} /> Print Current Bill
                            </button>
                        </div>
                    </div>
                </div>

                {/* PAYMENT & CHECKOUT MODAL */}
                {isPaymentOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
                        <div className="glass-panel neon-border neon-border-purple w-full max-w-4xl max-h-[90vh] shadow-[0_0_50px_rgba(139,92,246,0.2)] flex overflow-hidden !rounded-3xl p-0">

                            {/* Left Side: Order Summary */}
                            <div className="w-1/3 bg-black/40 border-r border-white/10 p-6 flex flex-col overflow-y-auto">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Receipt className="text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" size={20} /> Order Summary
                                </h3>
                                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                                    {existingOrder?.OrderItems?.map(item => (
                                        <div key={'ex' + item.id} className="flex justify-between items-start text-sm pb-3 border-b border-white/10 last:border-0 opacity-70">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-slate-500/20 text-slate-300 px-1.5 py-0.5 rounded text-xs font-bold border border-slate-500/30">{item.qty}x</span>
                                                    <span className="text-slate-400 font-medium">{item.MenuItem?.name} (Already Ordered)</span>
                                                </div>
                                            </div>
                                            <span className="text-slate-500 font-mono text-right ml-2">${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}

                                    {cart.map(item => (
                                        <div key={'cart' + item.id} className="flex justify-between items-start text-sm pb-3 border-b border-white/10 last:border-0">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-xs font-bold border border-purple-500/30">{item.qty}x</span>
                                                    <span className="text-slate-200 font-medium">{item.name}</span>
                                                </div>
                                            </div>
                                            <span className="text-slate-300 font-mono text-right ml-2">${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                                    <div className="flex justify-between text-slate-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 text-sm">
                                        <span>Tax (5%)</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold text-white pt-2">
                                        <span>Total</span>
                                        <span className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Payment Processing */}
                            <div className="flex-1 p-8 flex flex-col relative bg-black/20">
                                <button onClick={() => setIsPaymentOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all">
                                    <X size={24} />
                                </button>

                                {isOrderComplete ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                                            <Check size={48} className="text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                                        <p className="text-slate-400 text-lg">Order #{Math.floor(Math.random() * 10000)} has been sent to the kitchen.</p>
                                        <button onClick={() => window.print()} className="mt-8 btn bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2 px-6 py-3 rounded-xl">
                                            <Printer size={20} /> Print Receipt
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold text-white mb-2">Select Payment Method</h2>
                                            <p className="text-slate-400">Choose how the customer wants to pay.</p>
                                        </div>

                                        {/* Method Selector */}
                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                            {[
                                                { id: 'cash', icon: Banknote, label: 'Cash' },
                                                { id: 'card', icon: CreditCard, label: 'Card' },
                                                { id: 'upi', icon: Smartphone, label: 'UPI' }
                                            ].map(method => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${paymentMethod === method.id
                                                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-105'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <method.icon size={32} className="mb-3" />
                                                    <span className="text-lg font-bold">{method.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Dynamic Payment Content */}
                                        <div className="flex-1 bg-black/30 rounded-2xl border border-white/10 p-6 mb-6">
                                            {paymentMethod === 'cash' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-400 mb-2">Amount Tendered</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
                                                            <input
                                                                type="number"
                                                                className="w-full bg-slate-900 text-white text-3xl font-bold pl-10 pr-4 py-4 rounded-xl border border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                                                placeholder="0.00"
                                                                value={amountTendered}
                                                                onChange={e => setAmountTendered(e.target.value)}
                                                                autoFocus
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-slate-700/50 p-4 rounded-xl">
                                                        <span className="text-slate-300 text-lg">Change to Return</span>
                                                        <span className={`text-3xl font-bold ${changeAmount > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                            ${changeAmount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {[10, 20, 50, 100].map(amt => (
                                                            <button
                                                                key={amt}
                                                                onClick={() => setAmountTendered(amt.toString())}
                                                                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
                                                            >
                                                                ${amt}
                                                            </button>
                                                        ))}
                                                        <button
                                                            onClick={() => setAmountTendered(grandTotal.toFixed(2))}
                                                            className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-bold transition-colors"
                                                        >
                                                            Exact
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {paymentMethod === 'upi' && (
                                                <div className="flex flex-col items-center justify-center h-full text-center">
                                                    <div className="bg-white p-4 rounded-xl mb-4">
                                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=restaurant@bank&pn=Restaurant&am=${grandTotal}&cu=USD`} alt="UPI QR" className="w-48 h-48 mix-blend-multiply" />
                                                    </div>
                                                    <p className="text-white font-bold text-xl mb-1">Scan to Pay ${grandTotal.toFixed(2)}</p>
                                                    <p className="text-slate-400 text-sm">Ask customer to scan this QR code with any UPI app</p>
                                                </div>
                                            )}

                                            {paymentMethod === 'card' && (
                                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                                    <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                                                        <CreditCard size={48} className="text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-xl mb-2">Ready for Card Swipe</p>
                                                        <p className="text-slate-400">Please initiate the transaction on the card terminal.</p>
                                                    </div>
                                                    <div className="bg-slate-900 border border-slate-600 rounded-lg px-6 py-3">
                                                        <span className="text-slate-400 text-sm">Amount to Charge:</span>
                                                        <span className="text-white font-bold ml-2 text-lg">${grandTotal.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <button
                                            onClick={confirmOrder}
                                            disabled={loading || !canConfirm}
                                            className="w-full py-4 rounded-xl text-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(52,211,153,0.4)] border border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Processing Transaction...' : (
                                                <>
                                                    <Check size={28} /> Complete Payment
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PRINTABLE RECEIPT */}
            <div className="hidden print:block bg-white text-black p-8 font-mono select-none" style={{ width: '80mm', minHeight: '100%', margin: '0 auto' }}>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black mb-1">THE NEON FORK</h2>
                    <p className="text-sm">123 Cyber Avenue, Neo City</p>
                    <p className="text-sm">Tel: +1 800 555 1337</p>
                    <div className="border-b-2 border-dashed border-black my-4"></div>
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-1">{tableNo ? `TABLE ${tableNo}` : 'TAKEAWAY'}</h3>
                    {existingOrder && <p className="text-xs">Order #{existingOrder.id}</p>}
                    <p className="text-xs mt-2">{new Date().toLocaleString()}</p>
                    <div className="border-b-2 border-dashed border-black my-4"></div>
                </div>

                <table className="w-full text-sm mb-6">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="text-left font-bold pb-2">ITEM</th>
                            <th className="text-center font-bold pb-2">QTY</th>
                            <th className="text-right font-bold pb-2">PRICE</th>
                        </tr>
                    </thead>
                    <tbody className="align-top">
                        {/* Render previously sent items */}
                        {existingOrder?.OrderItems?.map(item => (
                            <tr key={'print-ex' + item.id}>
                                <td className="py-2 pr-2">{item.MenuItem?.name}</td>
                                <td className="py-2 text-center">{item.qty}</td>
                                <td className="py-2 text-right">${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* Render unsent cart items */}
                        {cart.map(item => (
                            <tr key={'print-cart' + item.id}>
                                <td className="py-2 pr-2">{item.name} *</td>
                                <td className="py-2 text-center">{item.qty}</td>
                                <td className="py-2 text-right">${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="border-t border-black pt-2 text-sm space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (5%):</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-dashed border-black">
                        <span>TOTAL:</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center mt-12 text-sm italic">
                    <p>Thank you for dining with us!</p>
                    {cart.length > 0 && existingOrder && (
                        <p className="text-xs mt-2 font-bold">* Indicates items not yet sent to kitchen</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default BillingScreen;
