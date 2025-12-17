// Database types for the booking system

export interface Court {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    status: 'active' | 'maintenance' | 'inactive';
    tags?: string[];
    hourly_rate?: number;
    created_at: string;
    updated_at: string;
}

export interface TimeSlot {
    id: string;
    start_time: string; // Format: "HH:MM:SS"
    end_time: string;   // Format: "HH:MM:SS"
    duration_minutes: number;
    price_override?: number | null;
    created_at: string;
}

export interface Booking {
    id: string;
    court_id: string;
    time_slot_id: string;
    booking_date: string; // Format: "YYYY-MM-DD"
    user_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'maintenance';
    total_amount: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// Extended types with joined data
export interface BookingWithDetails extends Booking {
    court: Court;
    time_slot: TimeSlot;
}

// UI state types
export interface DateAvailability {
    date: string;
    status: 'available' | 'fully-booked';
    availableSlots: number;
}

export interface TimeSlotAvailability extends TimeSlot {
    isAvailable: boolean;
    isBooked: boolean;
}

export interface BookingFormData {
    courtId: string;
    date: string;
    timeSlotId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
}
