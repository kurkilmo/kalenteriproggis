import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {
  CalendarProvider, ExpandableCalendar, TimelineList, Timeline, CalendarUtils, type TimelineEventProps } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import groupBy from 'lodash/groupBy';
import styles from '@/styles/calendarStyle';

// HUOM!!! VAHNAT KALNTERINÄKYMÄT EI OLE PÄIVITETTY

// Määrittelyt ja vakioarvot
const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 200; // Kuukauden viemän alueen koko
const SCREEN_WIDTH = Dimensions.get('window').width;
const HOUR_HEIGHT = 60; // px per tunti
const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // px per minuutti

// Päivänäkymä (mahdollisesti ei toimi kunnolla, ei testattu))
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
          renderItem={props => (
            <Timeline
              {...props}
              start={0}
              end={24}
              format24h
              hourHeight={HOUR_HEIGHT}
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

// Yhdistetty kalenterinäkymä (kuukausi + päivä/viikko)
export function CombinedCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [selectedDate, setSelectedDate] = useState(getDate());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [expanded, setExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(fadeAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  // Normalisoi ja ryhmittelee tapahtumat päivän mukaan
  const formattedEvents = useMemo(
    () =>
      events.map(e => ({
        ...e,
        start: new Date(e.start).toISOString(),
        end: new Date(e.end).toISOString(),
      })),
    [events]
  );

  const eventsByDate = useMemo(
    () => groupBy(formattedEvents, e => CalendarUtils.getCalendarDateString(e.start)),
    [formattedEvents]
  );

  // Luo merkinnät ExpandableCalendaria varten
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    Object.keys(eventsByDate).forEach(date => {
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

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        {/* Kuukausinäkymän piilotus/näyttö ja päivä/viikkonäkymän vaihto napit*/}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={toggleExpand} style={styles.smallButton}>
            <Text style={styles.buttonText}>
              {expanded ? 'Piilota kuukausi' : 'Näytä kuukausi'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
            style={styles.smallButton}
          >
            <Text style={styles.buttonText}>
              {viewMode === 'day' ? 'Näytä viikko' : 'Näytä päivä'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Kuukausinäkymän avaamis animaatio */}
        {expanded && (
          <>
            {/* Tummennetaan tausta */}
            <TouchableWithoutFeedback onPress={toggleExpand}>
              <Animated.View
                pointerEvents="auto"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  opacity: fadeAnim,
                  zIndex: 15,
                }}
              />
            </TouchableWithoutFeedback>

            {/* Kuukausikalenteri itse */}
            <Animated.View
              style={{
                position: 'absolute',
                top: 100, // nappien alapuolelle
                alignSelf: 'center',
                opacity: fadeAnim,
                zIndex: 20,
              }}
            >
              <CustomMonthView
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  toggleExpand(); // sulkee kalenterin kun päivää valitaan
                }}
                textColor={textColor}
                background={background}
              />
            </Animated.View>
          </>
        )}

        {/* Näkymätyypin renderöinti */}
        {viewMode === 'day' ? (
          <CustomDayView
            selectedDate={selectedDate}
            events={formattedEvents}
            textColor={textColor}
            background={background}
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

// Päivänäkymä
function CustomDayView({
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
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const todayString = new Date().toISOString().split('T')[0];

  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apufunktio: palauttaa "Ke 05" -muodossa olevan otsikon
  const getDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];
    const dayName = dayNames[date.getDay()];
    const dayNum = String(date.getDate()).padStart(2, '0');
    return `${dayName} ${dayNum}`;
  };

  // Suodata tapahtumat valitulle päivälle
  const dayEvents = useMemo(() => {
    const day = selectedDate.split('T')[0];
    return events.filter(e => e.start.split('T')[0] === day);
  }, [events, selectedDate]);

  // Tapahtuman sijainti aikajanalla
  const getEventStyle = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    const top = startHour * HOUR_HEIGHT;
    const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 20);
    return { top, height };
  };

  const currentTop = currentMinutes * MINUTE_HEIGHT;
  const isToday = selectedDate === todayString;

  return (
    <ScrollView style={{ backgroundColor: background }}>
      {/* Päiväotsikko */}
      <View style={styles.weekHeader}>
        <Text
          style={[
            styles.weekHeaderText,
            {
              color: isToday ? '#00adf5' : textColor,
              fontWeight: 'bold',
            },
          ]}
        >
          {getDayLabel(selectedDate)}
        </Text>
      </View>

      {/* Aikajana */}
      <ScrollView style={{ height: 24 * HOUR_HEIGHT }} showsVerticalScrollIndicator>
        {HOURS.map(h => (
          <View key={h} style={localStyles.hourRow}>
            <Text style={localStyles.hourLabel}>{h}:00</Text>
            <View style={localStyles.hourLine} />
          </View>
        ))}

        {/* Päivän tapahtumat */}
        {dayEvents.map((event, idx) => {
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

        {/* Punainen viiva, jos tänään */}
        {isToday && (
          <View
            style={[
              localStyles.nowLine,
              { top: currentTop },
            ]}
          />
        )}
      </ScrollView>
    </ScrollView>
  );
}

// Viikkonäkymä
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
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
  const todayString = new Date().toISOString().split('T')[0];

  // Synkronoidun scrollauksen muuttujat
  const scrollRefs = useRef<ScrollView[]>([]);
  const isSyncingScroll = useRef(false);

  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Ryhmittele tapahtumat päivittäin
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, TimelineEventProps[]> = {};
    for (const e of events) {
      const date = e.start.split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    }
    return grouped;
  }, [events]);

  // Hae viikonpäivät (ma–su)
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

  // Aseta kaikkien ScrollViewn scroll-asento samaksi
  const onScrollSync = (e: NativeSyntheticEvent<any>, index: number) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    const y = e.nativeEvent.contentOffset.y;
    scrollRefs.current.forEach((ref, i) => {
      if (i !== index && ref) {
        ref.scrollTo({ y, animated: false });
      }
    });
    setTimeout(() => (isSyncingScroll.current = false), 16);
  };

  const getEventStyle = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    const top = startHour * HOUR_HEIGHT;
    const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 20);
    return { top, height };
  };

  const currentTop = currentMinutes * MINUTE_HEIGHT;

  return (
    <ScrollView horizontal style={{ backgroundColor: background }}>
      {weekDates.map((date, i) => {
        const isToday = date === todayString;
        const isSelected = date === selectedDate;

        return (
          <View
            key={date}
            style={{
              width: Math.max(SCREEN_WIDTH / 7, 110), // minimi leveys
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

            {/* Aikajana ja tapahtumat */}
            <ScrollView
              ref={(ref) => {
                if (ref) scrollRefs.current[i] = ref;
              }}
              onScroll={(e) => onScrollSync(e, i)}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator
              style={{ height: 24 * HOUR_HEIGHT }}
            >
              {/* Tuntiviivat */}
              {Array.from({ length: 24 }, (_, h) => (
                <View key={h} style={localStyles.hourRow}>
                  <Text style={localStyles.hourLabel}>{h}:00</Text>
                  <View style={localStyles.hourLine} />
                </View>
              ))}

              {/* Tapahtumat */}
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

              {/* Nykyhetken punainen viiva */}
              {isToday && <View style={[localStyles.nowLine, { top: currentTop }]} />}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}


function CustomMonthView({
  selectedDate,
  onDateSelect,
  textColor,
  background,
}: {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  textColor: string;
  background: string;
}) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const selected = new Date(selectedDate);
  const year = selected.getFullYear();
  const month = selected.getMonth();

  // Kuukauden päivien laskenta
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Maanantain aloitus
  const startDay = (firstDay.getDay() + 6) % 7; // 0 = ma
  const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7;

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - startDay + 1;
    const dayDate = new Date(year, month, dayOffset);
    days.push({
      date: dayDate,
      isCurrentMonth: dayDate.getMonth() === month,
    });
  }

  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  return (
    <View style={[monthStyles.container, { backgroundColor: background }]}>
      {/* Kuukauden otsikko */}
      <Text style={[monthStyles.monthTitle, { color: textColor }]}>
        {selected.toLocaleString('fi-FI', { month: 'long', year: 'numeric' })}
      </Text>

      {/* Päivien nimet */}
      <View style={monthStyles.weekHeader}>
        {dayNames.map((d, i) => (
          <Text key={i} style={[monthStyles.weekDay, { color: textColor }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* Kuukauden ruudukko */}
      <View style={monthStyles.grid}>
        {days.map((d, i) => {
          const dateStr = d.date.toISOString().split('T')[0];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <TouchableOpacity
              key={i}
              style={[
                monthStyles.dayCell,
                {
                  backgroundColor: isSelected ? '#00adf5' : 'transparent',
                  opacity: d.isCurrentMonth ? 1 : 0.4,
                },
              ]}
              onPress={() => onDateSelect(dateStr)}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : isToday ? '#00adf5' : textColor,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: 12,
                }}
              >
                {d.date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const monthStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320, // kiinteä leveys
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 320, // sama leveys kuin otsikolla
    alignSelf: 'center',
  },
  dayCell: {
    width: 320 / 7 - 2, // kompaktimpi laskettu leveys
    height: 26, // matalampi rivi
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 1,
  },
});

// Tapahtumaruudun säätö
const localStyles = StyleSheet.create({
  hourRow: { flexDirection: 'row', height: HOUR_HEIGHT },
  hourLabel: { width: 35, fontSize: 10, color: '#666' },
  hourLine: { flex: 1, height: 1, backgroundColor: '#eee', alignSelf: 'flex-start', marginTop: 0 },
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
