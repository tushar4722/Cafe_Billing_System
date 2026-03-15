import { Plus } from 'lucide-react';

const MenuCard = ({ item, onAdd }) => {
    return (
        <div
            onClick={() => onAdd(item)}
            className="glass-panel group relative overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full"
        >
            <div className="aspect-video w-full bg-slate-800 relative overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800/50">
                        <span className="text-4xl">🍽️</span>
                    </div>
                )}
                <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Plus size={20} />
                </button>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">{item.name}</h3>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-sm whitespace-nowrap ml-2">
                        ${item.price.toFixed(2)}
                    </span>
                </div>
                <p className="text-secondary text-xs font-bold uppercase tracking-wider mt-auto">{item.category}</p>
            </div>
        </div>
    );
};

export default MenuCard;
