'use client';

import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { useRouter } from 'next/navigation';
import '../../globals.css';



interface LessonType {
    id: number;
    name: string;
    startDate: number;
    endDate: number;
}

interface CalendarProps {
    lessons: LessonType[];
    height?: number;
    width?: number | string;
    padding?: number | string;
}

const Calendar: React.FC<CalendarProps> = ({ lessons, height, width, padding = '10px' }) => {
    const router = useRouter();

    // Define the color scheme
    const colors = ['orange', '#FFCC99', '#F0E68C'];

    // FullCalendar expects event objects to have certain properties
    const formattedLessons = useMemo(() => {
        return lessons.map((lesson, index) => {
            // Determine the color based on the index
            const colorIndex = index % colors.length;
            const backgroundColor = colors[colorIndex];
            const borderColor = colors[colorIndex];

            return {
                id: lesson?.id.toString(),
                title: lesson?.name,
                start: getDateTime(lesson?.startDate),
                end: getDateTime(lesson?.endDate),
                allDay: true, // Change to true if events are all-day
                backgroundColor: backgroundColor, // Set background color
                borderColor: borderColor // Set border color
            };
        });
    }, [lessons]);

    const handleEventClick = (info: EventClickArg) => {
        const eventId = info.event.id;
        router.push(`/account/lesson/${eventId}`);
    };

    const handleDateClick = (info: DateClickArg) => {
        const calendarApi = info.view.calendar;
        calendarApi.changeView('timeGridWeek');
        calendarApi.gotoDate(info.dateStr);
        const clickedDate = new Date(info.dateStr);
        const epochTime = clickedDate.getTime();

        console.log('Clicked Date (Epoch):', epochTime);
    };

    function getDateTime(epochTime: number): string {
        const date = new Date(epochTime);
        return date?.toISOString(); // FullCalendar expects ISO 8601 format
    }

    // Find the date of the first event to focus on
    const initialDate = useMemo(() => {
        const sortedLessons = [...lessons].sort((a, b) => a.startDate - b.startDate);
        return sortedLessons.length > 0 ? new Date(sortedLessons[0].startDate).toISOString() : new Date().toISOString();
    }, [lessons]);

    return (
        <div className='calendar-container' style={{ height, width, padding }}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                events={formattedLessons}
                editable={false}
                droppable={true}
                selectable={false}
                selectMirror={true}
                nowIndicator={true}
                timeZone="local"
                locale={"ko"}
                eventTextColor='black'
                headerToolbar={{
                    left: "prev,next today prevYear nextYear",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                initialDate={initialDate} // Set the initial date to the first event's date
                height={height}
                dayCellContent={(info) => {
                    const day = info.date.getDay();
                    const isSaturday = day === 6;
                    const isSunday = day === 0;

                    const className = isSaturday ? 'text-red' : isSunday ? 'text-blue' : '';
                    const dayNumberText = info.dayNumberText.replace('일', '');

                    return (
                        <div className={`fc-daygrid-day-number ${className}`}>
                            {dayNumberText}
                        </div>
                    );
                }}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short', // AM/PM 표시
                }}
            />
        </div>
    );
};

export default Calendar;
