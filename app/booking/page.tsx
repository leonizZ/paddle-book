import React from "react";
import supabase from "@/lib/supabase";

export default async function BookingPage() {
  const { data: courtsData, error: courtsError } = await supabase
    .from("courts")
    .select("*")
    .eq("status", "active")
    .order("name");

  console.log("server", courtsData, courtsError);
  return (
    <div>
      <h1>Booking Page</h1>
      <p>{JSON.stringify(courtsData)}</p>
    </div>
  );
}
