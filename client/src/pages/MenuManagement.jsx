import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  Plus,
  Save,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  X,
  Edit2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ImageWithFallback = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-800/50">
        <ImageIcon size={48} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      onError={() => setError(true)}
    />
  );
};

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    "All",
    "Starters",
    "Main Course",
    "Desserts",
    "Beverages",
    "Sides",
    "Specials",
  ];

  const fetchItems = useCallback(async () => {
    try {
      const res = await api.get("/menu");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        ...item,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      });
    } else {
      setEditId(null);
      setFormData({
        name: "",
        price: "",
        category: "Main Course",
        image: "",
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/menu/${editId}`, formData);
        setItems((prev) => prev.map((i) => (i.id === editId ? formData : i)));
      } else {
        const res = await api.post("/menu", formData);
        setItems([...items, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/menu/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen max-h-screen flex flex-col bg-[#070b19] p-6 overflow-hidden font-sans">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.10] blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-30 rotate-45 pointer-events-none blur-[2px]"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-20 -rotate-45 pointer-events-none blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1 h-full overflow-hidden space-y-6">
        <header className="shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 glass-panel p-6 border-b border-white/10 rounded-2xl bg-black/20">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate("/admin")}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-1 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                Menu Management
              </h1>
              <p className="text-blue-200/60 font-medium">
                Manage your restaurant's offerings
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-80">
              <Search
                className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-400 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search menu items..."
                className="input-field search-input mb-0 bg-black/30 border border-white/10 focus:border-blue-500/50 rounded-xl transition-all shadow-inner w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="btn bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-blue-400/50 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap"
            >
              <Plus size={20} />{" "}
              <span className="hidden md:inline">Add Item</span>
            </button>
            {user && (
              <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-white font-bold text-sm leading-tight">{user.name || 'Admin'}</p>
                  <p className="text-indigo-300 text-xs capitalize">{user.role || 'Administrator'}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Category Filters */}
        <div className="shrink-0 flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-on-mobile">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 border ${activeCategory === cat
                ? "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "bg-black/20 text-slate-400 border-white/5 hover:bg-white/5 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table View */}
        <div className="glass-panel flex-1 overflow-y-auto custom-scrollbar rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-black/40 text-blue-200/70 text-xs font-bold tracking-wider uppercase">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5 font-mono text-slate-500 text-sm font-semibold">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative flex items-center justify-center shadow-inner group-hover:border-blue-500/50 transition-colors">
                        <ImageWithFallback src={item.image} alt={item.name} />
                      </div>
                      <span className="font-bold text-white text-base drop-shadow-sm">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-blue-500/10 rounded-full text-xs font-bold text-blue-300 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-white text-lg">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={async () => {
                          try {
                            const newStatus = !item.isAvailable;
                            await api.put(`/menu/${item.id}`, {
                              isAvailable: newStatus,
                            });
                            setItems((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? { ...i, isAvailable: newStatus }
                                  : i,
                              ),
                            );
                          } catch (err) {
                            console.error("Failed to update status", err);
                          }
                        }}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none border ${item.isAvailable
                          ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          : "bg-white/5 border-white/10"
                          }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform duration-300 shadow-md ${item.isAvailable
                            ? "translate-x-[22px] bg-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]"
                            : "translate-x-0 bg-slate-400"
                            }`}
                        />
                      </button>
                      <span
                        className={`text-xs uppercase tracking-wider font-bold ${item.isAvailable ? "text-emerald-400" : "text-slate-500"}`}
                      >
                        {item.isAvailable ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 pr-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-all opacity-0 group-hover:opacity-100 border border-white/5 hover:border-blue-500/30"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-all opacity-0 group-hover:opacity-100 border border-white/5 hover:border-rose-500/30"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center text-slate-500 border-t border-white/5">
              <Search size={64} className="mb-6 text-blue-500/20" />
              <p className="text-xl font-bold text-slate-400 tracking-wide">
                No menu items found
              </p>
              <p className="text-md mt-2">
                Try adjusting your search or add a new item.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel neon-border neon-border-blue w-full max-w-lg p-8 relative shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-black/40">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              {editId ? (
                <Edit2 className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              ) : (
                <Plus className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              )}
              {editId ? "Edit Menu Item" : "New Menu Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-blue-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                  Item Name
                </label>
                <input
                  className="input-field bg-black/30 border-white/10 focus:border-blue-500/50 focus:bg-black/50 transition-all rounded-xl"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Spicy Chicken Burger"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-blue-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field bg-black/30 border-white/10 focus:border-blue-500/50 focus:bg-black/50 transition-all rounded-xl"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-blue-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="input-field bg-black/30 border border-white/10 focus:border-blue-500/50 focus:bg-black/50 transition-all rounded-xl w-full appearance-none text-white pl-4 pr-10"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      style={{
                        backgroundImage:
                          'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem top 50%",
                        backgroundSize: "0.65rem auto",
                      }}
                    >
                      <option value="" disabled>
                        Select category...
                      </option>
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Sides">Sides</option>
                      <option value="Specials">Specials</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-blue-200/70 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                  Image URL
                </label>
                <div className="flex gap-4 items-start">
                  <input
                    className="input-field flex-1 bg-black/30 border-white/10 focus:border-blue-500/50 focus:bg-black/50 transition-all rounded-xl"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 shadow-inner">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-6 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                {editId ? "Save Changes" : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
