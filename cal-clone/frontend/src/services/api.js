import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getEvents = () => api.get('/events');
export const getEventBySlug = (slug) => api.get(`/events/slug/${slug}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

export const getQuestions = (eventId) => api.get(`/events/${eventId}/questions`);
export const createQuestion = (eventId, data) => api.post(`/events/${eventId}/questions`, data);

export const getAvailability = () => api.get('/availability');
export const saveAvailability = (data) => api.post('/availability', data);

export const getDateOverrides = () => api.get('/date-overrides');
export const createDateOverride = (data) => api.post('/date-overrides', data);
export const deleteDateOverride = (id) => api.delete(`/date-overrides/${id}`);

export const getBookings = () => api.get('/bookings');
export const getAvailableSlots = (date, eventTypeId) => api.get(`/bookings/slots?date=${date}&eventTypeId=${eventTypeId}`);
export const createBooking = (data) => api.post('/bookings', data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const rescheduleBooking = (id, data) => api.put(`/bookings/${id}/reschedule`, data);

export default api;
