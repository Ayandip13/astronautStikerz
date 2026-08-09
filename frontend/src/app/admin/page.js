'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import useAuthStore from '@/store/authStore';

export default function AdminDashboard() {
    const { user, setUser, logout } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await apiClient.get('/auth/me');
                setUser(currentUser);
                if (currentUser.role !== 'admin') {
                    router.push('/login');
                } else {
                    // Test an admin endpoint
                    const cats = await apiClient.get('/categories');
                    setCategories(cats);
                }
            } catch (err) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router, setUser]);

    const handleLogout = async () => {
        await apiClient.post('/auth/logout');
        logout();
        router.push('/login');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
            </div>
            
            <p className="mb-4">Welcome, {user?.name} (Admin)</p>
            
            <div className="border p-4 rounded border-gray-600">
                <h2 className="text-xl font-semibold mb-2">Categories (Admin View)</h2>
                {categories.length === 0 ? <p>No categories found</p> : (
                    <ul className="list-disc pl-5">
                        {categories.map(c => <li key={c._id}>{c.name}</li>)}
                    </ul>
                )}
            </div>
        </div>
    );
}
