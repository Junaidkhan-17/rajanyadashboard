import api from "./api";

/*
========================================
Get All Bookings
========================================
*/

export const getBookings = async () => {
  const response = await api.get("/bookings");

  return response.data;
};

/*
========================================
Get Booking By ID
========================================
*/

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);

  return response.data;
};

/*
========================================
Update Booking
========================================
*/

export const updateBooking = async (id, bookingData) => {
  const response = await api.put(
    `/bookings/${id}`,
    bookingData
  );

  return response.data;
};

/*
========================================
Delete Booking
========================================
*/

export const deleteBooking = async (id) => {
  const response = await api.delete(
    `/bookings/${id}`
  );

  return response.data;
};