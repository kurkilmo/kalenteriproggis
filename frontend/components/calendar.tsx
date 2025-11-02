import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Animated, StyleSheet } from 'react-native';
import { CalendarProvider, ExpandableCalendar, TimelineList, Timeline, CalendarUtils, type TimelineEventProps } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import groupBy from 'lodash/groupBy';
import styles from '@/styles/calendarStyle';

// HUOM!!! VAHNAT KALNTERINÄKYMÄT EI OLE PÄIVITETTY

// Animoidun paneelin mitat
const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 320;
const SCREEN_WIDTH = Dimensions.get('window').width;

export type CalendarViewProps = {
  events?: TimelineEventProps[];
};

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
export function CalendarView({ events = [] }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const background = useThemeColor({}, 'background');

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
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

export function CombinedCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [selectedDate, setSelectedDate] = useState(getDate());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [expanded, setExpanded] = useState(true);
  const heightAnim = useRef(new Animated.Value(EXPANDED_HEIGHT)).current;

  const toggleExpand = () => {
    const toValue = expanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
    Animated.timing(heightAnim, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  // Normalisoidaan ja ryhmitellään eventit
  const formattedEvents = events.map((e) => ({
    ...e,
    start: new Date(e.start).toISOString(),
    end: new Date(e.end).toISOString(),
  }));
  const eventsByDate = useMemo(
    () =>
      groupBy(formattedEvents, (e) =>
        CalendarUtils.getCalendarDateString(e.start)
      ),
    [formattedEvents]
  );

  // Merkkaukset kuukausikalenteriin
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
      marks[selectedDate] = { selected: true, selectedColor: '#00adf5' };
    }
    return marks;
  }, [eventsByDate, selectedDate]);

  // Viikon päivämäärät (ma–su)
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

  const displayedDates = getWeekDates(selectedDate);
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        {/* Kuukausikalenterin näyttö/piilotus */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {expanded ? 'Piilota kuukausikalenteri' : 'Näytä kuukausikalenteri'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Kuukausikalenteri */}
        <Animated.View style={{ overflow: 'hidden', height: heightAnim }}>
          <ExpandableCalendar
            firstDay={1}
            onDayPress={(day) => setSelectedDate(day.dateString)}
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
        </Animated.View>

        {/* Päivä/viikko -vaihto */}
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

        {/* Päivänäkymä */}
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
            timelineProps={{
              format24h: true,
              start: 0,
              end: 24,
            }}
          />
        ) : (
          <CustomWeekView
            selectedDate={selectedDate}
            events={formattedEvents}
            textColor={textColor}
            background={background}
          />
        )}
      </CalendarProvider>
    </ThemedView>
  );
}


// Oma viikkonäkymä (ei käytä react-native-calendars Timelinea)
function CustomWeekView({
  selectedDate,
  events,
  textColor,
  background,
}: {
  selectedDate: string;
  events: TimelineEventProps[];
  textColor: string;
  background: string;
}) {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
  const todayString = new Date().toISOString().split('T')[0];

  const [currentMinutes, setCurrentMinutes] = React.useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Päivitä viiva kerran minuutissa
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Ryhmittele eventit päivän mukaan
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, TimelineEventProps[]> = {};
    for (const e of events) {
      const date = e.start.split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    }
    return grouped;
  }, [events]);

  // Viikon päivämäärät
  const getWeekDates = (dateString: string) => {
    const date = new Date(dateString);
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  };
  const weekDates = getWeekDates(selectedDate);

  // Tapahtuman sijainti
  const getEventStyle = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    const top = startHour * 60;
    const height = Math.max((endHour - startHour) * 60, 20);
    return { top, height };
  };

  return (
    <ScrollView horizontal style={{ backgroundColor: background }}>
      {weekDates.map((date, i) => {
        const isToday = date === todayString;
        const isSelected = date === selectedDate;
        const currentTop = currentMinutes; // px = minuutit

        return (
          <View
            key={date}
            style={{
              width: SCREEN_WIDTH / 7,
              borderRightWidth: i < 6 ? 1 : 0,
              borderColor: '#ddd',
            }}
          >
            {/* Päiväotsikko */}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderColor: '#ddd',
              }}
            >
              <Text
                style={{
                  color: isToday ? '#00adf5' : textColor,
                  fontWeight: isSelected ? 'bold' : 'normal',
                }}
              >
                {dayNames[i]} {date.split('-')[2]}
              </Text>
            </View>

            {/* Skrollattava aikajana */}
            <ScrollView style={{ height: 24 * 60 }} showsVerticalScrollIndicator>
              {/* Tuntiviivat */}
              {HOURS.map((h) => (
                <View key={h} style={localStyles.hourRow}>
                  <Text style={localStyles.hourLabel}>{h}:00</Text>
                  <View style={localStyles.hourLine} />
                </View>
              ))}

              {/* Päivän tapahtumat */}
              {(eventsByDate[date] || []).map((event, idx) => {
                const pos = getEventStyle(event.start, event.end);
                return (
                  <View
                    key={idx}
                    style={[
                      localStyles.eventBox,
                      {
                        top: pos.top,
                        height: pos.height,
                        left: 45 + (idx % 2) * 70,
                        backgroundColor: event.color || '#00adf5',
                      },
                    ]}
                  >
                    <Text numberOfLines={2} style={localStyles.eventText}>
                      {event.title}
                    </Text>
                  </View>
                );
              })}

              {/* Nykyhetken punainen viiva (vain jos tämä päivä) */}
              {isToday && (
                <View
                  style={[
                    localStyles.nowLine,
                    { top: currentTop },
                  ]}
                />
              )}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  hourRow: { flexDirection: 'row', alignItems: 'center', height: 60 },
  hourLabel: { width: 35, fontSize: 10, color: '#666' },
  hourLine: { flex: 1, height: 1, backgroundColor: '#eee' },
  eventBox: {
    position: 'absolute',
    width: 70,
    borderRadius: 6,
    padding: 3,
  },
  eventText: { fontSize: 10, color: '#fff' },
  nowLine: {
    position: 'absolute',
    left: 35,
    right: 0,
    height: 2,
    backgroundColor: 'red',
    zIndex: 10,
  },
});
