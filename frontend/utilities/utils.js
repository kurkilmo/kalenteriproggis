import { CalendarUtils } from 'react-native-calendars';

const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate((new Date()).getDate() + offset));

export { getDate };