# Pickleball Court Booking System

## 📋 Overview

A complete pickleball court booking system with a beautiful landing page and comprehensive booking interface.

## ✨ Features Implemented

### 1. **Landing Page** (`/app/page.tsx`)
- Hero section with gradient overlays and animations
- Court showcase with Court 1 and Court 2
- Contact section with Google Maps integration
- Fully responsive design
- Modern dark theme with emerald/teal accents

### 2. **Booking Page** (`/app/booking/page.tsx`)
- **Court Selection**: Visual cards showing available courts
- **Date Selection**: 14-day calendar with availability status
  - Shows "Available" or "Fully Booked" status
  - Disabled dates for fully booked days
- **Time Slot Selection**: Hourly slots from 6 AM to 10 PM
  - Shows "Available" or "Not Available" status
  - Disabled slots for already booked times
- **Booking Summary**: Real-time summary of selections
- **Responsive Design**: Works on mobile, tablet, and desktop

### 3. **Database Schema** (`/database-schema.sql`)

#### Tables:
- **`courts`**: Stores court information
  - id, name, description, image_url, status
- **`time_slots`**: Defines available time slots
  - id, start_time, end_time, duration_minutes
- **`bookings`**: Stores all bookings
  - id, court_id, time_slot_id, booking_date, customer info, status

#### Features:
- Row Level Security (RLS) policies
- Unique constraint to prevent double booking
- Indexes for optimal query performance
- Sample data included

### 4. **TypeScript Types** (`/lib/types/booking.ts`)
- Court, TimeSlot, Booking interfaces
- UI state types for availability tracking
- Form data types

## 🎨 Design Features

- **Color Scheme**: Dark theme with emerald-to-teal gradients
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism**: Backdrop blur effects
- **Custom Scrollbars**: Themed scrollbars for better UX
- **Visual Feedback**: Clear indicators for selected items
- **Status Indicators**: Color-coded availability (green = available, red = unavailable)

## 📁 File Structure

```
paddle-ground/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── booking/
│   │   └── page.tsx            # Booking page
│   └── globals.css             # Global styles with animations
├── lib/
│   └── types/
│       └── booking.ts          # TypeScript types
├── public/
│   └── images/
│       ├── hero-court.png      # Hero image
│       ├── court-1.png         # Court 1 thumbnail
│       └── court-2.png         # Court 2 thumbnail
├── database-schema.sql         # Database setup
├── preview-landing.html        # Landing page preview
└── preview-booking.html        # Booking page preview
```

## 🚀 Getting Started

### 1. Database Setup

Run the SQL schema in your Supabase project:

```bash
# In Supabase SQL Editor, run:
database-schema.sql
```

This will create:
- All necessary tables
- Sample courts (Court 1 and Court 2)
- Time slots (6 AM - 10 PM, hourly)
- RLS policies for security

### 2. Environment Variables

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit:
- Landing page: `http://localhost:3000`
- Booking page: `http://localhost:3000/booking`

### 4. Preview Files (No Server Required)

For quick preview without running the server:
- `preview-landing.html` - Landing page preview
- `preview-booking.html` - Booking page preview

## 🔧 How It Works

### Booking Flow

1. **Select Court**: User chooses between Court 1 or Court 2
2. **Select Date**: User picks from next 14 days
   - System checks availability for selected court
   - Fully booked dates are disabled
3. **Select Time Slot**: User chooses from available hourly slots
   - System shows which slots are already booked
   - Booked slots are disabled
4. **Confirm Booking**: Summary shows all selections
   - User confirms to create booking

### Data Flow (Mock Implementation)

Currently using mock data in the booking page:
- `mockCourts`: Array of court objects
- `mockTimeSlots`: Array of time slot objects
- `getBookedSlots()`: Function simulating booked slots

### Next Steps for Production

To connect to real Supabase database:

1. **Create API Routes** (`/app/api/`):
   ```typescript
   // GET /api/courts - Fetch all courts
   // GET /api/time-slots - Fetch all time slots
   // GET /api/bookings?court_id=X&date=Y - Check availability
   // POST /api/bookings - Create new booking
   ```

2. **Update Booking Page**:
   - Replace mock data with API calls
   - Add loading states
   - Add error handling
   - Add form validation

3. **Add User Authentication**:
   - Link bookings to authenticated users
   - Add user dashboard to view bookings
   - Add booking cancellation

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Features

### Availability System
- ✅ Real-time availability checking
- ✅ Visual status indicators
- ✅ Disabled states for unavailable options
- ✅ Fully booked date detection

### User Experience
- ✅ Step-by-step booking process
- ✅ Clear visual feedback
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Accessible UI elements

### Database Design
- ✅ Normalized schema
- ✅ Unique constraints prevent double booking
- ✅ Indexes for performance
- ✅ RLS for security
- ✅ Scalable structure

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Policies restrict data access appropriately
- Unique constraints prevent conflicts
- Input validation needed on forms (TODO)

## 🐛 Known Issues

1. **Authentication**: The `/booking` route may redirect to login depending on your Next.js configuration
   - **Solution**: Use `preview-booking.html` to see the design
   - **Or**: Configure route as public in your auth setup

2. **Mock Data**: Currently using hardcoded data
   - **Solution**: Implement API routes to connect to Supabase

## 📝 TODO for Production

- [ ] Connect to Supabase API
- [ ] Add form validation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add booking confirmation email
- [ ] Add user dashboard
- [ ] Add booking cancellation
- [ ] Add payment integration
- [ ] Add booking history
- [ ] Add admin panel

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the color scheme:
```css
/* Current: Emerald/Teal */
--emerald-400: #34d399
--teal-500: #14b8a6

/* Change to your brand colors */
```

### Time Slots
Edit `database-schema.sql` to modify available times:
```sql
INSERT INTO time_slots (start_time, end_time, duration_minutes) VALUES
('YOUR_START', 'YOUR_END', DURATION);
```

### Court Information
Update court details in the database or mock data.

## 📞 Support

For issues or questions:
1. Check the database schema is properly set up
2. Verify environment variables are correct
3. Check browser console for errors
4. Review the preview HTML files for expected behavior

---

**Built with**: Next.js, TypeScript, Tailwind CSS, Supabase
**Design**: Modern, responsive, user-friendly
**Status**: Ready for production with API integration
