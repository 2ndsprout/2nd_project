import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';

// 동적 import
const DatePicker = dynamic(() => import('react-tailwindcss-datepicker'), { ssr: false });

interface DatePickerProps {
    startDate?: Date | null;
    endDate?: Date | null;
    onDateChange: (newValue: DateValueType | string) => void;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({ startDate, endDate, onDateChange }) => {
    const [value, setValue] = useState<DateValueType>({
        startDate: startDate || null,
        endDate: endDate || null,
    });

    useEffect(() => {
        setValue({
            startDate: startDate || null,
            endDate: endDate || null,
        });
    }, [startDate, endDate]);

    const handleValueChange = (newValue: DateValueType) => {
        setValue(newValue);

        if (!newValue?.startDate || !newValue?.endDate) {
            onDateChange('날짜를 선택해주세요');
        } else {
            onDateChange(newValue); // Call the prop function to notify the parent
        }
    };

    const configs = {
        shortcuts: {
            today: '오늘',
            yesterday: '어제',
            past: (period: number) => `${period}일 전`,
            currentMonth: '이번 달',
            pastMonth: '지난 달',
        },
        footer: {
            cancel: '취소',
            apply: '적용',
        },
    };

    return (
        <div className="dark">
            <DatePicker
                value={value} // Ensure this matches the type DateValueType
                onChange={handleValueChange}
                showShortcuts={true}
                primaryColor={'orange'}
                configs={configs}
                i18n='ko'
            />
        </div>
    );
};

export default DatePickerComponent;
