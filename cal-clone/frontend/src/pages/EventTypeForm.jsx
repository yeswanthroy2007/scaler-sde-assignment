import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEvents, getQuestions, createQuestion } from '../services/api';

export default function EventTypeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 30,
        slug: '',
        bufferBefore: 0,
        bufferAfter: 0
    });

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newQuestionRequired, setNewQuestionRequired] = useState(false);

    useEffect(() => {
        if (id) {
            getEvents().then(({ data }) => {
                const event = data.find(e => e.id === parseInt(id));
                if (event) {
                    setFormData({
                        title: event.title,
                        description: event.description || '',
                        duration: event.duration,
                        slug: event.slug,
                        bufferBefore: event.bufferBefore || 0,
                        bufferAfter: event.bufferAfter || 0
                    });
                }
            });
            getQuestions(id).then(({ data }) => setQuestions(data));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateEvent(id, formData);
            } else {
                await createEvent(formData);
            }
            navigate('/');
        } catch (error) {
            alert('Error saving event type');
        }
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !id ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prev.slug
        }));
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.trim() || !id) return;
        try {
            const { data } = await createQuestion(id, { question: newQuestion, required: newQuestionRequired });
            setQuestions([...questions, data]);
            setNewQuestion('');
            setNewQuestionRequired(false);
        } catch (error) {
            alert('Error adding question');
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">{id ? 'Edit' : 'New'} Event Type</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                            value={formData.title}
                            onChange={handleTitleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                calclone.com/
                            </span>
                            <input
                                type="text"
                                required
                                className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-none rounded-r-md focus:ring-black focus:border-black sm:text-sm"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (mins)</label>
                            <input
                                type="number"
                                required
                                min="15"
                                step="15"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Buffer Before</label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                value={formData.bufferBefore}
                                onChange={(e) => setFormData({ ...formData, bufferBefore: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Buffer After</label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                value={formData.bufferAfter}
                                onChange={(e) => setFormData({ ...formData, bufferAfter: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {id && (
                <div className="w-full md:w-80 mt-8 md:mt-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 mt-[3.5rem]">Custom Questions</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        {questions.map(q => (
                            <div key={q.id} className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                                <p className="font-medium text-sm text-gray-900">{q.question}</p>
                                {q.required && <span className="text-xs text-red-500 font-bold mt-1 inline-block">Required</span>}
                            </div>
                        ))}

                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Question</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3 focus:ring-black focus:border-black"
                                placeholder="e.g. Company name"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                            />
                            <label className="flex items-center text-sm text-gray-600 mb-4">
                                <input
                                    type="checkbox"
                                    className="mr-2 rounded text-black focus:ring-black"
                                    checked={newQuestionRequired}
                                    onChange={(e) => setNewQuestionRequired(e.target.checked)}
                                />
                                Required
                            </label>
                            <button
                                onClick={handleAddQuestion}
                                type="button"
                                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                            >
                                Add Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
