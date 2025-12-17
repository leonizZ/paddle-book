"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BookingConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing your booking...");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const processBooking = async () => {
      try {
        // Check if this is a success redirect (booking already created)
        if (typeof window !== "undefined") {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.get("success") === "true") {
            setStatus("success");
            setMessage(
              "Your booking has been submitted successfully! It is pending admin approval."
            );
            return;
          }
        }

        // 1. Check Authentication
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Should have been redirected by middleware/auth flow, but double check
          router.push("/auth/login?redirect=/booking/confirm");
          return;
        }

        // 2. Retrieve Pending Booking
        const pendingBookingStr = sessionStorage.getItem("pendingBooking");

        if (!pendingBookingStr) {
          setStatus("error");
          setMessage("No pending booking found. Please start over.");
          return;
        }

        const pendingBooking = JSON.parse(pendingBookingStr);

        // 3. Get court details for pricing
        const { data: courtData } = await supabase
          .from("courts")
          .select("hourly_rate")
          .eq("id", pendingBooking.courtId)
          .single();

        // 4. Create Booking in Supabase with pending status
        const { error } = await supabase.from("bookings").insert({
          court_id: pendingBooking.courtId,
          time_slot_id: pendingBooking.timeSlotId,
          booking_date: pendingBooking.date.split("T")[0], // Ensure YYYY-MM-DD
          user_id: user.id,
          customer_name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Customer",
          customer_email: user.email || "",
          status: "pending",
          total_amount: courtData?.hourly_rate || 20.0,
        });

        if (error) {
          console.error("Booking error:", error);
          if (error.code === "23505") {
            // Unique violation
            setStatus("error");
            setMessage(
              "This slot has already been booked. Please choose another time."
            );
          } else {
            throw error;
          }
          return;
        }

        // 4. Success & Cleanup
        sessionStorage.removeItem("pendingBooking");
        setStatus("success");
        setMessage(
          "Your booking has been submitted successfully! It is pending admin approval."
        );
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    processBooking();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Processing</h2>
            <p className="text-gray-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <div className="flex gap-4 w-full">
              <Link
                href="/booking"
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
              >
                Book Another
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Booking Failed
            </h2>
            <p className="text-red-400 mb-8">{message}</p>
            <Link
              href="/booking"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
