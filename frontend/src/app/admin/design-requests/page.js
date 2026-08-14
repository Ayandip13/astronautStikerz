'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DesignRequestsAdminPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await apiClient.get('/design-requests');
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch design requests:', error);
            alert('Failed to load design requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await apiClient.put(`/design-requests/${requestId}/status`, { status: newStatus });
            // Update local state
            setRequests(requests.map(req => 
                req._id === requestId ? { ...req, status: newStatus } : req
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'fulfilled': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
        }
    };

    const getImageUrl = (image) => {
        if (!image) return '/placeholder.jpg';
        let url = typeof image === 'string' ? image : image.url;
        if (!url) return '/placeholder.jpg';
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        if (url.startsWith('http://localhost:5000/uploads')) {
            url = url.replace('http://localhost:5000', baseUrl);
        } else if (url.startsWith('/uploads')) {
            url = `${baseUrl}${url}`;
        }
        return url;
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = 
            req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.message && req.message.toLowerCase().includes(searchTerm.toLowerCase()));
            
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold font-display text-zinc-900">Custom Design Requests</h1>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-zinc-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User Details</th>
                                <th className="px-6 py-4 font-semibold">Request Message</th>
                                <th className="px-6 py-4 font-semibold">Design Artwork</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                                        No design requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req._id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-bold text-zinc-900">{req.name}</div>
                                            <div className="text-zinc-500">{req.email}</div>
                                            {req.phone && <div className="text-zinc-500">{req.phone}</div>}
                                            {req.user && <div className="mt-1 text-xs bg-brand-purple/10 text-brand-purple inline-block px-2 py-0.5 rounded-full font-bold">Registered User</div>}
                                        </td>
                                        
                                        <td className="px-6 py-4 align-top max-w-xs">
                                            <p className="text-zinc-700 whitespace-pre-wrap">{req.message}</p>
                                        </td>
                                        
                                        <td className="px-6 py-4 align-top">
                                            {req.designId ? (
                                                <a 
                                                    href={getImageUrl(req.designId.imageUrl)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group relative block w-24 h-24 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100"
                                                >
                                                    <img 
                                                        src={getImageUrl(req.designId.imageUrl)} 
                                                        alt="User Design" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="w-5 h-5 text-white" />
                                                    </div>
                                                </a>
                                            ) : (
                                                <span className="text-zinc-400 italic">No image</span>
                                            )}
                                        </td>
                                        
                                        <td className="px-6 py-4 align-top">
                                            <select
                                                value={req.status}
                                                onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none ${getStatusColor(req.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="fulfilled">Fulfilled</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                        
                                        <td className="px-6 py-4 align-top text-zinc-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                            <br />
                                            {new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
