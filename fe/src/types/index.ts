export interface Room {
  id: string;
  homestayId: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'dormitory';
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  description: string;
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
}

export interface Homestay {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  ownerId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  rooms?: Room[];
}

export interface Booking {
  id: string;
  homestayId: string;
  roomId?: string;
  guestId: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'guest' | 'host' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  homestayId: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}