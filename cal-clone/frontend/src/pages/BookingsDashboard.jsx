import { useEffect, useState } from 'react';
import { getBookings, deleteBooking, getAvailableSlots, rescheduleBooking } from '../services/api';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar, Clock, User, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BookingsDashboard() {
    const [bookings, setBookings] = useState([]);
    const [rescheduleData, setRescheduleData] = useState(null); // { booking, date, slots, loading, selectedSlot }

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await getBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const handleCancel = async (id) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            await deleteBooking(id);
            fetchBookings();
        }
    };

    const openRescheduleModal = (booking) => {
        setRescheduleData({
            booking,
            date: startOfToday(),
            slots: [],
            loading: false,
            selectedSlot: null
        });
    };

    useEffect(() => {
        if (rescheduleData && rescheduleData.date) {
            const fetchSlots = async () => {
                setRescheduleData(prev => ({ ...prev, loading: true }));
                try {
                    const dateStr = format(rescheduleData.date, 'yyyy-MM-dd');
                    const { data } = await getAvailableSlots(dateStr, rescheduleData.booking.eventTypeId);
                    setRescheduleData(prev => ({ ...prev, slots: data, loading: false }));
                } catch (e) {
                    setRescheduleData(prev => ({ ...prev, loading: false }));
                }
            };
            fetchSlots();
        }
    }, [rescheduleData?.date, rescheduleData?.booking?.eventTypeId]);

    const handleRescheduleSubmit = async () => {
        if (!rescheduleData.selectedSlot) return;
        try {
            await rescheduleBooking(rescheduleData.booking.id, {
                newStartTime: rescheduleData.selectedSlot.start,
                newEndTime: rescheduleData.selectedSlot.end
            });
            fetchBookings();
            setRescheduleData(null);
            alert("Rescheduled successfully!");
        } catch (error) {
            alert(error.response?.data?.error || "Failed to reschedule");
        }
    };

    const nextWeekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Bookings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 w-full">
                                <div className="md:w-1/4">
                                    <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        {format(new Date(booking.startTime), 'MMM d, yyyy')}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                        {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                                    </div>
                                </div>

                                <div className="md:w-1/4">
                                    <div className="text-sm font-medium text-gray-900 mb-1">{booking.eventType.title}</div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="md:w-1/3">
                                    <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        {booking.name}
                                    </div>
                                    <div className="text-sm text-gray-500 ml-6">{booking.email}</div>

                                    {booking.answers && booking.answers.length > 0 && (
                                        <div className="ml-6 mt-2">
                                            <p className="text-xs font-bold text-gray-700">Answers:</p>
                                            {booking.answers.map(ans => (
                                                <div key={ans.id} className="text-xs text-gray-600 mt-1">
                                                    <span className="font-medium">{ans.question?.question}:</span> {ans.answer}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end md:w-1/6 space-x-4">
                                    {booking.status === 'CONFIRMED' && (
                                        <>
                                            <button
                                                onClick={() => openRescheduleModal(booking)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                Reschedule
                                            </button>
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Cancel Booking"
                                            >
                                                <XCircle className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No bookings found.
                        </div>
                    )}
                </div>
            </div>

            {rescheduleData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Reschedule {rescheduleData.booking.eventType.title}</h2>
                            <button onClick={() => setRescheduleData(null)} className="text-gray-500 hover:text-red-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {!rescheduleData.selectedSlot ? (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-4">Select new date</h3>
                                <div className="grid grid-cols-7 gap-2 mb-6">
                                    {nextWeekDates.map((date) => (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => setRescheduleData(prev => ({ ...prev, date, selectedSlot: null }))}
                                            className={`p-2 text-center rounded-lg border transition-colors ${format(rescheduleData.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 hover:border-black text-gray-900'
                                                }`}
                                        >
                                            <div className="text-[10px] uppercase tracking-wider mb-1 opacity-80">{format(date, 'E')}</div>
                                            <div className="text-sm font-bold">{format(date, 'd')}</div>
                                        </button>
                                    ))}
                                </div>

                                <h3 className="text-sm font-medium text-gray-700 mb-4">Available slots</h3>
                                {rescheduleData.loading ? (
                                    <div className="text-center text-sm text-gray-500">Loading slots...</div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {rescheduleData.slots.map((slot) => (
                                            <button
                                                key={slot.start}
                                                onClick={() => setRescheduleData(prev => ({ ...prev, selectedSlot: slot }))}
                                                className="p-2 text-center text-sm font-bold text-black border border-gray-200 rounded-lg hover:border-black hover:shadow-sm transition-all"
                                            >
                                                {format(new Date(slot.start), 'h:mm a')}
                                            </button>
                                        ))}
                                        {rescheduleData.slots.length === 0 && (
                                            <div className="col-span-3 text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                                                No slots available on this date.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={() => setRescheduleData(prev => ({ ...prev, selectedSlot: null }))}
                                    className="flex items-center text-sm font-bold text-gray-600 hover:text-black mb-6"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to slots
                                </button>

                                <div className="p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 mb-6 flex items-center justify-between">
                                    <div>
                                        <span className="block text-xs font-bold uppercase mb-1">Old Time</span>
                                        <span className="text-sm line-through opacity-70">
                                            {format(new Date(rescheduleData.booking.startTime), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 opacity-50" />
                                    <div className="text-right">
                                        <span className="block text-xs font-bold uppercase mb-1">New Time</span>
                                        <span className="text-sm font-bold text-blue-700">
                                            {format(new Date(rescheduleData.selectedSlot.start), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRescheduleSubmit}
                                    className="w-full py-3 px-4 bg-black text-white font-bold text-sm rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    Confirm Reschedule
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
