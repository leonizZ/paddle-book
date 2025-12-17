import React from "react";
import supabase from "@/lib/supabase";

export default async function BookingPage() {
  const { data: courtsData, error: courtsError } = await supabase
    .from("courts")
    .select("*")
    .eq("status", "active")
    .order("name");

  console.log("server", courtsData);
  return <div>BookingPage</div>;
}
