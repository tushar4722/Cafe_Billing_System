import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Reports = () => {
    const [salesData, setSalesData] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchSales = useCallback(async () => {
        try {
            const res = await api.get('/reports/sales');
            setSalesData(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const data = {
        labels: salesData.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Total Sales',
                data: salesData.map(d => d.totalSales),
                borderColor: '#c084fc', // Bright Purple
                backgroundColor: 'rgba(192, 132, 252, 0.15)', // Light Purple Fill
                borderWidth: 3,
                pointBackgroundColor: '#e879f9',
                pointBorderColor: '#070b19',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#cbd5e1', font: { family: "'Inter', sans-serif", weight: 'bold' } }
            },
            title: {
                display: true,
                text: 'Daily Sales Overview',
                color: '#f8fafc',
                font: { size: 18, family: "'Inter', sans-serif", weight: 'bold' },
                padding: { bottom: 20 }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#e2e8f0',
                bodyColor: '#e879f9',
                borderColor: 'rgba(192, 132, 252, 0.3)',
                borderWidth: 1,
                padding: 12,
                titleFont: { size: 14, family: "'Inter', sans-serif" },
                bodyFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" }, callback: (val) => '$' + val },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                border: { dash: [4, 4] }
            },
            x: {
                ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } },
                grid: { color: 'transparent' }
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-[#070b19] p-6 overflow-hidden font-sans">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => navigate('/admin')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">Sales Reports</h1>
                            <p className="text-purple-200/60 font-medium">Visualize your restaurant performance</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto items-center">
                        {/* Date Picker Placeholder */}
                        <button className="btn bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all w-full md:w-auto">
                            <Calendar size={18} className="text-purple-400" /> Last 30 Days
                        </button>
                        {user && (
                            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-white font-bold text-sm leading-tight">{user.name || 'Admin'}</p>
                                    <p className="text-purple-300 text-xs capitalize">{user.role || 'Administrator'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="glass-panel p-6 mb-8 border border-white/10 bg-black/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="h-[400px]">
                        {salesData.length > 0 ? <Line data={data} options={options} /> : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                </div>
                                <p className="font-medium">Loading sales data...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-panel p-0 border border-white/10 bg-black/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                    <div className="p-6 border-b border-white/10 bg-black/40">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full"></span> Detailed Breakdown
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-purple-200/70 text-xs font-bold uppercase tracking-wider">
                                <tr className="border-b border-white/10">
                                    <th className="p-5">Date</th>
                                    <th className="p-5 text-center">Orders</th>
                                    <th className="p-5 text-right">Total Sales</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-200 divide-y divide-white/5">
                                {salesData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 font-mono text-sm text-slate-400 group-hover:text-slate-300">{new Date(row.date).toLocaleDateString()}</td>
                                        <td className="p-5 text-center font-bold text-slate-300">
                                            <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">{row.orderCount}</span>
                                        </td>
                                        <td className="p-5 text-right font-black text-purple-400 text-lg drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]">
                                            ${parseFloat(row.totalSales).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {salesData.length === 0 && (
                                    <tr><td colSpan="3" className="p-12 text-center text-slate-500">No data available for this period.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
