import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            const user = JSON.parse(localStorage.getItem('user'));

            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'cashier') navigate('/cashier');
            else if (user.role === 'staff') navigate('/billing');
            else if (user.role === 'kitchen') navigate('/kitchen');
            else navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#070b19] overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] opacity-[0.15] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.15] blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute top-[20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent opacity-50 rotate-45 pointer-events-none blur-[2px]"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-[#8b5cf6] to-transparent opacity-40 -rotate-45 pointer-events-none blur-[2px]"></div>

            <div className="relative z-10 glass-panel neon-border neon-border-purple p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Welcome Back
                </h2>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm border border-red-500/50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all mt-6">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
