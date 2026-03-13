import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format, addDays, startOfToday } from 'date-fns';
import { Clock, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { getEventBySlug, getAvailableSlots, createBooking } from '../services/api';

export default function PublicBookingPage() {
    const { slug } = useParams();
    const [eventType, setEventType] = useState(null);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [answers, setAnswers] = useState({});
    const [isBooked, setIsBooked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEventBySlug(slug)
            .then(({ data }) => {
                setEventType(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        if (eventType) {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            getAvailableSlots(dateStr, eventType.id)
                .then(({ data }) => {
                    const now = new Date();
                    // Filter out past slots for the current day
                    const filtered = data.filter(slot => {
                        const slotDate = new Date(slot.start);
                        return slotDate > now;
                    });
                    setSlots(filtered);
                })
                .catch(console.error);
        }
    }, [selectedDate, eventType]);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId: parseInt(questionId),
                answer
            }));

            await createBooking({
                eventTypeId: eventType.id,
                name: formData.name,
                email: formData.email,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end,
                answers: formattedAnswers
            });
            setIsBooked(true);
        } catch (error) {
            alert(error.response?.data?.error || 'Booking failed');
        }
    };

    const nextWeekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!eventType) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

    if (isBooked) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-6">A calendar invitation has been sent to your email address.</p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-100">
                        <div className="font-medium text-gray-900 mb-2">{eventType.title}</div>
                        <div className="text-sm text-gray-600 flex items-center mb-1">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {format(new Date(selectedSlot.start), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {format(new Date(selectedSlot.start), 'h:mm a')} - {format(new Date(selectedSlot.end), 'h:mm a')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row min-h-[600px] overflow-visible">
                {/* Left Side: Event Details */}
                <div className="w-full md:w-1/3 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                            C
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{eventType.title}</h1>
                        <div className="flex items-center text-gray-500 mt-4 text-sm font-medium">
                            <Clock className="w-4 h-4 mr-2" />
                            {eventType.duration} minutes
                        </div>
                        <p className="text-gray-600 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                            {eventType.description}
                        </p>
                    </div>
                </div>

                {/* Right Side: Calendar & Booking */}
                <div className="w-full md:w-2/3 p-8 bg-white">
                    {!selectedSlot ? (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Select a Date & Time</h2>
                            <div className="grid grid-cols-7 gap-2 mb-8">
                                {nextWeekDates.map((date) => (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`p-3 text-center rounded-lg border transition-colors ${format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 hover:border-black text-gray-900'
                                            }`}
                                    >
                                        <div className="text-xs uppercase tracking-wider mb-1 opacity-80">{format(date, 'E')}</div>
                                        <div className="text-lg font-bold">{format(date, 'd')}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.start}
                                        onClick={() => setSelectedSlot(slot)}
                                        className="p-3 text-center text-sm font-bold text-black border border-gray-200 rounded-lg hover:border-black hover:shadow-sm transition-all"
                                    >
                                        {format(new Date(slot.start), 'h:mm a')}
                                    </button>
                                ))}
                                {slots.length === 0 && (
                                    <div className="col-span-3 text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                        No slots available on this date.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="flex items-center text-sm font-bold text-gray-600 hover:text-black mb-6"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </button>

                            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-sm font-medium text-gray-900 mb-1">Selected Time</div>
                                <div className="text-gray-600 flex items-center text-sm">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {format(new Date(selectedSlot.start), 'EEEE, MMMM d, yyyy')} at {format(new Date(selectedSlot.start), 'h:mm a')}
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                {eventType.questions && eventType.questions.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                                        <h3 className="text-sm font-bold text-gray-900">Additional Information</h3>
                                        {eventType.questions.map(q => (
                                            <div key={q.id}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {q.question} {q.required && '*'}
                                                </label>
                                                <input
                                                    type="text"
                                                    required={q.required}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors mt-8"
                                >
                                    Confirm Booking
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
