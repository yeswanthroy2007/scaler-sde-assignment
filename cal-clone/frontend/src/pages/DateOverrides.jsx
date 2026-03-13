import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { getDateOverrides, createDateOverride, deleteDateOverride } from '../services/api';

export default function DateOverrides() {
    const [overrides, setOverrides] = useState([]);
    const [formData, setFormData] = useState({
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        isBlocked: false
    });

    useEffect(() => {
        fetchOverrides();
    }, []);

    const fetchOverrides = async () => {
        try {
            const { data } = await getDateOverrides();
            setOverrides(data);
        } catch (error) {
            console.error('Failed to fetch overrides', error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createDateOverride(formData);
            fetchOverrides();
            setFormData({ ...formData, date: '' });
        } catch (error) {
            alert('Error adding date override');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to remove this override?')) {
            await deleteDateOverride(id);
            fetchOverrides();
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Date Overrides</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {overrides.map((override) => (
                            <div key={override.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-lg">
                                        {format(new Date(override.date), 'EEEE, MMMM d, yyyy')}
                                    </span>
                                    {override.isBlocked ? (
                                        <span className="text-red-600 font-medium text-sm mt-1">Blocked (Unavailable)</span>
                                    ) : (
                                        <span className="text-gray-600 text-sm mt-1">
                                            {override.startTime} - {override.endTime}
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => handleDelete(override.id)} className="text-gray-400 hover:text-red-600 p-2">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                        {overrides.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No date overrides configured.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full md:w-80">
                <h2 className="text-xl font-bold text-gray-900 mb-4 mt-[3.5rem] md:mt-0">Add Override</h2>
                <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                        <input
                            type="date"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mr-3"
                            checked={formData.isBlocked}
                            onChange={(e) => setFormData({ ...formData, isBlocked: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-gray-700">Completely unavaliable</span>
                    </div>

                    {!formData.isBlocked && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                    >
                        Save Override
                    </button>
                </form>
            </div>
        </div>
    );
}
