import { useState, useEffect } from 'react';
import { getAvailability, saveAvailability } from '../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilitySettings() {
    const [availability, setAvailability] = useState([]);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const { data } = await getAvailability();
            if (data.length === 0) {
                setAvailability([1, 2, 3, 4, 5].map(day => ({
                    dayOfWeek: day,
                    startTime: '09:00',
                    endTime: '17:00',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })));
            } else {
                setAvailability(data);
            }
        } catch (error) {
            console.error('Error fetching availability', error);
        }
    };

    const handleToggleDay = (dayIndex) => {
        if (availability.some(a => a.dayOfWeek === dayIndex)) {
            setAvailability(availability.filter(a => a.dayOfWeek !== dayIndex));
        } else {
            setAvailability([...availability, {
                dayOfWeek: dayIndex,
                startTime: '09:00',
                endTime: '17:00',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
        }
    };

    const handleTimeChange = (dayIndex, field, value) => {
        setAvailability(availability.map(a =>
            a.dayOfWeek === dayIndex ? { ...a, [field]: value } : a
        ));
    };

    const handleSave = async () => {
        try {
            await saveAvailability({ availabilities: availability });
            alert('Availability saved successfully!');
        } catch (error) {
            alert('Error saving availability');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Your Availability</h1>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                >
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {DAYS.map((day, index) => {
                    const dayAvailability = availability.find(a => a.dayOfWeek === index);
                    const isEnabled = !!dayAvailability;

                    return (
                        <div key={day} className="flex items-center p-6 border-b border-gray-100 last:border-0">
                            <div className="w-40 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={() => handleToggleDay(index)}
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mr-3"
                                />
                                <span className={`font-medium ${isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {day}
                                </span>
                            </div>

                            {isEnabled ? (
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="time"
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-black focus:border-black"
                                        value={dayAvailability.startTime}
                                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="time"
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-black focus:border-black"
                                        value={dayAvailability.endTime}
                                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                    />
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400">Unavailable</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
