import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Suspense } from "react";
import { LandingNav } from "@/components/landing-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Navigation */}
      <Suspense
        fallback={
          <div className="fixed top-0 w-full h-16 z-50 bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/20" />
        }
      >
        <LandingNav />
      </Suspense>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-court.png"
            alt="Pickleball Court"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-emerald-950/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Premium Pickleball
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Courts Await
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience world-class facilities with state-of-the-art courts,
              professional lighting, and unmatched playing conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/booking"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50"
              >
                <span className="relative z-10">Book Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <a
                href="#courts"
                className="px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 transition-all duration-300"
              >
                View Courts
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">2</div>
              <div className="text-gray-400 text-sm">Premium Courts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                100+
              </div>
              <div className="text-gray-400 text-sm">Happy Players</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Courts Section */}
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
            <div className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/images/court-1.png"
                  alt="Court 1"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Court 1</h3>
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
                  href="/booking?court=1"
                  className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg text-center hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                >
                  Book Court 1
                </Link>
              </div>
            </div>

            {/* Court 2 */}
            <div className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                <Image
                  src="/images/court-2.png"
                  alt="Pickleball Court 2"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Recreational
                </div>
              </div>
              <div className="p-6 relative z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Court 2</h3>
                <p className="text-gray-400 mb-6">
                  Vibrant green surface with modern amenities. Ideal for
                  recreational play and training sessions.
                </p>
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Outdoor
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Standard Net
                  </div>
                </div>
                <Link
                  href="/booking?court=2"
                  className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg text-center hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                >
                  Book Court 2
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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

      {/* Footer */}
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
    </div>
  );
}
