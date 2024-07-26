import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

interface TimePickerViewRenderersProps {
  onStartTimeChange: (time: Dayjs | string) => void;
  onEndTimeChange: (time: Dayjs | string) => void;
  onStartTimeError: (error: string) => void; // 시작 시간 에러를 부모에게 전달할 콜백
  onEndTimeError: (error: string) => void; // 종료 시간 에러를 부모에게 전달할 콜백
}

const TimePickerViewRenderers: React.FC<TimePickerViewRenderersProps> = ({
  onStartTimeChange,
  onEndTimeChange,
  onStartTimeError,
  onEndTimeError
}) => {
  const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs().startOf('day'));
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs().startOf('day'));

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    setStartTime(newValue);

    if (newValue) {
      onStartTimeChange(newValue);
      onStartTimeError(''); // 시작 시간 에러 초기화
    } else {
      onStartTimeError('시작 시간을 설정해 주세요.'); // 시작 시간 에러 설정
    }
  };

  const handleEndTimeChange = (newValue: Dayjs | null) => {
    setEndTime(newValue);

    if (newValue) {
      onEndTimeChange(newValue);
      onEndTimeError(''); // 종료 시간 에러 초기화
    } else {
      onEndTimeError('종료 시간을 설정해 주세요.'); // 종료 시간 에러 설정
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'dark', // 다크 모드 설정
      primary: {
        main: '#ff5722', // 오렌지 색상 설정
      },
      background: {
        default: '#1E293B', // 다크 모드 배경 색상
        paper: '#1e293b', // 카드 배경 색상
      },
      text: {
        primary: '#ffffff', // 기본 텍스트 색상
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: '#ee9a00', // 오렌지 색상으로 테두리 설정
            },
            '&:hover fieldset': {
              borderColor: '#ee9a00', // 오렌지 색상으로 테두리 설정
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ee9a00', // 오렌지 색상으로 테두리 설정
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: '#ffffff', // 다크 모드에서 폼 레이블 색상
            '&.Mui-focused': {
              color: '#ee9a00', // 오렌지 색상으로 포커스 시 레이블 색상
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#ee9a00', // 오렌지 색상으로 아이콘 색상 설정
            fontSize: '1.5rem', // 아이콘 버튼 크기
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
                fontSize: '1.5rem', // Increase the size of the icon button
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
                fontSize: '1.5rem', // Increase the size of the icon button
              }
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default TimePickerViewRenderers;
