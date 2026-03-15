import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { RefreshCw, Search, Home, ChevronDown, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement,
    BarController
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        lowStockCount: 0,
        recentOrders: []
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchStats = useCallback(async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchStats();

        // Auto-refresh every 5 seconds for live order tracking
        const intervalId = setInterval(() => {
            fetchStats();
        }, 5000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [fetchStats]);

    const chartData = {
        labels: ['Vo', 'Cu', 'Ar', 'Vs', 'Nu', 'Fr', 'Jp', 'A5', 'Mn', '38'],
        datasets: [
            {
                type: 'bar',
                label: 'Background Bars',
                data: [60, 40, 25, 30, 45, 20, 10, 55, 30, 20],
                backgroundColor: '#F3F4F6',
                barPercentage: 0.4,
                categoryPercentage: 1.0,
                borderRadius: 4,
            },
            {
                type: 'line',
                label: 'Orders',
                data: [5, 20, 23, 20, 30, 15, 45, 58, 25, 18],
                borderColor: '#E8A365',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(232, 163, 101, 0.2)');
                    gradient.addColorStop(1, 'rgba(232, 163, 101, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 60,
                ticks: {
                    color: '#9CA3AF',
                    font: { size: 10, weight: '500' },
                    stepSize: 10,
                    callback: (value) => value + '%',
                },
                border: { display: false },
                grid: {
                    display: true,
                    color: (context) => context.tick.value === 50 ? '#F3F4F6' : 'transparent',
                    drawTicks: false
                }
            },
            x: {
                ticks: {
                    color: '#9CA3AF',
                    font: { size: 10, weight: '500' },
                },
                border: { display: false },
                grid: { display: false }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        }
    };

    const dummyRecentOrders = [
        { id: 1, revenue: 'Riders Revenue:', date: '/ Sep 2021,', search: 'Search 27', note: 'Caution 32 1/3, 2024', status: 'Active...' },
        { id: 2, revenue: 'Riders Revenue:', date: '/ Sen 2023,', search: 'Search 29', note: 'Facturstion 31/03, 2023', status: 'Nothing...' },
        { id: 3, revenue: "Riders' Revenue:", date: '/ Sun 2025,', search: 'Search 209', note: 'Cactuation 55N/3, 2023', status: 'Nortive...' },
        { id: 4, revenue: 'Riders Revenue:', date: '/ Sun 2022,', search: 'Search 207', note: 'Caution 35 N/3, 2026', status: 'Norting...' },
    ];

    return (
        <div className="relative flex h-screen bg-[#070b19] text-white font-sans overflow-hidden">
            {/* Abstract Background Elements matching Login */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col pt-8 pb-6 px-4 relative z-10 glass-panel m-4 rounded-2xl">
                {/* Logo Area */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                        <Home className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Gourmet</h1>
                        <p className="text-[10px] text-slate-400 tracking-widest uppercase">Admin Portal</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 flex flex-col gap-2">
                    <button onClick={() => navigate('/admin')} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium transition-all shadow-[0_0_10px_rgba(255,255,255,0.02)]">
                        <Home size={18} className="text-primary" /> Dashboard
                    </button>
                    <button onClick={() => navigate('/admin/menu')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <RefreshCw size={18} /> Products
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <Music size={18} /> Staff
                    </button>
                    <button onClick={() => navigate('/admin/inventory')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <Search size={18} /> Inventory
                    </button>
                    <button onClick={() => navigate('/admin/reports')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <ChevronRight size={18} /> Reports
                    </button>
                </nav>

                {/* Bottom Profile Link */}
                <div className="mt-auto px-2">
                    <div className="w-full h-[1px] bg-white/10 mb-4"></div>
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=1e293b&color=fff`} alt="User" className="w-full h-full rounded-full border border-[#070b19]" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                            <p className="text-xs text-slate-400 truncate capitalize">{user?.role || 'admin'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 overflow-y-auto overflow-x-hidden relative z-10 scrollbar-hide">
                {/* Top Header */}
                <header className="px-6 py-4 flex justify-between items-center glass-panel rounded-2xl mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search..." className="input-field search-input m-0 py-2 w-64 bg-black/20" />
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Stats & Chart) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-panel neon-border neon-border-purple p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                                        <h3 className="text-3xl font-bold mt-2 text-white">₹{stats?.totalSales?.toLocaleString('en-IN') || 0}</h3>
                                        <div className="inline-flex mt-3 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                                            +12.5% Today
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30">
                                        <Home className="text-primary" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel neon-border neon-border-blue p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Total Orders</p>
                                        <h3 className="text-3xl font-bold mt-2 text-white">{stats.totalOrders || 0}</h3>
                                        <div className="inline-flex mt-3 text-cyan-400 text-xs font-bold bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
                                            +5.2% Active
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30">
                                        <RefreshCw className="text-cyan-400" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="glass-panel p-6 border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Order Trends</h3>
                                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/5 transition-colors">
                                    This Week <ChevronDown size={14} className="inline ml-1" />
                                </button>
                            </div>
                            <div className="h-[280px] w-full">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Recent Orders) */}
                    <div className="glass-panel p-0 border-white/5 flex flex-col h-full opacity-90">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Live Orders</h2>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide space-y-2">
                            {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.slice(0, 6).map((order, idx) => {
                                    /* Dynamic styling based on order status */
                                    let statusClass = "badge-processing";
                                    let statusDot = "bg-yellow-500";

                                    if (order.status === 'Completed') {
                                        statusClass = "badge-completed";
                                        statusDot = "bg-green-500";
                                    } else if (order.status === 'Cancelled') {
                                        statusClass = "text-red-400 border border-red-500/30 bg-red-500/10";
                                        statusDot = "bg-red-500";
                                    }

                                    return (
                                        <div key={order._id || idx} className="p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                    <span className="text-white text-sm font-bold">#{order.tableNumber || 'T'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">Order *{order._id?.substring(0, 4)}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                                                        {order.items?.length || 0} Items
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-white mb-1">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${statusClass}`}>
                                                    {order.status || 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                                    <Search size={32} className="opacity-20 mb-3" />
                                    <p>No recent orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
