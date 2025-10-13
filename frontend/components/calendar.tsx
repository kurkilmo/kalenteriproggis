import groupBy from 'lodash/groupBy'
import { TimelineList, CalendarProvider, Timeline } from 'react-native-calendars'
import { TimelineEventProps, CalendarUtils, TimelineProps, TimelineListRenderItemInfo } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import { StyleProp, ViewStyle } from 'react-native';


let timelineTheme = {
    calendarBackground: "red",
    line: {}
}

function renderItem(timelineProps: TimelineProps, info: TimelineListRenderItemInfo) {
    return (
        <ThemedView style={{
            flex: 1
        }}>
            <Timeline
                events={timelineProps.events}
                start={0}
                end={24}
                date={timelineProps.date}
                theme={timelineTheme}
            />
        </ThemedView>
    )
}

export type CalendarViewProps = {
    style?: StyleProp<ViewStyle>;
    events?: TimelineEventProps[];
}

export function CalendarView({ style, events }: CalendarViewProps) {
    timelineTheme = {
        calendarBackground: useThemeColor({}, 'background'),
        line: {
            backgroundColor: useThemeColor({}, 'icon'),
        }
    }

    const mockCallback = (parm1: any, parm2: any) => {
        console.log(
            `Callback: ${parm1}, ${parm2}`
        )
    }
    const currentDate = getDate()
    const eventsByDate = groupBy(events, e => CalendarUtils.getCalendarDateString(e.start)) as {
        [key: string]: TimelineEventProps[];
    }

    return (
        <ThemedView style={style}>
            <CalendarProvider
                date={currentDate}
                onDateChanged={mockCallback}
                onMonthChange={mockCallback}
                showTodayButton
                disabledOpacity={0.6}
                //numberOfDays={3}
                style={{
                }}
            >
                <TimelineList
                    events={eventsByDate}
                    renderItem={renderItem}
                    timelineProps={{
                        format24h: true,
                    }}
                    showNowIndicator
                    scrollToFirst
                />
            </CalendarProvider>
        </ThemedView>
    )
}