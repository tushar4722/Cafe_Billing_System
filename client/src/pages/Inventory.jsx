import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { AlertTriangle, Plus, Save, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Inventory = () => {
    const [materials, setMaterials] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', unit: 'kg', minimum_stock: 10 });
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchMaterials = useCallback(async () => {
        try {
            const res = await api.get('/inventory');
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleEdit = (material) => {
        setEditId(material.id);
        setEditForm(material);
    };

    const handleSave = async () => {
        try {
            await api.put(`/inventory/${editId}`, editForm);
            setMaterials(prev => prev.map(m => m.id === editId ? editForm : m));
            setEditId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/inventory/${id}`);
            setMaterials(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/inventory', { ...addForm, current_stock: 0 });
            setMaterials([...materials, res.data]);
            setIsAddModalOpen(false);
            setAddForm({ name: '', unit: 'kg', minimum_stock: 10 });
        } catch (err) {
            console.error(err);
            alert('Failed to add material.');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#070b19] p-6 overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                <header className="mb-8 flex justify-between items-center glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Inventory Management</h1>
                            <p className="text-cyan-200/60 font-medium">Track raw materials and stock levels</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsAddModalOpen(true)} className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-cyan-400/50 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all">
                            <Plus size={20} /> Add Material
                        </button>
                        {user && (
                            <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-white font-bold text-sm leading-tight">{user.name || 'Admin'}</p>
                                    <p className="text-cyan-300 text-xs capitalize">{user.role || 'Administrator'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="glass-panel overflow-hidden border border-white/10 bg-black/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 text-cyan-200/70 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-bold">Name</th>
                                <th className="p-5 font-bold">Unit</th>
                                <th className="p-5 font-bold">Current Stock</th>
                                <th className="p-5 font-bold">Min Stock</th>
                                <th className="p-5 font-bold">Status</th>
                                <th className="p-5 text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-200 divide-y divide-white/5">
                            {materials.map(m => (
                                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5 font-medium flex items-center gap-3">
                                        {editId === m.id ? (
                                            <input
                                                className="input-field mb-0 p-1 text-sm bg-slate-800"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        ) : m.name}
                                    </td>
                                    <td className="p-4">
                                        {editId === m.id ? (
                                            <select
                                                className="input-field mb-0 p-1 text-sm bg-slate-800 w-20 appearance-none text-center"
                                                value={editForm.unit}
                                                onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                                            >
                                                <option value="kg">kg</option>
                                                <option value="g">g</option>
                                                <option value="liters">liters</option>
                                                <option value="ml">ml</option>
                                                <option value="pcs">pcs</option>
                                                <option value="boxes">boxes</option>
                                                <option value="bottles">bottles</option>
                                            </select>
                                        ) : m.unit}
                                    </td>
                                    <td className="p-4">
                                        {editId === m.id ? (
                                            <input
                                                type="number"
                                                className="input-field mb-0 p-1 text-sm bg-slate-800 w-24"
                                                value={editForm.current_stock}
                                                onChange={e => setEditForm({ ...editForm, current_stock: parseFloat(e.target.value) })}
                                            />
                                        ) : (
                                            <span className={m.current_stock < m.minimum_stock ? 'text-red-400 font-bold' : ''}>
                                                {m.current_stock}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editId === m.id ? (
                                            <input
                                                type="number"
                                                className="input-field mb-0 p-1 text-sm bg-slate-800 w-24"
                                                value={editForm.minimum_stock}
                                                onChange={e => setEditForm({ ...editForm, minimum_stock: parseFloat(e.target.value) })}
                                            />
                                        ) : m.minimum_stock}
                                    </td>
                                    <td className="p-5">
                                        {m.current_stock < m.minimum_stock ? (
                                            <span className="flex items-center gap-1.5 text-rose-400 text-xs uppercase tracking-wider font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full max-w-fit shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                                <AlertTriangle size={14} /> Low Stock
                                            </span>
                                        ) : (
                                            <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">In Stock</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right space-x-3">
                                        {editId === m.id ? (
                                            <button onClick={handleSave} className="text-green-400 hover:text-green-300"><Save size={18} /></button>
                                        ) : (
                                            <button onClick={() => handleEdit(m)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                        )}
                                        <button onClick={() => handleDelete(m.id)} className="p-2 bg-white/5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Material Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="glass-panel neon-border neon-border-blue w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-black/40">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                            >
                                <span className="text-xl leading-none">&times;</span>
                            </button>

                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <Plus className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" /> Add Material
                            </h2>

                            <form onSubmit={handleAddSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-cyan-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Material Name</label>
                                    <input
                                        className="input-field mb-0 bg-black/30 border border-white/10 focus:border-cyan-500/50 focus:bg-black/50 transition-all rounded-xl w-full"
                                        placeholder="e.g. Tomato Paste"
                                        value={addForm.name}
                                        onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-cyan-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Unit</label>
                                        <select
                                            className="input-field mb-0 bg-black/30 border border-white/10 focus:border-cyan-500/50 focus:bg-black/50 transition-all rounded-xl w-full appearance-none text-white"
                                            value={addForm.unit}
                                            onChange={e => setAddForm({ ...addForm, unit: e.target.value })}
                                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                                        >
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="liters">liters</option>
                                            <option value="ml">ml</option>
                                            <option value="pcs">pcs</option>
                                            <option value="boxes">boxes</option>
                                            <option value="bottles">bottles</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-cyan-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Min Stock</label>
                                        <input
                                            type="number"
                                            className="input-field mb-0 bg-black/30 border border-white/10 focus:border-cyan-500/50 focus:bg-black/50 transition-all rounded-xl w-full"
                                            value={addForm.minimum_stock}
                                            onChange={e => setAddForm({ ...addForm, minimum_stock: parseFloat(e.target.value) })}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 mt-6 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/50 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all">
                                    Create Material
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
