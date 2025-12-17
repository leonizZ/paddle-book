import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-slate-950/80 border-t border-emerald-500/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="text-white font-bold text-xl">
                                PickleBall Pro
                            </span>
                        </div>
                        <p className="text-gray-400">
                            Premium pickleball courts for players of all levels. Book your
                            court today!
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#courts"
                                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                                >
                                    Courts
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/booking"
                                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                                >
                                    Book Now
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-10 h-10 bg-slate-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <span className="text-white">f</span>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-slate-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <span className="text-white">𝕏</span>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-slate-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <span className="text-white">in</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-emerald-500/20 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 PickleBall Pro. All rights reserved.</p>
                </div>
            </div>
        </footer>

    );
}
