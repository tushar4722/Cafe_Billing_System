import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
    return (
        <div className="bg-slate-700/30 hover:bg-slate-700/50 transition-colors rounded-xl p-3 flex justify-between items-center border border-slate-700/50">
            <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-medium text-white truncate">{item.name}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                    ${item.price.toFixed(2)} x {item.qty} = <span className="text-white font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                    <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">{item.qty}</span>
                    <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
