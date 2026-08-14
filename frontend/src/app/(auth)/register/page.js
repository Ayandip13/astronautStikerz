'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useAuthStore(state => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await apiClient.post('/auth/register', { name, email, password });
            if (user.token) {
                localStorage.setItem('token', user.token);
            }
            setUser(user);
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/account/orders');
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-[2.5rem] bg-brand-yellow/10 p-8 sm:p-10 border border-foreground/5 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-4xl font-bold text-foreground">Join the Crew! 🚀</h1>
                    <p className="mt-2 text-foreground/60 font-medium text-lg">Create an account to track your orders.</p>
                </div>
                
                {error && (
                    <div className="mb-6 rounded-2xl bg-brand-coral/10 p-4 text-center font-bold text-brand-coral border border-brand-coral/20">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-foreground/80 pl-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Commander Shepard"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-foreground/10 bg-white px-5 py-4 text-foreground outline-none transition-all focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/20"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-foreground/80 pl-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="astronaut@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border-2 border-foreground/10 bg-white px-5 py-4 text-foreground outline-none transition-all focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/20"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-foreground/80 pl-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border-2 border-foreground/10 bg-white px-5 py-4 pr-12 text-foreground outline-none transition-all focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/20"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-brand-purple transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <Button type="submit" size="lg" variant="primary" className="mt-4 shadow-lg w-full text-lg" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account ✨'}
                    </Button>
                </form>
                
                <div className="mt-8 text-center text-sm font-bold text-foreground/60">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-purple hover:underline">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
