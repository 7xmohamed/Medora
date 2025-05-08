/* eslint-disable no-unused-vars */
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AvailabilityCalendar({ availabilities, onAddAvailability, onDeleteAvailability }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDateSelect = (selectInfo) => {
        const startDate = new Date(selectInfo.start);
        const endDate = new Date(selectInfo.end);

        const startTime = startDate.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        const endTime = endDate.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'long' });

        const hasOverlap = events.some(event => {
            const sameDay = event.daysOfWeek[0] === ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeek);
            if (!sameDay) return false;

            const overlap = (event.startTime <= startTime && event.endTime > startTime) ||
                (event.startTime < endTime && event.endTime >= endTime) ||
                (startTime <= event.startTime && endTime >= event.endTime);
            return overlap;
        });

        if (hasOverlap) {
            alert('There is already an availability slot during this time.');
            selectInfo.view.calendar.unselect();
            return;
        }

        onAddAvailability({
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime
        });

        selectInfo.view.calendar.unselect();
    };

    const handleEventClick = (info) => {
        setSelectedEvent({
            id: info.event.extendedProps.id,
            day: info.event.extendedProps.dayOfWeek,
            time: info.event.title,
            startTime: info.event.startTime,
            endTime: info.event.endTime,
            date: info.event.start
        });
        setShowDeleteModal(true);
    };

    const handleDelete = async (deleteAll) => {
        try {
            setIsSubmitting(true);
            await onDeleteAvailability(selectedEvent.id, deleteAll);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete availability:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const events = availabilities.map(availability => ({
        title: `${availability.start_time} - ${availability.end_time}`,
        daysOfWeek: [['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(availability.day_of_week)],
        startTime: availability.start_time,
        endTime: availability.end_time,
        backgroundColor: '#059669',
        borderColor: '#047857',
        extendedProps: {
            id: availability.id,
            dayOfWeek: availability.day_of_week
        }
    }));

    return (
        <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Working Hours</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click and drag to set your available time slots. Click on an existing slot to modify or delete it.
                    </p>
                </div>

                <div className="calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        events={events}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'timeGridWeek,timeGridDay'
                        }}
                        slotMinTime="06:00:00"
                        slotMaxTime="22:00:00"
                        height="auto"
                        contentHeight={600}
                        allDaySlot={false}
                        slotDuration="00:30:00"
                        snapDuration="00:15:00"
                        slotLabelInterval="01:00:00"
                        expandRows={true}
                        stickyHeaderDates={true}
                        nowIndicator={true}
                        viewDidMount={(view) => {
                            // Add custom styles to the calendar
                            const calendarEl = view.el;
                            const headers = calendarEl.querySelectorAll('.fc-col-header-cell');
                            headers.forEach(header => {
                                header.style.backgroundColor = 'transparent';
                                header.style.borderRadius = '8px';
                            });
                        }}
                        eventContent={renderEventContent}
                        slotLaneClassNames="dark:bg-gray-800/50 transition-colors"
                        slotLabelClassNames="text-sm font-medium text-gray-500 dark:text-gray-400"
                        dayHeaderClassNames="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase"
                        eventClassNames="rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
                        selectConstraint={{
                            startTime: '06:00:00',
                            endTime: '22:00:00',
                            dows: [0, 1, 2, 3, 4, 5, 6]
                        }}
                    />
                </div>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Modify Availability</h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                    Selected time slot:
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                    {selectedEvent?.time}
                                </p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                    on {selectedEvent?.day}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleDelete(false)}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    Delete This Slot Only
                                </button>
                                <button
                                    onClick={() => handleDelete(true)}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                                >
                                    Delete All {selectedEvent?.day} Slots at {selectedEvent?.time}
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function renderEventContent(eventInfo) {
    return (
        <div className="px-2 py-1 text-xs">
            <div className="font-medium">{eventInfo.timeText}</div>
            <div className="text-xs opacity-75">Available</div>
        </div>
    );
}
