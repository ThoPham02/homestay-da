export interface Room {
  id: number;
  homestayId: number;
  name: string;
  description: string;
  type: 'single' | 'double' | 'family' | 'dormitory';
  capacity: number;
  price: number;
  priceType: 'per_night' | 'per_person';
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface RoomAvailability {
  id: number;
  roomId: number;
  date: string;
  status: 'available' | 'booked' | 'blocked';
  price?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Homestay {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
  hostId: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  rooms?: Room[];
}

export interface HomestayStats {
  totalHomestays: number;
  activeHomestays: number;
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  averagePrice: number;
  totalRevenue: number;
  occupancyRate: number;
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
  id: number;
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

// API Request/Response Types
export interface CreateHomestayRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
}

export interface UpdateHomestayRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  status?: 'active' | 'inactive';
}

export interface CreateRoomRequest {
  homestayId: number;
  name: string;
  description: string;
  type: 'single' | 'double' | 'family' | 'dormitory';
  capacity: number;
  price: number;
  priceType: 'per_night' | 'per_person';
}

export interface UpdateRoomRequest {
  name?: string;
  description?: string;
  type?: 'single' | 'double' | 'family' | 'dormitory';
  capacity?: number;
  price?: number;
  priceType?: 'per_night' | 'per_person';
  status?: 'available' | 'occupied' | 'maintenance';
}

export interface CreateAvailabilityRequest {
  roomId: number;
  date: string;
  status: 'available' | 'booked' | 'blocked';
  price?: number;
}

export interface UpdateAvailabilityRequest {
  status?: 'available' | 'booked' | 'blocked';
  price?: number;
}

export interface BulkAvailabilityRequest {
  roomId: number;
  startDate: string;
  endDate: string;
  status: 'available' | 'booked' | 'blocked';
  price?: number;
  excludeDates?: string[];
}

export interface HomestayListRequest {
  page?: number;
  pageSize?: number;
  status?: string;
  city?: string;
  district?: string;
}

export interface RoomListRequest {
  homestayId: number;
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface HomestayListResponse {
  homestays: Homestay[];
  total: number;
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface RoomListResponse {
  rooms: Room[];
  total: number;
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface HomestayDetailResponse {
  homestay: Homestay;
  rooms: Room[];
}

export interface RoomDetailResponse {
  room: Room;
  homestay: Homestay;
  availabilities: RoomAvailability[];
}