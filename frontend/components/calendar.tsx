import { ExpandableCalendar, CalendarProvider, TimelineList, CalendarUtils, TimelineEventProps, TimelineProps, Timeline } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import groupBy from 'lodash/groupBy';
import { StyleProp, ViewStyle, View, TouchableOpacity, Text, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useEffect, useState, useRef } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Androidilla sallitaan LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

 // Renderöi yksittäisen päivän aikajanan Timeline-komponentilla.
 // Käyttää teeman mukaisia värejä ja estää ylimääräisen "key" propin leviämisen.
function TimelineDayView({ timelineProps }: { timelineProps: TimelineProps }) {
  const background = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const { key, ...safeProps } = timelineProps as any;

  return (
    <ThemedView style={{ flex: 1, backgroundColor: background }}>
      <Timeline
        {...safeProps} 
        start={0} 
        end={24} 
        format24h 
        hourHeight={60} 
        showNowIndicator 
        scrollToFirst 
        overlapEvents={false} 
        theme={{
          calendarBackground: background,
          line: { backgroundColor: iconColor },
        }}
      />
    </ThemedView>
  );
}

export type CalendarViewProps = {
  style?: StyleProp<ViewStyle>;
  events?: TimelineEventProps[]; // Lista kaikkia tapahtumia
};

 // Pääkomponentti, joka sisältää päivä- ja viikkonäkymän.
 // Päivänäkymä näyttää yhden päivän aikajanan, viikkonäkymä koko viikon rinnakkain.
export function CalendarView({ style, events = [] }: CalendarViewProps) {
  const background = useThemeColor({}, 'background'); // taustaväri
  const textColor = useThemeColor({}, 'text');        // tekstiväri

  const [selectedDate, setSelectedDate] = useState(getDate()); // valittu päivä
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day'); // näkymätila
  const scrollRefs = useRef<ScrollView[]>([]); // viikkonäkymän skrollireferenssit
  const isSyncingScroll = useRef(false);      // estää itseään kutsumasta scroll-synkronoinnissa
  const fadeAnim = useRef(new Animated.Value(1)).current; // fade-animaatio päivän vaihtuessa

  // Muodostetaan tapahtumat ISO-muotoon
  const formattedEvents = events.map(e => ({
    ...e,
    start: new Date(e.start).toISOString(),
    end: new Date(e.end).toISOString(),
  }));

  // Ryhmitellään tapahtumat päivämäärän mukaan
  const eventsByDate = groupBy(formattedEvents, e =>
    CalendarUtils.getCalendarDateString(e.start)
  ) as { [key: string]: TimelineEventProps[] };

  // Palauttaa viikon päivämäärät maanantaista sunnuntaihin
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

  // Päivät, jotka näytetään riippuen näkymätilasta
  const displayedDates =
    viewMode === 'week' ? getWeekDates(selectedDate) : [selectedDate];

  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']; // viikonpäivät

  // Synkronoi pystysuuntainen skrollaus viikkonäkymässä
  const onScrollSync = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    index: number
  ) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    const y = e.nativeEvent.contentOffset.y;
    scrollRefs.current.forEach((ref, i) => {
      if (i !== index && ref) ref.scrollTo({ y, animated: false });
    });
    setTimeout(() => {
      isSyncingScroll.current = false;
    }, 20);
  };

  // Palauttaa viikonpäivän nimen annetulle päivälle
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const index = (date.getDay() + 6) % 7;
    return dayNames[index];
  };

  // Animaatio päivän vaihtuessa
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [selectedDate]);

  return (
    <ThemedView style={[{ flex: 1, backgroundColor: background }, style]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
        {/* Kuukausikalenteri */}
        <ExpandableCalendar
          firstDay={1}
          onDayPress={(day) => setSelectedDate(day.dateString)}
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
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            {/* Päivän otsikko */}
            <View style={{ alignItems: 'center', marginVertical: 6 }}>
              <Text
                style={{
                  color: '#ccc',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {getDayName(selectedDate)} {selectedDate.split('-')[2]}
              </Text>
            </View>

            {/* Päivän Timeline */}
            <TimelineList
              events={eventsByDate}
              renderItem={(props) => <TimelineDayView timelineProps={props} />}
              initialTime={{ hour: 0, minutes: 0 }}
              showNowIndicator
              scrollToFirst
              timelineProps={{
                format24h: true,
                start: 0,
                end: 24,
              }}
            />
          </Animated.View>
        ) : (
          /* Viikkonäkymä */
          <View style={{ flex: 1 }}>
            {/* Viikonpäivien otsikot */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 6,
                marginBottom: 4,
              }}
            >
              {dayNames.map((d, i) => {
                const date = displayedDates[i];
                const isToday =
                  date === CalendarUtils.getCalendarDateString(new Date());
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setSelectedDate(date);
                      setViewMode('day');
                    }}
                    style={{
                      width: SCREEN_WIDTH / 7 - 4,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: isToday ? '#00adf5' : textColor,
                        fontWeight: isToday ? 'bold' : 'normal',
                      }}
                    >
                      {d}
                    </Text>
                    <Text
                      style={{
                        color: isToday ? '#00adf5' : textColor,
                        fontSize: 12,
                      }}
                    >
                      {date.split('-')[2]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Viikon aikajanat rinnakkain */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
              }}
            >
              {displayedDates.map((date, i) => (
                <ScrollView
                  key={date}
                  ref={(ref) => {
                    if (ref) scrollRefs.current[i] = ref;
                  }}
                  onScroll={(e) => onScrollSync(e, i)}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: SCREEN_WIDTH / 7,
                    borderRightWidth: i < 6 ? 0.5 : 0,
                    borderColor: '#ccc',
                    height: '100%',
                  }}
                >
                  <Timeline
                    events={eventsByDate[date] || []} // En saanut tapahtumia toimimaan viikkonäkymässä,
                    start={0}                         // tätä google ohjeisti käyttämään mutta ei toiminut
                    end={24}
                    format24h
                    hourHeight={60}
                    scrollToFirst
                    showNowIndicator
                    overlapEvents={false}
                  />
                </ScrollView>
              ))}
            </ScrollView>
          </View>
        )}
      </CalendarProvider>
    </ThemedView>
  );
}
