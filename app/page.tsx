import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { LandingNav } from "@/components/landing-nav";
import { CourtsSection } from "@/components/sections/courts-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/sections/footer";
import supabase from "@/lib/supabase";

export default async function LandingPage() {

  const [courtsResult] = await Promise.all([
    supabase
      .from("courts")
      .select("*")
      .eq("status", "active")
      .order("name"),
  ]);

  const courts = courtsResult.data ?? [];

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
            src="/images/hero-court.jpeg"
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
              professional lighting, and unmatched playing conditions. test
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

      <Suspense fallback={<p>Loading courts...</p>}>
        <CourtsSection courts={courts} />
      </Suspense>
      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
