'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import useAuthStore from '@/store/authStore';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const setUser = useAuthStore(state => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await apiClient.post('/auth/register', { name, email, password });
            setUser(user);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded text-black"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded text-black"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded text-black"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
