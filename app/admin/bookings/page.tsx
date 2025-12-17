"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  User,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Booking, TimeSlot, Court } from "@/lib/types/booking";

export default function AdminBookingsPage() {
  const supabase = createClient();
  // Initialize with a stable value to prevent hydration mismatch
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{
    court: Court | null;
    timeSlot: TimeSlot | null;
  }>({ court: null, timeSlot: null });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Form State
  const [formData, setFormData] = useState({
    courtId: "",
    date: "",
    timeSlotId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  // Fetch data on mount
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

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .order("booking_date", { ascending: false });

        if (bookingsError) throw bookingsError;

        setCourts(courtsData || []);
        setTimeSlots(slotsData || []);
        setBookings(bookingsData || []);

        // Set default court if available
        if (courtsData && courtsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            courtId: courtsData[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Set initial dates on client side only
  useEffect(() => {
    setCurrentDate(new Date());
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  // Calendar Logic
  const getDaysInMonth = (date: Date | null) => {
    if (!date) return { days: 0, firstDay: 0 };
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  // Don't render until client-side hydration is complete
  if (!currentDate || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleBookingClick = async (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);

    // Fetch court and time slot details
    try {
      const [courtResult, timeSlotResult] = await Promise.all([
        supabase.from("courts").select("*").eq("id", booking.court_id).single(),
        supabase
          .from("time_slots")
          .select("*")
          .eq("id", booking.time_slot_id)
          .single(),
      ]);

      if (courtResult.data)
        setBookingDetails((prev) => ({ ...prev, court: courtResult.data }));
      if (timeSlotResult.data)
        setBookingDetails((prev) => ({
          ...prev,
          timeSlot: timeSlotResult.data,
        }));
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get court hourly rate
      const court = courts.find((c) => c.id === formData.courtId);
      const hourlyRate = (court as any)?.hourly_rate || 20.0;

      // Create booking in Supabase
      const { data: newBooking, error } = await supabase
        .from("bookings")
        .insert({
          court_id: formData.courtId,
          booking_date: formData.date,
          time_slot_id: formData.timeSlotId,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone || null,
          status: "confirmed",
          total_amount: hourlyRate,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          alert("This slot is already booked. Please choose another time.");
        } else {
          throw error;
        }
        return;
      }

      // Update local state
      setBookings([newBooking, ...bookings]);
      setIsModalOpen(false);

      // Reset form
      setFormData({
        courtId: courts.length > 0 ? courts[0].id : "",
        date: new Date().toISOString().split("T")[0],
        timeSlotId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      });

      alert("Booking created successfully!");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Booking Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage court bookings and schedules
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>

        {/* Calendar View */}
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4 text-center text-gray-400 font-medium">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-32 bg-slate-900/30 rounded-lg border border-slate-800/50"
              ></div>
            ))}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayBookings = bookings.filter(
                (b) => b.booking_date === dateStr
              );

              return (
                <div
                  key={day}
                  className="h-32 bg-slate-800/50 rounded-lg border border-slate-700/50 p-2 hover:border-emerald-500/50 transition-colors overflow-y-auto custom-scrollbar"
                >
                  <div className="text-right text-sm text-gray-400 mb-2">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => handleBookingClick(booking)}
                        className="text-xs p-1.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/20 truncate w-full text-left hover:bg-emerald-500/30 transition-colors cursor-pointer"
                        title="Click to view details"
                      >
                        {booking.customer_name}
                        {booking.status === "pending" && (
                          <span className="ml-1 text-yellow-400">
                            (Pending)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manual Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl w-full max-w-md p-6 relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">New Manual Booking</h2>

            <form onSubmit={handleManualBooking} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Court
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {courts.map((court) => (
                    <button
                      key={court.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, courtId: court.id })
                      }
                      className={`p-3 rounded-lg border transition-colors ${
                        formData.courtId === court.id
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-slate-800 border-slate-700 text-gray-400"
                      }`}
                    >
                      {court.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Time Slot
                </label>
                <select
                  required
                  value={formData.timeSlotId}
                  onChange={(e) =>
                    setFormData({ ...formData, timeSlotId: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select a time...</option>
                  {timeSlots.map((slot) => {
                    const startTime = slot.start_time.substring(0, 5);
                    const endTime = slot.end_time.substring(0, 5);
                    return (
                      <option key={slot.id} value={slot.id}>
                        {startTime} - {endTime}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Customer Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Customer Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors mt-6"
              >
                Create Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl w-full max-w-lg p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsDetailsModalOpen(false);
                setSelectedBooking(null);
                setBookingDetails({ court: null, timeSlot: null });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Status
                  </label>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : selectedBooking.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : selectedBooking.status === "cancelled"
                        ? "bg-red-500/20 text-red-400"
                        : selectedBooking.status === "completed"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Total Amount
                  </label>
                  <p className="text-white font-semibold">
                    ${selectedBooking.total_amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Court
                </label>
                <p className="text-white font-semibold">
                  {bookingDetails.court?.name || "Loading..."}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <p className="text-white font-semibold">
                  {new Date(selectedBooking.booking_date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Time Slot
                </label>
                <p className="text-white font-semibold">
                  {bookingDetails.timeSlot
                    ? `${bookingDetails.timeSlot.start_time.substring(
                        0,
                        5
                      )} - ${bookingDetails.timeSlot.end_time.substring(0, 5)}`
                    : "Loading..."}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Customer Name
                </label>
                <p className="text-white font-semibold">
                  {selectedBooking.customer_name}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Customer Email
                </label>
                <p className="text-white font-semibold">
                  {selectedBooking.customer_email}
                </p>
              </div>

              {selectedBooking.customer_phone && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Customer Phone
                  </label>
                  <p className="text-white font-semibold">
                    {selectedBooking.customer_phone}
                  </p>
                </div>
              )}

              {selectedBooking.notes && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Notes
                  </label>
                  <p className="text-white">{selectedBooking.notes}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Created At
                </label>
                <p className="text-white text-sm">
                  {new Date(selectedBooking.created_at).toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
