import dayjs from 'dayjs';

export const parseToDayjsObj = (value: any): dayjs.Dayjs | null => {
  if (!value) return null;
  
  if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    const parsedTime = dayjs(`1970-01-01T${value}`);
    return parsedTime.isValid() ? parsedTime : null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const parseToDayjs = (value: any, format: string = 'DD/MM/YYYY'): string | null => {
  const parsed = parseToDayjsObj(value);
  return parsed ? parsed.format(format) : null;
};

export const formatToBE = (value: any, type: 'date' | 'time' | 'datetime' = 'datetime'): string | null => {
  if (!value || !dayjs.isDayjs(value)) return value || null;

  switch (type) {
    case 'date':
      return value.format('YYYY-MM-DD'); 
    case 'time':
      return value.format('HH:mm:ss');    
    case 'datetime':
    default:
      return value.toISOString();    
  }
};