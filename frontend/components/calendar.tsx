import { CalendarProvider, ExpandableCalendar, TimelineList, Timeline, CalendarUtils, TimelineEventProps } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import groupBy from 'lodash/groupBy';
import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleProp, ViewStyle } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export type CalendarViewProps = {
  style?: StyleProp<ViewStyle>;
  events?: TimelineEventProps[];
};

// Päivänäkymä, joka toimii kuten alkuperäinen versio
export function DayCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const background = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const currentDate = getDate();
  const eventsByDate = groupBy(events, e => CalendarUtils.getCalendarDateString(e.start));

  return (
    <ThemedView style={{ flex: 1, backgroundColor: background }}>
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

// Viikkonäkymä, laitettu yksi sarake per päivä, scrollattava (ei skaalaudu oikein)
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
    <ThemedView style={{ flex: 1, backgroundColor: background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
        {dayNames.map((d, i) => (
          <View key={i} style={{ alignItems: 'center' }}>
            <Text style={{ color: '#00adf5', fontWeight: 'bold' }}>{d}</Text>
            <Text style={{ color: '#999', fontSize: 12 }}>{weekDates[i].split('-')[2]}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekDates.map((date, i) => (
          <View key={i} style={{ width: SCREEN_WIDTH / 7, borderRightWidth: 0.5, borderColor: '#ccc' }}>
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

// Kuukausinäkymä, toimii paremmi puhelimella kuin tietokoneella
export function MonthlyCalendarView() {
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [selectedDate, setSelectedDate] = useState(getDate());

  return (
    <ThemedView style={{ flex: 1, backgroundColor: background }}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        {/* ExpandableCalendar: vetämällä alas näkyy koko kuukausi */}
        <ExpandableCalendar
          firstDay={1}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          disablePan={false} // sallii vetoliikkeen
          theme={{
            backgroundColor: background,
            calendarBackground: background,
            dayTextColor: textColor,
            monthTextColor: textColor,
            textSectionTitleColor: textColor,
            todayTextColor: '#00adf5',
          }}
        />

        {/* Esimerkkinä valittu päivä */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: textColor, fontSize: 16 }}>
            Valittu päivä: {CalendarUtils.getCalendarDateString(selectedDate)}
          </Text>
        </View>
      </CalendarProvider>
    </ThemedView>
  );
}

// Komponentti, joka vaihtaa päivä ja viikko näkymät
export function CalendarView({ style, events = [] }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const background = useThemeColor({}, 'background');

  return (
    <ThemedView style={[{ flex: 1, backgroundColor: background }, style]}>
      <View style={{ padding: 10, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
          style={{
            backgroundColor: '#007AFF',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
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

// Tämä yhdistää kuukausi-, päivä- ja viikkonäkymän
export function CombinedCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [selectedDate, setSelectedDate] = useState(getDate());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Normalisoidaan tapahtumat ja ryhmitellään päivittäin
  const eventsByDate = useMemo(() => {
    const formattedEvents = events.map(e => ({
      ...e,
      start: new Date(e.start).toISOString(),
      end: new Date(e.end).toISOString(),
    }));
    return groupBy(formattedEvents, e =>
      CalendarUtils.getCalendarDateString(e.start)
    ) as { [key: string]: TimelineEventProps[] };
  }, [events]);

  // Palauttaa viikonpäivät (ma-su)
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

  const displayedWeek = getWeekDates(selectedDate);
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  return (
    <ThemedView style={{ flex: 1, backgroundColor: background }}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
      >
        {/* Kuukausikalenteri */}
        <ExpandableCalendar
          firstDay={1}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          theme={{
            backgroundColor: background,
            calendarBackground: background,
            dayTextColor: textColor,
            monthTextColor: textColor,
            textSectionTitleColor: textColor,
            todayTextColor: '#00adf5',
          }}
        />

        {/* Näkymänvaihto-painike */}
        <View style={{ padding: 10, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
            style={{
              backgroundColor: '#007AFF',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {viewMode === 'day' ? 'Näytä viikko' : 'Näytä päivä'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Päivänäkymä */}
        {viewMode === 'day' ? (
          <TimelineList
            events={eventsByDate}
            initialTime={{ hour: 0, minutes: 0 }}
            renderItem={(props) => (
              <Timeline
                {...props}
                start={0}
                end={24}
                format24h
                showNowIndicator
                overlapEvents={false}
              />
            )}
            showNowIndicator
            scrollToFirst
            timelineProps={{
              start: 0,
              end: 24,
              format24h: true,
            }}
          />
        ) : (
          // Viikkonäkymä
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {displayedWeek.map((date, i) => {
              const dayEvents = eventsByDate[date] || [];
              return (
                <View
                  key={date}
                  style={{
                    width: SCREEN_WIDTH / 7,
                    borderRightWidth: i < 6 ? 0.5 : 0,
                    borderColor: '#ccc',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: textColor,
                      marginVertical: 4,
                      fontWeight: date === selectedDate ? 'bold' : 'normal',
                    }}
                  >
                    {dayNames[i]} {date.split('-')[2]}
                  </Text>

                  <Timeline
                  date={date}
                    events={dayEvents}
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
                </View>
              );
            })}
          </ScrollView>
        )}
      </CalendarProvider>
    </ThemedView>
  );
}