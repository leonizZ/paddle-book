"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Settings, Clock } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Bookings",
            href: "/admin/bookings",
            icon: Calendar,
        },
        {
            name: "Availability",
            href: "/admin/availability",
            icon: Clock,
        },
        {
            name: "Courts",
            href: "/admin/courts",
            icon: LayoutDashboard,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-emerald-500/20 hidden md:block">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="text-white font-bold text-xl">Admin</span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "text-gray-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
