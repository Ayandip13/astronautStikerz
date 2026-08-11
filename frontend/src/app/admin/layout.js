'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    Package, 
    Tags, 
    ShoppingCart, 
    LogOut,
    Menu,
    X,
    MessageSquare
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import useAuthStore from '@/store/authStore';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Design Requests', href: '/admin/design-requests', icon: MessageSquare },
];

export default function AdminLayout({ children }) {
    const { user, setUser, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!user) {
                    const currentUser = await apiClient.get('/auth/me');
                    setUser(currentUser);
                    if (currentUser.role !== 'admin') {
                        router.push('/login');
                    }
                } else if (user.role !== 'admin') {
                    router.push('/login');
                }
            } catch (err) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [user, router, setUser]);

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
            logout();
            router.push('/login');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-50">
                <span className="text-zinc-500">Loading admin...</span>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900 font-sans selection:bg-brand-purple/20">
            {/* Sidebar Desktop */}
            <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white md:flex">
                <div className="flex h-16 shrink-0 items-center border-b border-zinc-200 px-6">
                    <span className="font-display text-xl font-bold tracking-tight">Admin Portal</span>
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive 
                                        ? 'bg-brand-purple text-white' 
                                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-zinc-200 p-4">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5 text-red-500" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
                        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200">
                            <span className="font-display text-xl font-bold">Admin Portal</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-6 w-6 text-zinc-500" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium ${
                                            isActive 
                                                ? 'bg-brand-purple text-white' 
                                                : 'text-zinc-600 hover:bg-zinc-100'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-zinc-200">
                            <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                    <button
                        className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    
                    <div className="flex flex-1 items-center justify-end">
                        <div className="flex items-center gap-3">
                            <div className="hidden text-right text-sm sm:block">
                                <p className="font-medium text-zinc-900">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-zinc-50 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-zinc-100">
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <LogOut className="h-6 w-6" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-zinc-900">Sign Out</h3>
                            <p className="mt-2 text-sm text-zinc-500">Are you sure you want to sign out of the admin portal?</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setIsLogoutModalOpen(false);
                                    handleLogout();
                                }}
                                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 shadow-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
