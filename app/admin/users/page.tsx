"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Shield, Edit2, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'admin' | 'customer' | 'staff';
    created_at: string;
}

export default function AdminUsersPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            // Fallback for first run if table doesn't exist yet
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: Profile) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: editingUser.role })
                .eq('id', editingUser.id);

            if (error) throw error;

            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
            setIsModalOpen(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user role");
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Manage user roles and permissions
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="p-4 text-slate-400 font-medium text-sm">User</th>
                                    <th className="p-4 text-slate-400 font-medium text-sm">Role</th>
                                    <th className="p-4 text-slate-400 font-medium text-sm">Joined</th>
                                    <th className="p-4 text-slate-400 font-medium text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-white">{user.full_name || "Unknown"}</p>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Role Modal */}
            {isModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl w-full max-w-lg p-6 relative animate-fade-in">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-emerald-500" />
                            Edit User Role
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">User</label>
                                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-slate-300">
                                    {editingUser.full_name} ({editingUser.email})
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Role</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['customer', 'staff', 'admin'].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setEditingUser({ ...editingUser, role: role as Profile['role'] })}
                                            className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all ${editingUser.role === role
                                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                                                }`}
                                        >
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
