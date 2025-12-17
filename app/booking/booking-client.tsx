"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, ChevronRight, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Court, TimeSlot } from "@/lib/types/booking";
import { useRouter } from "next/navigation";

interface BookingClientProps {
    courts: Court[];
    timeSlots: TimeSlot[];
}

export default function BookingClient({ courts, timeSlots }: BookingClientProps) {
    const router = useRouter();
    const supabase = createClient();

    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toLocaleDateString('en-CA')
    );
    const [bookedSlotIds, setBookedSlotIds] = useState<Set<string>>(new Set());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    name: user.user_metadata?.full_name || "",
                    email: user.email || "",
                    phone: user.user_metadata?.phone || ""
                }));
            }
        };
        fetchUser();
    }, [supabase]);

    // Fetch booked slots when court or date changes
    useEffect(() => {
        async function fetchAvailability() {
            if (!selectedCourt || !selectedDate) return;

            setCheckingAvailability(true);
            try {
                const { data, error } = await supabase
                    .from("bookings")
                    .select("time_slot_id")
                    .eq("court_id", selectedCourt.id)
                    .eq("booking_date", selectedDate)
                    .neq("status", "cancelled"); // Don't count cancelled bookings

                if (error) throw error;

                const bookedIds = new Set<string>(data.map((b: any) => b.time_slot_id));
                setBookedSlotIds(bookedIds);
            } catch (err) {
                console.error("Error fetching availability:", err);
            } finally {
                setCheckingAvailability(false);
            }
        }

        fetchAvailability();
    }, [selectedCourt, selectedDate, supabase]);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourt || !selectedTimeSlot || !formData.name || !formData.email) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("bookings")
                .insert({
                    court_id: selectedCourt.id,
                    time_slot_id: selectedTimeSlot.id,
                    booking_date: selectedDate,
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone || null,
                    user_id: user?.id || null,
                    status: "pending",
                    total_amount: selectedCourt.hourly_rate || 0,
                })
                .select()
                .single();

            if (error) throw error;

            // Redirect to confirmation page with success flag
            router.push(`/booking/confirm?success=true&bookingId=${data.id}`);

        } catch (err) {
            console.error("Booking failed:", err);
            alert("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Sort time slots by time
    const sortedTimeSlots = [...timeSlots].sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Book Your Court
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Find the perfect time to play.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Selection Flow */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Step 1: Select Court */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold">1</span>
                                Select a Court
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {courts.map((court) => (
                                    <div
                                        key={court.id}
                                        onClick={() => {
                                            setSelectedCourt(court);
                                            setSelectedTimeSlot(null); // Reset time when court changes
                                        }}
                                        className={`cursor-pointer group relative overflow-hidden rounded-xl border transition-all duration-300 ${selectedCourt?.id === court.id
                                            ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20"
                                            : "border-slate-800 bg-slate-900 hover:border-slate-700"
                                            }`}
                                    >
                                        <div className="aspect-video relative bg-slate-800">
                                            {court.image_url ? (
                                                <Image
                                                    src={court.image_url}
                                                    alt={court.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-600">
                                                    <ImageIcon className="w-12 h-12" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-3 left-3">
                                                <h3 className="font-bold text-white">{court.name}</h3>
                                                <p className="text-emerald-400 text-sm font-medium">
                                                    ${court.hourly_rate ?? 20}/hour
                                                </p>
                                            </div>
                                            {selectedCourt?.id === court.id && (
                                                <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Step 2: Date & Time */}
                        <section className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm transition-opacity duration-300 ${!selectedCourt ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold">2</span>
                                Date & Time
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Select Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        min={new Date().toLocaleDateString('en-CA')}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedTimeSlot(null);
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Available Slots</label>
                                    {checkingAvailability ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                            {sortedTimeSlots.map((slot) => {
                                                const isBooked = bookedSlotIds.has(slot.id);
                                                const isSelected = selectedTimeSlot?.id === slot.id;

                                                return (
                                                    <button
                                                        key={slot.id}
                                                        disabled={isBooked}
                                                        onClick={() => setSelectedTimeSlot(slot)}
                                                        className={`px-2 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${isBooked
                                                            ? "bg-slate-800/50 text-slate-600 border-transparent cursor-not-allowed decoration-slate-600 line-through"
                                                            : isSelected
                                                                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                                                : "bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-white"
                                                            }`}
                                                    >
                                                        {slot.start_time.slice(0, 5)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Booking Summary & Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/50">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
                                <CalendarIcon className="w-5 h-5 text-emerald-500" />
                                Booking Summary
                            </h3>

                            <div className="space-y-4 mb-6 relative">
                                {!selectedCourt && !selectedTimeSlot && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-[1px] z-10 rounded-lg">
                                        <p className="text-sm text-slate-500">Select court and time to proceed</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Court</span>
                                    <span className="font-medium">{selectedCourt?.name || "-"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Date</span>
                                    <span className="font-medium">{selectedDate ? format(new Date(selectedDate), "MMM dd, yyyy") : "-"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Time</span>
                                    <span className="font-medium">
                                        {selectedTimeSlot ? `${selectedTimeSlot.start_time.slice(0, 5)} - ${selectedTimeSlot.end_time.slice(0, 5)}` : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                    <span className="text-slate-400 text-sm">Price</span>
                                    <span className="font-medium text-emerald-400">${selectedCourt?.hourly_rate ?? 20}</span>
                                </div>
                            </div>

                            <form onSubmit={handleBook} className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Your Details</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none mb-3"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none mb-3"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (Optional)"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!selectedCourt || !selectedTimeSlot || loading}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Confirm Booking
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
