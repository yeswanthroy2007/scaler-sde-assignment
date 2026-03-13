import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Copy, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { getEvents, deleteEvent } from '../services/api';

export default function Dashboard() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this event type?')) {
            await deleteEvent(id);
            fetchEvents();
        }
    };

    const copyLink = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`);
        alert('Link copied to clipboard!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
                <Link
                    to="/event-types/new"
                    className="flex items-center px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Event Type
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <Link to={`/event-types/${event.id}`} className="hover:text-blue-600">
                                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{event.title}</h3>
                                </Link>
                                <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{event.description}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-4">
                                <Clock className="h-4 w-4 mr-1" />
                                {event.duration} mins
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <Link to={`/book/${event.slug}`} target="_blank" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                View
                            </Link>
                            <button onClick={() => copyLink(event.slug)} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
                                <Copy className="h-4 w-4 mr-1" />
                                Copy link
                            </button>
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                        No event types yet. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
