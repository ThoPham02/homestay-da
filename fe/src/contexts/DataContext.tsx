import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Homestay, Booking, Review, Room } from '../types';
import { homestays as initialHomestays } from '../data/homestays';

interface DataContextType {
  homestays: Homestay[];
  bookings: Booking[];
  reviews: Review[];
  rooms: Room[];
  addHomestay: (homestay: Homestay) => void;
  updateHomestay: (id: string, homestay: Partial<Homestay>) => void;
  deleteHomestay: (id: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  addReview: (review: Review) => void;
  getHomestayById: (id: string) => Homestay | undefined;
  getRoomsByHomestayId: (homestayId: string) => Room[];
  getAvailableRooms: (homestayId: string, checkIn: string, checkOut: string) => Room[];
  getRoomById: (id: string) => Room | undefined;
  getBookingsByHomestayId: (homestayId: string) => Booking[];
  getBookingsByUserId: (userId: string) => Booking[];
  getReviewsByHomestayId: (homestayId: string) => Review[];
  getReviewByBookingId: (bookingId: string) => Review | undefined;
  updateHomestayRating: (homestayId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [homestays, setHomestays] = useState<Homestay[]>(initialHomestays);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const addHomestay = (homestay: Homestay) => {
    setHomestays(prev => [...prev, homestay]);
  };

  const updateHomestay = (id: string, updatedHomestay: Partial<Homestay>) => {
    setHomestays(prev => 
      prev.map(homestay => 
        homestay.id === id ? { ...homestay, ...updatedHomestay } : homestay
      )
    );
  };

  const deleteHomestay = (id: string) => {
    setHomestays(prev => prev.filter(homestay => homestay.id !== id));
    setRooms(prev => prev.filter(room => room.homestayId !== id));
  };

  const addRoom = (room: Room) => {
    setRooms(prev => [...prev, room]);
  };

  const updateRoom = (id: string, updatedRoom: Partial<Room>) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === id ? { ...room, ...updatedRoom } : room
      )
    );
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updatedBooking: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, ...updatedBooking } : booking
      )
    );
  };

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
    updateHomestayRating(review.homestayId);
  };

  const updateHomestayRating = (homestayId: string) => {
    const homestayReviews = reviews.filter(r => r.homestayId === homestayId);
    if (homestayReviews.length === 0) return;

    const averageRating = homestayReviews.reduce((sum, review) => sum + review.rating, 0) / homestayReviews.length;
    const reviewCount = homestayReviews.length;

    setHomestays(prev => 
      prev.map(homestay => 
        homestay.id === homestayId 
          ? { ...homestay, rating: Math.round(averageRating * 10) / 10, reviews: reviewCount }
          : homestay
      )
    );
  };

  const getHomestayById = (id: string) => {
    return homestays.find(homestay => homestay.id === id);
  };

  const getRoomsByHomestayId = (homestayId: string) => {
    return rooms.filter(room => room.homestayId === homestayId);
  };

  const getAvailableRooms = (homestayId: string, checkIn: string, checkOut: string) => {
    const homestayRooms = getRoomsByHomestayId(homestayId);
    const conflictingBookings = bookings.filter(booking => 
      booking.homestayId === homestayId &&
      booking.status !== 'cancelled' &&
      ((new Date(booking.checkIn) <= new Date(checkOut)) && 
       (new Date(booking.checkOut) >= new Date(checkIn)))
    );

    const bookedRoomIds = conflictingBookings
      .filter(booking => booking.roomId)
      .map(booking => booking.roomId);

    return homestayRooms.filter(room => 
      room.status === 'available' && !bookedRoomIds.includes(room.id)
    );
  };

  const getRoomById = (id: string) => {
    return rooms.find(room => room.id === id);
  };

  const getBookingsByHomestayId = (homestayId: string) => {
    return bookings.filter(booking => booking.homestayId === homestayId);
  };

  const getBookingsByUserId = (userId: string) => {
    return bookings.filter(booking => booking.guestId === userId);
  };

  const getReviewsByHomestayId = (homestayId: string) => {
    return reviews.filter(review => review.homestayId === homestayId);
  };

  const getReviewByBookingId = (bookingId: string) => {
    return reviews.find(review => review.bookingId === bookingId);
  };

  return (
    <DataContext.Provider value={{
      homestays,
      bookings,
      reviews,
      rooms,
      addHomestay,
      updateHomestay,
      deleteHomestay,
      addRoom,
      updateRoom,
      deleteRoom,
      addBooking,
      updateBooking,
      addReview,
      getHomestayById,
      getRoomsByHomestayId,
      getAvailableRooms,
      getRoomById,
      getBookingsByHomestayId,
      getBookingsByUserId,
      getReviewsByHomestayId,
      getReviewByBookingId,
      updateHomestayRating
    }}>
      {children}
    </DataContext.Provider>
  );
};