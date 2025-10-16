import { getDate } from '@/utilities/utils';
import { TimelineEventProps } from 'react-native-calendars'

const EVENT_COLOR = '#e6add8';

const timelineEvents: TimelineEventProps[] = [
    {
        start: `${getDate(-1)} 09:20:00`,
        end: `${getDate(-1)} 12:00:00`,
        title: 'Merge Request to React Native Calendars',
        summary: 'Merge Timeline Calendar to React Native Calendars'
    },
    {
        start: `${getDate()} 01:15:00`,
        end: `${getDate()} 02:30:00`,
        title: 'Meeting A',
        summary: 'Summary for meeting A',
        color: EVENT_COLOR
    },
    {
        start: `${getDate()} 01:30:00`,
        end: `${getDate()} 02:30:00`,
        title: 'Meeting B',
        summary: 'Summary for meeting B',
        color: EVENT_COLOR
    },
    {
        start: `${getDate()} 01:45:00`,
        end: `${getDate()} 02:45:00`,
        title: 'Meeting C',
        summary: 'Summary for meeting C',
        color: EVENT_COLOR
    },
    {
        start: `${getDate(1)} 00:30:00`,
        end: `${getDate(1)} 01:30:00`,
        title: 'Visit Grand Mother',
        summary: 'Visit Grand Mother and bring some fruits.',
        color: 'lightblue'
    },
    {
        start: `${getDate(1)} 02:30:00`,
        end: `${getDate(1)} 03:20:00`,
        title: 'Meeting with Prof. Behjet Zuhaira',
        summary: 'Meeting with Prof. Behjet at 130 in her office.',
        color: EVENT_COLOR
    }
];

export { timelineEvents };