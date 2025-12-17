
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export function ContactSection() {
    return (
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Get in{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions? Were here to help. Reach out to us anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Contact Information
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold mb-1">Location</h4>
                                    <p className="text-gray-400">
                                        123 Pickleball Avenue
                                        <br />
                                        Sports District, City 12345
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold mb-1">Email</h4>
                                    <p className="text-gray-400">info@pickleballpro.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-white font-semibold mb-1">Hours</h4>
                                    <p className="text-gray-400">
                                        24/7 Access Available
                                        <br />
                                        Staff: Mon-Fri 9AM-9PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-500/20 h-[500px]">
                        <iframe
                            src="https://maps.google.com/maps?width=600&height=400&hl=en&q=bacong%20&t=k&z=17&ie=UTF8&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>

    );
}
