import { createClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/user-nav";

export async function LandingNav() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-white font-bold text-xl">PickleBall Pro</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex space-x-8">
                            <a href="#courts" className="text-gray-300 hover:text-emerald-400 transition-colors">Courts</a>
                            <a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</a>
                        </div>
                        <UserNav initialUser={user} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
