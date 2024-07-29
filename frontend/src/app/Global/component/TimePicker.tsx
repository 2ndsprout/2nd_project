import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

interface TimePickerViewRenderersProps {
  startTime?: Dayjs;
  endTime?: Dayjs;
  onStartTimeChange: (time: Dayjs) => void;
  onEndTimeChange: (time: Dayjs) => void;
  onStartTimeError: (error: string) => void;
  onEndTimeError: (error: string) => void;
}

const TimePickerViewRenderers: React.FC<TimePickerViewRenderersProps> = ({
  startTime: initialStartTime,
  endTime: initialEndTime,
  onStartTimeChange,
  onEndTimeChange,
  onStartTimeError,
  onEndTimeError
}) => {
  const [startTime, setStartTime] = React.useState<Dayjs>(initialStartTime || dayjs().startOf('day'));
  const [endTime, setEndTime] = React.useState<Dayjs>(initialEndTime || dayjs().startOf('day'));

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setStartTime(newValue);
      onStartTimeChange(newValue);
      onStartTimeError('');
    } else {
      onStartTimeError('시작 시간을 설정해 주세요.');
    }
  };

  const handleEndTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setEndTime(newValue);
      onEndTimeChange(newValue);
      onEndTimeError('');
    } else {
      onEndTimeError('종료 시간을 설정해 주세요.');
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff5722',
      },
      background: {
        default: '#1E293B',
        paper: '#1e293b',
      },
      text: {
        primary: '#ffffff',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: '#ee9a00',
            },
            '&:hover fieldset': {
              borderColor: '#ee9a00',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ee9a00',
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            '&.Mui-focused': {
              color: '#ee9a00',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#ee9a00',
            fontSize: '1.5rem',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker', 'TimePicker']}>
          <TimePicker
            label="시작 시간"
            value={startTime}
            onChange={handleStartTimeChange}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ee9a00' },
                '&:hover fieldset': { borderColor: '#ee9a00' },
                '&.Mui-focused fieldset': { borderColor: '#ee9a00' },
              },
              '& .MuiFormLabel-root': { color: 'white' },
              '& .MuiFormLabel-root.Mui-focused': { color: '#ee9a00' },
              '& .MuiIconButton-root': {
                color: '#ee9a00',
                fontSize: '1.5rem',
              }
            }}
          />
          <TimePicker
            label="종료 시간"
            value={endTime}
            onChange={handleEndTimeChange}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ee9a00' },
                '&:hover fieldset': { borderColor: '#ee9a00' },
                '&.Mui-focused fieldset': { borderColor: '#ee9a00' },
              },
              '& .MuiFormLabel-root': { color: 'white' },
              '& .MuiFormLabel-root.Mui-focused': { color: '#ee9a00' },
              '& .MuiIconButton-root': {
                color: '#ee9a00',
                fontSize: '1.5rem',
              }
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default TimePickerViewRenderers;
