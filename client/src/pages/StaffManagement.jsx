import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Plus, Trash2, ArrowLeft, Search, User, Mail, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'cashier' });
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchUsers = useCallback(async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Remove password from payload if it's empty to prevent hashing an empty string
                const payload = { ...formData };
                if (!payload.password) delete payload.password;

                const res = await api.put(`/admin/users/${editId}`, payload);
                setUsers(users.map(u => u.id === editId ? res.data : u));
                alert('User updated successfully.');
            } else {
                const res = await api.post('/admin/users', formData);
                setUsers([...users, res.data]);
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert(`Failed to ${editId ? 'update' : 'create'} user. ${err.response?.data?.message || 'Check details.'}`);
        }
    };

    const handleEdit = (user) => {
        setEditId(user.id);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ name: '', email: '', password: '', role: 'cashier' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative min-h-screen bg-[#070b19] p-6 font-sans overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => navigate('/admin')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-1 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                                Staff Management
                            </h1>
                            <p className="text-teal-200/60 font-medium">Manage your team and their access.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                className="input-field search-input mb-0 bg-black/30 border border-white/10 focus:border-teal-500/50 rounded-xl transition-all shadow-inner w-full"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="btn bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)] border border-teal-400/50 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap">
                            <Plus size={20} /> <span className="hidden md:inline">Add Staff</span>
                        </button>
                        {user && (
                            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(20,184,166,0.5)]">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-white font-bold text-sm leading-tight">{user.name || 'Admin'}</p>
                                    <p className="text-teal-300 text-xs capitalize">{user.role || 'Administrator'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Users Table */}
                <div className="glass-panel overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <table className="w-full text-left text-slate-300">
                        <thead className="bg-black/40 text-teal-200/70 text-xs font-bold tracking-wider uppercase">
                            <tr>
                                <th className="px-6 py-5">Name</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-teal-400 shadow-inner group-hover:border-teal-500/50 transition-colors">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold text-white text-base drop-shadow-sm">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 font-medium">{user.email}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]' :
                                            user.role === 'kitchen' ? 'bg-orange-500/10 text-orange-300 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]' :
                                                'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right w-32">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 bg-white/5 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-all border border-transparent hover:border-blue-500/30"
                                                title="Edit User"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-all border border-transparent hover:border-rose-500/30 disabled:opacity-0 disabled:pointer-events-none"
                                                title="Delete User"
                                                disabled={user.role === 'admin'} // Simple protection
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-16 text-center flex flex-col items-center text-slate-500 border-t border-white/5">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <User size={40} className="text-teal-500/30" />
                            </div>
                            <p className="text-xl font-bold text-slate-400 tracking-wide">No staff members found.</p>
                            <p className="text-md mt-2">Try adjusting your search or add new staff.</p>
                        </div>
                    )}
                </div>

                {/* Add/Edit User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="glass-panel neon-border neon-border-teal w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(20,184,166,0.15)] bg-black/40">
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                            >
                                <span className="text-xl leading-none">&times;</span>
                            </button>

                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                {editId ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                ) : (
                                    <Plus className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                )}
                                {editId ? 'Edit Staff' : 'Add New Staff'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-teal-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                        <input
                                            className="input-field pl-12 mb-0 bg-black/30 border border-white/10 focus:border-teal-500/50 focus:bg-black/50 transition-all rounded-xl w-full"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-teal-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            className="input-field pl-12 mb-0 bg-black/30 border border-white/10 focus:border-teal-500/50 focus:bg-black/50 transition-all rounded-xl w-full"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-teal-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password {editId && <span className="text-slate-500 font-normal normal-case">(leave blank to keep current)</span>}</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            className="input-field pl-12 mb-0 bg-black/30 border border-white/10 focus:border-teal-500/50 focus:bg-black/50 transition-all rounded-xl w-full"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required={!editId}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-teal-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Role</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                        <select
                                            className="input-field pl-12 mb-0 bg-black/30 border border-white/10 focus:border-teal-500/50 focus:bg-black/50 transition-all rounded-xl appearance-none cursor-pointer w-full text-white"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="cashier" className="bg-slate-900">Cashier</option>
                                            <option value="kitchen" className="bg-slate-900">Kitchen Staff</option>
                                            <option value="staff" className="bg-slate-900">Working Staff</option>
                                            <option value="admin" className="bg-slate-900">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 mt-6 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-teal-600 to-emerald-600 shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-500/50 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 transition-all">
                                    {editId ? 'Save Changes' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffManagement;
