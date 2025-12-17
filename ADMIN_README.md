# Admin Booking Management

## 📋 Overview

A simple admin interface to manage bookings, view the schedule, and create manual bookings.

## 📍 Access

**URL**: `/admin/bookings`

**Authentication**: This route is protected. You must be logged in to access it. If you try to access it without logging in, you will be redirected to the login page.

## ✨ Features

### 1. Calendar View
- **Monthly Grid**: Visual representation of the current month.
- **Navigation**: Previous/Next month buttons.
- **Daily Bookings**: Shows bookings for each day.
- **Scrollable Days**: Each day cell is scrollable if there are many bookings.

### 2. Manual Booking
- **"New Booking" Button**: Opens a modal to create a booking manually.
- **Form Fields**:
  - **Court**: Select Court 1 or Court 2.
  - **Date**: Date picker.
  - **Time Slot**: Dropdown with available time slots.
  - **Customer Name**: Input for the customer's name.
- **Validation**: Basic required field validation.

## 🛠️ Implementation Details

### File Structure
- `app/admin/bookings/page.tsx`: Main admin page component.

### State Management
- `currentDate`: Tracks the currently displayed month.
- `bookings`: Array of booking objects (currently mock data, ready for API integration).
- `isModalOpen`: Controls visibility of the manual booking modal.
- `formData`: Stores input values for the new booking form.

### Mock Data
The system currently uses mock data for demonstration. To connect to the real database:
1. Replace `mockTimeSlots` with an API call to fetch time slots.
2. Replace `bookings` state initialization with an API call to fetch bookings from Supabase.
3. Update `handleManualBooking` to send a POST request to your API (or use Supabase client directly) to insert the new booking into the `bookings` table.

## 🚀 Next Steps for Production

1. **Connect to Supabase**:
   - Fetch real bookings in `useEffect`.
   - Implement `createBooking` function using Supabase client.
2. **Enhanced Calendar**:
   - Add week/day views.
   - Add drag-and-drop functionality (optional).
3. **Booking Details**:
   - Click on a booking to view full details (email, phone, etc.).
   - Edit/Cancel booking functionality.
4. **Auth Role Check**:
   - Ensure only users with an "admin" role can access this page (currently any authenticated user can access if they know the URL, though RLS policies might restrict data access).

## 🎨 Customization

- **Colors**: Uses the same Emerald/Teal theme as the main site.
- **Styles**: Built with Tailwind CSS.
