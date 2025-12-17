import React from "react";
import supabase from "@/lib/supabase";
import BookingClient from "./booking-client";

export const revalidate = 0; // Ensure fresh data on every request

export default async function BookingPage() {
  const [courtsResult, timeSlotsResult] = await Promise.all([
    supabase
      .from("courts")
      .select("*")
      .eq("status", "active")
      .order("name"),
    supabase
      .from("time_slots")
      .select("*")
      .order("start_time")
  ]);

  const courts = courtsResult.data || [];
  const timeSlots = timeSlotsResult.data || [];


  if (courtsResult.error) {
    console.error("Error fetching courts:", courtsResult.error);
  }
  if (timeSlotsResult.error) {
    console.error("Error fetching time slots:", timeSlotsResult.error);
  }

  return <BookingClient courts={courts} timeSlots={timeSlots} />;
}
