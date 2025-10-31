import { CalendarProvider, ExpandableCalendar, TimelineList, Timeline, CalendarUtils, TimelineEventProps } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import groupBy from 'lodash/groupBy';
import { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleProp, ViewStyle } from 'react-native';
import styles from '@/styles/calendarStyle';

const SCREEN_WIDTH = Dimensions.get('window').width;

export type CalendarViewProps = {
  style?: StyleProp<ViewStyle>;
  events?: TimelineEventProps[];
};

// Päivänäkymä
export function DayCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const background = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const currentDate = getDate();
  const eventsByDate = groupBy(events, e => CalendarUtils.getCalendarDateString(e.start));

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <CalendarProvider date={currentDate}>
        <TimelineList
          events={eventsByDate}
          showNowIndicator
          scrollToFirst
          renderItem={(props) => (
            <Timeline
              {...props}
              start={0}
              end={24}
              format24h
              hourHeight={30}
              theme={{
                calendarBackground: background,
                line: { backgroundColor: iconColor },
              }}
            />
          )}
        />
      </CalendarProvider>
    </ThemedView>
  );
}

// Viikkonäkymä
export function WeekCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const background = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const currentDate = getDate();
  const eventsByDate = groupBy(events, e => CalendarUtils.getCalendarDateString(e.start));

  const getWeekDates = (dateString: string) => {
    const date = new Date(dateString);
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return CalendarUtils.getCalendarDateString(d);
    });
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.calendarHeader}>
        {dayNames.map((d, i) => (
          <View key={i} style={styles.headerDay}>
            <Text style={styles.headerDayName}>{d}</Text>
            <Text style={styles.headerDayNumber}>{weekDates[i].split('-')[2]}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekDates.map((date, i) => (
          <View
            key={i}
            style={[styles.weekDayColumn, { width: SCREEN_WIDTH / 7 }]}
          >
            <Timeline
              events={eventsByDate[date] || []}
              start={0}
              end={24}
              format24h
              hourHeight={30}
              showNowIndicator
              overlapEvents={false}
              theme={{
                calendarBackground: background,
                line: { backgroundColor: iconColor },
              }}
            />
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

// Kuukausinäkymä
export function MonthlyCalendarView({ events = [] }: { events?: { start: string }[] }) {
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const [selectedDate, setSelectedDate] = useState(getDate());

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    events.forEach((e) => {
      const date = CalendarUtils.getCalendarDateString(e.start);
      if (!marks[date]) {
        marks[date] = { marked: true, dots: [{ color: '#00adf5' }] };
      }
    });
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#00adf5',
      };
    }
    return marks;
  }, [events, selectedDate]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        <ExpandableCalendar
          firstDay={1}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          disablePan={false}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            backgroundColor: background,
            calendarBackground: background,
            dayTextColor: textColor,
            monthTextColor: textColor,
            textSectionTitleColor: textColor,
            todayTextColor: '#00adf5',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#fff',
            dotColor: '#00adf5',
          }}
        />

        <View style={styles.selectedDateContainer}>
          <Text style={[styles.selectedDateText, { color: textColor }]}>
            Valittu päivä: {selectedDate}
          </Text>
        </View>
      </CalendarProvider>
    </ThemedView>
  );
}

// Päivä/viikko -vaihtaja
export function CalendarView({ style, events = [] }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const background = useThemeColor({}, 'background');

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }, style]}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {viewMode === 'day' ? 'Näytä viikko' : 'Näytä päivä'}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'day' ? (
        <DayCalendarView events={events} />
      ) : (
        <WeekCalendarView events={events} />
      )}
    </ThemedView>
  );
}

// Yhdistetty kuukausi/päivä/viikkonäkymä
export function CombinedCalendarView({ events = [] }: { events?: any[] }) {
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const scrollRefs = useRef<ScrollView[]>([]);
  const isSyncingScroll = useRef(false);

  const formattedEvents = events.map((e) => ({
    ...e,
    start: new Date(e.start).toISOString(),
    end: new Date(e.end).toISOString(),
  }));

  const eventsByDate = groupBy(formattedEvents, (e) =>
    CalendarUtils.getCalendarDateString(e.start)
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    Object.keys(eventsByDate).forEach((date) => {
      marks[date] = {
        marked: true,
        dots: [{ color: '#00adf5' }],
      };
      if (selectedDate === date) {
        marks[date].selected = true;
        marks[date].selectedColor = '#00adf5';
      }
    });
    if (!marks[selectedDate]) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: '#00adf5',
      };
    }
    return marks;
  }, [eventsByDate, selectedDate]);

  const onScrollSync = (e: NativeSyntheticEvent<NativeScrollEvent>, index: number) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    const y = e.nativeEvent.contentOffset.y;
    scrollRefs.current.forEach((ref, i) => {
      if (i !== index && ref) ref.scrollTo({ y, animated: false });
    });
    setTimeout(() => (isSyncingScroll.current = false), 20);
  };

  const getWeekDates = (dateString: string) => {
    const date = new Date(dateString);
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return CalendarUtils.getCalendarDateString(d);
    });
  };

  const displayedDates =
    viewMode === 'week' ? getWeekDates(selectedDate) : [selectedDate];
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        <ExpandableCalendar
          firstDay={1}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          disablePan={false}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            backgroundColor: background,
            calendarBackground: background,
            dayTextColor: textColor,
            monthTextColor: textColor,
            textSectionTitleColor: textColor,
            todayTextColor: '#00adf5',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#fff',
            dotColor: '#00adf5',
          }}
        />

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {viewMode === 'day' ? 'Näytä viikko' : 'Näytä päivä'}
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'day' ? (
          <TimelineList
            events={eventsByDate}
            renderItem={(props) => (
              <Timeline
                {...props}
                start={0}
                end={24}
                format24h
                hourHeight={60}
                showNowIndicator
                overlapEvents={false}
                theme={{
                  calendarBackground: background,
                  line: { backgroundColor: '#ccc' },
                }}
              />
            )}
            initialTime={{ hour: 0, minutes: 0 }}
            showNowIndicator
            scrollToFirst
          />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {displayedDates.map((date, i) => (
              <ScrollView
                key={date}
                ref={(ref) => {
                  if (ref) scrollRefs.current[i] = ref;
                }}
                onScroll={(e) => onScrollSync(e, i)}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={[
                  styles.weekDayColumn,
                  { width: SCREEN_WIDTH / 7, borderRightWidth: i < 6 ? 0.5 : 0 },
                ]}
              >
                <Text
                  style={[
                    styles.weekDayTitle,
                    {
                      color: textColor,
                      fontWeight: date === selectedDate ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {dayNames[i]} {date.split('-')[2]}
                </Text>

                <Timeline
                  date={date}
                  events={eventsByDate[date] || []}
                  start={0}
                  end={24}
                  format24h
                  hourHeight={60}
                  showNowIndicator
                  overlapEvents={false}
                  theme={{
                    calendarBackground: background,
                    line: { backgroundColor: '#ccc' },
                  }}
                />
              </ScrollView>
            ))}
          </ScrollView>
        )}
      </CalendarProvider>
    </ThemedView>
  );
}