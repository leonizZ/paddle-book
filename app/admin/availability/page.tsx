"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Court, TimeSlot, Booking } from "@/lib/types/booking";

export default function AdminAvailabilityPage() {
  const supabase = createClient();
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [courts, setCourts] = useState<Court[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courts and time slots on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courts
        const { data: courtsData, error: courtsError } = await supabase
          .from("courts")
          .select("*")
          .order("name");

        if (courtsError) throw courtsError;

        // Fetch time slots
        const { data: slotsData, error: slotsError } = await supabase
          .from("time_slots")
          .select("*")
          .order("start_time");

        if (slotsError) throw slotsError;

        setCourts(courtsData || []);
        setTimeSlots(slotsData || []);

        // Set default court if available
        if (courtsData && courtsData.length > 0) {
          setSelectedCourt(courtsData[0].id);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Initialize date on client side to avoid hydration mismatch
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Fetch blocked and booked slots when court or date changes
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedCourt || !selectedDate) return;

      try {
        // Fetch blocked slots (status = 'maintenance')
        const { data: blockedData, error: blockedError } = await supabase
          .from("bookings")
          .select("time_slot_id")
          .eq("court_id", selectedCourt)
          .eq("booking_date", selectedDate)
          .eq("status", "maintenance");

        if (blockedError) throw blockedError;

        // Fetch booked slots (status = 'confirmed')
        const { data: bookedData, error: bookedError } = await supabase
          .from("bookings")
          .select("time_slot_id")
          .eq("court_id", selectedCourt)
          .eq("booking_date", selectedDate)
          .eq("status", "confirmed");

        if (bookedError) throw bookedError;

        setBlockedSlots((blockedData || []).map((b) => b.time_slot_id));
        setBookedSlots((bookedData || []).map((b) => b.time_slot_id));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [selectedCourt, selectedDate, supabase]);

  if (!selectedDate || loading) {
    return (
      <div className="p-8 text-white flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const handleToggleSlot = async (slotId: string) => {
    if (!selectedCourt || !selectedDate) return;

    const isBlocked = blockedSlots.includes(slotId);

    try {
      if (isBlocked) {
        // Unblock: Delete the maintenance booking
        const { error: deleteError } = await supabase
          .from("bookings")
          .delete()
          .eq("court_id", selectedCourt)
          .eq("booking_date", selectedDate)
          .eq("time_slot_id", slotId)
          .eq("status", "maintenance");

        if (deleteError) throw deleteError;

        setBlockedSlots(blockedSlots.filter((id) => id !== slotId));
      } else {
        // Block: Create a maintenance booking
        // First check if there's already a booking (confirmed) - can't block booked slots
        if (bookedSlots.includes(slotId)) {
          alert("This slot is already booked. Cannot block booked slots.");
          return;
        }

        const { error: insertError } = await supabase.from("bookings").insert({
          court_id: selectedCourt,
          booking_date: selectedDate,
          time_slot_id: slotId,
          customer_name: "System",
          customer_email: "system@admin.com",
          status: "maintenance",
        });

        if (insertError) {
          if (insertError.code === "23505") {
            alert("This slot is already blocked or booked.");
          } else {
            throw insertError;
          }
          return;
        }

        setBlockedSlots([...blockedSlots, slotId]);
      }
    } catch (error) {
      console.error("Error toggling slot:", error);
      alert("Failed to update slot availability. Please try again.");
    }
  };

  const getSlotStatus = (slotId: string) => {
    if (blockedSlots.includes(slotId)) return "blocked";
    if (bookedSlots.includes(slotId)) return "booked";
    return "available";
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Availability Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage court schedules and block time slots
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">
                Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Select Court
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {courts.length === 0 ? (
                      <p className="text-gray-400 text-sm col-span-2">
                        No courts available
                      </p>
                    ) : (
                      courts.map((court) => (
                        <button
                          key={court.id}
                          onClick={() => setSelectedCourt(court.id)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedCourt === court.id
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "bg-slate-800 border-slate-700 text-gray-400 hover:border-gray-600"
                          }`}
                        >
                          {court.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-400">
                    Blocking a slot prevents users from booking it. Use this for
                    maintenance, holidays, or private events.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Time Slots for{" "}
                  {new Date(selectedDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
                    <span className="text-gray-400">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <span className="text-gray-400">Blocked</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {timeSlots.length === 0 ? (
                  <p className="text-gray-400 text-center col-span-2 py-8">
                    No time slots available
                  </p>
                ) : (
                  timeSlots.map((slot) => {
                    const status = getSlotStatus(slot.id);
                    const isBlocked = status === "blocked";
                    const isBooked = status === "booked";
                    const startTime = slot.start_time.substring(0, 5);
                    const endTime = slot.end_time.substring(0, 5);
                    const label = `${startTime} - ${endTime}`;

                    return (
                      <button
                        key={slot.id}
                        onClick={() => !isBooked && handleToggleSlot(slot.id)}
                        disabled={isBooked}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                          isBlocked
                            ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                            : isBooked
                            ? "bg-blue-500/10 border-blue-500/30 opacity-75 cursor-not-allowed"
                            : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock
                            className={`w-5 h-5 ${
                              isBlocked
                                ? "text-red-400"
                                : isBooked
                                ? "text-blue-400"
                                : "text-emerald-400"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              isBlocked
                                ? "text-red-200"
                                : isBooked
                                ? "text-blue-200"
                                : "text-white"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {isBlocked ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : isBooked ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
