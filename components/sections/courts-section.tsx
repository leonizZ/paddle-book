import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

interface Court {
    id: string;
    name: string;
    description: string;
    image_url: string;
    status: string;
    created_at: string;
    updated_at: string;
    hourly_rate: number | null;
    tags: string[] | null;
}

export function CourtsSection({ courts }: { courts: Court[] }) {
    return (
        <section id="courts" className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Courts
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose from our premium indoor courts, each designed for optimal
                        performance and comfort.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Court 1 */}
                    {courts.map((court, index) => (
                        <div key={index} className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={court.image_url}
                                    alt="Court 1"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white">{court.name}</h3>
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
                                        Available
                                    </span>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    Professional blue surface with premium LED lighting. Perfect
                                    for competitive play and tournaments.
                                </p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-gray-300">
                                        <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                                        <span className="text-sm">Open 24/7</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                                        <span className="text-sm">Indoor - Climate Controlled</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/booking?court=${court.id}`}
                                    className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg text-center hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                                >
                                    Book Court {court.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



        </section>

    );
}
