import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Plus, Trash2, ArrowLeft, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RecipeManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
    const [addIngredientForm, setAddIngredientForm] = useState({ raw_material_id: '', qty_required: '' });
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedItem) {
            fetchRecipes(selectedItem);
        } else {
            setRecipes([]);
        }
    }, [selectedItem, fetchRecipes]);

    const fetchData = useCallback(async () => {
        try {
            const [menuRes, rawRes] = await Promise.all([
                api.get('/menu'),
                api.get('/inventory')
            ]);
            setMenuItems(menuRes.data);
            setRawMaterials(rawRes.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchRecipes = useCallback(async (itemId) => {
        try {
            const res = await api.get(`/recipes/${itemId}`);
            setRecipes(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleAddIngredientSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItem || !addIngredientForm.raw_material_id || !addIngredientForm.qty_required) return;

        try {
            await api.post('/recipes', {
                menu_item_id: selectedItem,
                raw_material_id: parseInt(addIngredientForm.raw_material_id),
                qty_required: parseFloat(addIngredientForm.qty_required)
            });
            fetchRecipes(selectedItem);
            setIsAddIngredientModalOpen(false);
            setAddIngredientForm({ raw_material_id: '', qty_required: '' });
        } catch (err) {
            alert('Failed to add ingredient. It might already exist for this recipe.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove ingredient?')) return;
        try {
            await api.delete(`/recipes/${id}`);
            setRecipes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#070b19] p-6 overflow-hidden max-h-screen flex flex-col">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1 h-full overflow-hidden">
                <header className="mb-6 flex justify-between items-center glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-1 drop-shadow-[0_0_10px_rgba(192,38,211,0.3)]">Recipe Management</h1>
                            <p className="text-fuchsia-200/60 font-medium">Map ingredients to menu items for auto-deduction</p>
                        </div>
                    </div>
                    {user && (
                        <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(192,38,211,0.5)]">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-white font-bold text-sm leading-tight">{user.name || 'Admin'}</p>
                                <p className="text-fuchsia-300 text-xs capitalize">{user.role || 'Administrator'}</p>
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
                    {/* Menu Item Selector */}
                    <div className="lg:col-span-1 glass-panel p-0 overflow-hidden flex flex-col border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl relative h-full">
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-fuchsia-500 to-transparent opacity-50"></div>
                        <div className="p-5 border-b border-white/10 bg-black/40">
                            <h3 className="font-bold text-fuchsia-300 uppercase tracking-wider text-sm flex items-center gap-2">
                                <Link size={16} className="text-fuchsia-500" /> Select Dish
                            </h3>
                        </div>
                        <div className="overflow-y-auto p-3 space-y-1.5 custom-scrollbar flex-1">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItem(item.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all flex justify-between items-center group ${selectedItem === item.id
                                        ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-white shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                                        : 'text-slate-300 hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <span className="font-medium">{item.name}</span>
                                    {selectedItem === item.id
                                        ? <Link size={18} className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]" />
                                        : <Link size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    }
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recipe Editor */}
                    <div className="lg:col-span-2 glass-panel p-0 flex flex-col border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden h-full">
                        {selectedItem ? (
                            <div className="flex flex-col h-full animate-in fade-in duration-300">
                                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40 shrink-0">
                                    <div>
                                        <h2 className="text-3xl font-black text-white drop-shadow-md mb-1">{menuItems.find(i => i.id === selectedItem)?.name}</h2>
                                        <p className="text-fuchsia-200/60 text-sm font-medium">Ingredients to deduct on order</p>
                                    </div>
                                    <button onClick={() => setIsAddIngredientModalOpen(true)} className="btn bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(192,38,211,0.4)] border border-fuchsia-500/50 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all">
                                        <Plus size={20} /> Add Ingredient
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="text-fuchsia-200/70 text-xs uppercase tracking-wider font-bold">
                                            <tr>
                                                <th className="p-4 border-b border-white/10">Ingredient</th>
                                                <th className="p-4 border-b border-white/10">Qty Required</th>
                                                <th className="p-4 border-b border-white/10 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-200 relative">
                                            {recipes.map((recipe) => (
                                                <tr key={recipe.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4 font-bold text-lg border-b border-white/5">{recipe.RawMaterial?.name || `ID: ${recipe.raw_material_id}`}</td>
                                                    <td className="p-4 border-b border-white/5">
                                                        <span className="font-mono text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1.5 rounded-lg border border-fuchsia-500/20 font-bold shadow-[0_0_10px_rgba(217,70,239,0.1)]">
                                                            {recipe.qty_required} <span className="text-fuchsia-200/50 text-sm">{recipe.RawMaterial?.unit}</span>
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right border-b border-white/5">
                                                        <button onClick={() => handleDelete(recipe.id)} className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-500/30">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {recipes.length === 0 && (
                                                <tr><td colSpan="3" className="p-12 text-center text-slate-500 bg-black/20 rounded-xl border border-white/5 border-dashed mt-4">
                                                    <Link size={32} className="mx-auto mb-3 opacity-20 text-fuchsia-400" />
                                                    <p className="text-lg font-bold">No ingredients mapped yet.</p>
                                                    <p className="text-sm">Click "Add Ingredient" to start building the recipe.</p>
                                                </td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-6 bg-black/40 border-t border-white/10 shrink-0">
                                    <h4 className="font-bold text-fuchsia-300/80 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></div> Reference: Raw Materials
                                    </h4>
                                    <div className="flex flex-wrap gap-2.5 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                        {rawMaterials.map(rm => (
                                            <span key={rm.id} className="text-xs font-medium bg-black/30 text-slate-300 px-3 py-1.5 rounded-full border border-white/10 hover:border-fuchsia-500/30 transition-colors cursor-default hover:text-white">
                                                <span className="text-slate-500 mr-2 border-r border-white/10 pr-2 pb-0.5">ID {rm.id}</span>
                                                {rm.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-black/20 m-6 rounded-3xl border border-white/5 border-dashed">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Link size={48} className="text-fuchsia-500 opacity-40 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-300 mb-2">Select a Dish</h3>
                                <p className="text-slate-400 max-w-sm">Choose an item from the menu list to view or modified its associated raw material recipe.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Ingredient Modal */}
                {isAddIngredientModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="glass-panel neon-border neon-border-purple w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(192,38,211,0.15)] bg-black/40">
                            <button
                                onClick={() => setIsAddIngredientModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                            >
                                <span className="text-xl leading-none">&times;</span>
                            </button>

                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <Plus className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" /> Add Ingredient
                            </h2>
                            <p className="text-slate-400 mb-6 text-sm">Select an inventory material to link to <strong className="text-white">{menuItems.find(i => i.id === selectedItem)?.name}</strong>.</p>

                            <form onSubmit={handleAddIngredientSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-fuchsia-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Raw Material</label>
                                    <select
                                        className="input-field mb-0 bg-black/30 border border-white/10 focus:border-fuchsia-500/50 focus:bg-black/50 transition-all rounded-xl w-full appearance-none text-white"
                                        value={addIngredientForm.raw_material_id}
                                        onChange={e => setAddIngredientForm({ ...addIngredientForm, raw_material_id: e.target.value })}
                                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                                        required
                                    >
                                        <option value="" disabled>Select a material...</option>
                                        {rawMaterials.map(rm => (
                                            <option key={rm.id} value={rm.id}>{rm.name} (per {rm.unit})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-fuchsia-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Quantity Required</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="input-field mb-0 bg-black/30 border border-white/10 focus:border-fuchsia-500/50 focus:bg-black/50 transition-all rounded-xl w-full pr-16"
                                            placeholder="e.g. 0.2"
                                            value={addIngredientForm.qty_required}
                                            onChange={e => setAddIngredientForm({ ...addIngredientForm, qty_required: e.target.value })}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                        <span className="absolute right-4 top-3.5 text-slate-500 font-medium text-sm">
                                            {addIngredientForm.raw_material_id ? rawMaterials.find(rm => rm.id === parseInt(addIngredientForm.raw_material_id))?.unit : ''}
                                        </span>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 mt-6 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-[0_0_20px_rgba(192,38,211,0.3)] border border-fuchsia-500/50 hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-purple-500 transition-all">
                                    Save Ingredient
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeManagement;
