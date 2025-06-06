import React, { useEffect, useState } from 'react';
import { EnvelopeIcon, ClockIcon, UserIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import api from '../../../services/api';

const ContactMessagesSection = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/admin/contact-messages');
            setMessages(response.data.messages || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError(err.response?.data?.error || 'Failed to load messages');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/admin/contact-messages/${id}`);
                setMessages(messages.filter(message => message.id !== id));
            } catch (err) {
                console.error('Failed to delete message:', err);
                alert('Failed to delete message');
            }
        }
    };

    const handleCopy = (message) => {
        const textToCopy = `From: ${message.name} (${message.email})\nSubject: ${message.subject}\nMessage: ${message.message}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Message copied to clipboard!'))
            .catch(err => console.error('Failed to copy:', err));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 rounded-xl text-red-700 dark:text-red-400 mb-6">
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold dark:text-white mb-4">Contact Messages</h3>

            {messages.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span className="font-medium dark:text-white">{message.name}</span>
                                    <a
                                        href={`mailto:${message.email}`}
                                        className="text-sm text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <EnvelopeIcon className="h-4 w-4" />
                                        {message.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <ClockIcon className="h-3 w-3" />
                                    {new Date(message.created_at).toLocaleString()}
                                </div>
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{message.subject}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{message.message}</p>
                            {message.user_id && (
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    User ID: {message.user_id}
                                </div>
                            )}
                            <div className="mt-4 flex justify-end space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCopy(message)}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
                                    title="Copy message"
                                >
                                    <DocumentDuplicateIcon className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(message.id)}
                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-red-600 dark:text-red-400"
                                    title="Delete message"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactMessagesSection;