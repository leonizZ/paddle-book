"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { User as SupabaseUser } from "@supabase/supabase-js";

interface UserNavProps {
    initialUser?: SupabaseUser | null;
}

export function UserNav({ initialUser }: UserNavProps) {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (!initialUser) {
            const getUser = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
                setLoading(false);
            };
            getUser();
        }
    }, [initialUser, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.refresh();
        // Optional: redirect to home or login
        // router.push("/"); 
    };

    if (loading) {
        return <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />;
    }

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                >
                    Login
                </Link>
                <Link
                    href="/auth/sign-up"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors"
            >
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                    <User className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-medium max-w-[150px] truncate hidden sm:block">
                    {user.email?.split('@')[0]}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-emerald-500/20 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 border-b border-slate-800">
                            <p className="text-sm text-white font-medium truncate">{user.email}</p>
                        </div>
                        {/* Admin Link - Only show if user is admin (optional logic later) */}
                        <Link
                            href="/admin/bookings"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Admin Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
