'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

import '../globals.css';
import { useRouter } from 'next/navigation';

interface LessonType {
    id: number;
    type: string;
    lessonResponseDTO: {
        id: number;
        name: string;
        startDate: number;
        endDate: number;
        startTime: number;
        endTime: number;
    };
}

interface CalendarProps {
    lessons: LessonType[];
}

const Calendar: React.FC<CalendarProps> = ({ lessons }) => {
    const router = useRouter();

    // FullCalendar expects event objects to have certain properties
    const formattedLessons = lessons.map(lesson => ({
        id: lesson.lessonResponseDTO.id.toString(),
        title: lesson.lessonResponseDTO.name,
        start: getDateTime(lesson.lessonResponseDTO.startDate),
        end: getDateTime(lesson.lessonResponseDTO.endDate),
        allDay: false // Change this to true if lessons are all-day events
    })
);
    console.log('Formatted Lessons:', formattedLessons);

    const handleEventClick = (info: EventClickArg) => {
        const eventId = info.event.id;
        router.push(`/events/${eventId}`);
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
        return date.toISOString(); // FullCalendar expects ISO 8601 format
    }

    return (
        <div className='calendar-container'>
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
                eventBackgroundColor="orange"
                eventBorderColor="#000000"
                timeZone="UTC"
                locale={"ko"}
                headerToolbar={{
                    left: "prev,next today prevYear nextYear",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                height={450}
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
            />
        </div>
    );
};

export default Calendar;
