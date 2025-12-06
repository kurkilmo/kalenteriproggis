import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, TouchableWithoutFeedback, NativeSyntheticEvent, Modal, useWindowDimensions } from 'react-native';
import { CalendarProvider, type TimelineEventProps } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import styles, { monthStyles, localStyles } from '@/styles/calendarStyle';
import { useTranslation } from 'react-i18next';
import { getCalendars } from 'expo-localization';
import { useSettings } from './SettingsContext';
import { DateTime } from 'luxon';

// Näytön mitat ja perusasetukset aikajanoille
const SCREEN_WIDTH = Dimensions.get('window').width;
const HOUR_HEIGHT = 60; // yhden tunnin korkeus pikseleinä // MUISTA MUUTTAA MYÖS TYYLEISSÄ!!!
const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // yhden minuutin korkeus

type ExtendedEvent = TimelineEventProps & {
  isBusy?: boolean;
};

// Pääkomponentti, joka yhdistää kuukausi-, viikko- ja päivänäkymän
export function CombinedCalendarView({
  events = [],
  busy = [],
}: {
  events?: TimelineEventProps[];
  busy?: any[];
}) {
  const { t, i18n } = useTranslation() // Lokalisaatio
  const { settings, setSettings } = useSettings() // Asetukset
  if (!Array.isArray(events)) events = []; // Jos tapahtumat eivät ole taulukko, alustetaan ne tyhjäksi

  // Teemavärit haetaan sovelluksen teemasta
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Komponentin tilat
  const [selectedDate, setSelectedDate] = useState(getDate()); // valittu päivä ISO-muodossa
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day'); // näkymätila
  const [expanded, setExpanded] = useState(false); // onko kuukausinäkymä näkyvissä
  const fadeAnim = useRef(new Animated.Value(0)).current; // animointiarvo overlaylle

  useEffect( () => {

  }, [settings.timezone])

  // Näyttää tai piilottaa kuukausinäkymän animaation avulla
  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(fadeAnim, { 
      toValue,
      duration: 200, // animaation kesto millisekunteina, kuinka nopeasti kalenteri ilmestyy
      useNativeDriver: true, // nopeampi ja sujuvampi animaatio
    }).start();
    setExpanded(!expanded);
  };
  
  // Muotoillaan tapahtumien päivämäärät ISO-standardimuotoon, jotta ne toimivat vertailussa
  const formattedEvents: ExtendedEvent[] = useMemo(
    () =>
      events.map((ev) => {
        /** Aikavyöhykekonversio */
        let e : TimelineEventProps = {...ev}
        e.start = DateTime.fromISO(ev.start, {zone: "utc" }).setZone(settings.timezone).toISO() ?? ev.start;
        e.end   = DateTime.fromISO(ev.end,   {zone: "utc" }).setZone(settings.timezone).toISO() ?? ev.end;

        const startISO = e.start.includes("T") ? e.start : e.start.replace(" ", "T");
        const endISO   = e.end.includes("T")   ? e.end   : e.end.replace(" ", "T");

        return {
          ...e,
          start: startISO,
          end: endISO,
          date: startISO.slice(0, 10),
        };
      }),
    [events, settings.timezone]
  );

  const formattedBusy: ExtendedEvent[] = useMemo(
    () =>
      busy.map((bu) => {
        /** Aikavyöhykekonversio */
        let b : TimelineEventProps = {...bu}
        b.start = DateTime.fromISO(bu.start, {zone: "utc" }).setZone(settings.timezone).toISO() ?? bu.start;
        b.end   = DateTime.fromISO(bu.end,   {zone: "utc" }).setZone(settings.timezone).toISO() ?? bu.end;

        const startISO = b.start.includes("T") ? b.start : b.start.replace(" ", "T");
        const endISO   = b.end.includes("T")   ? b.end   : b.end.replace(" ", "T");

        return {
          ...b,
          title: "",
          start: startISO,
          end: endISO,
          date: startISO.slice(0, 10),
          color: "#B0B0B0",
          isBusy: true,
        };
      }),
    [busy, settings.timezone]
  );

  const allEvents: ExtendedEvent[] = useMemo(
    () => [...formattedEvents, ...formattedBusy],
    [formattedEvents, formattedBusy, settings.timezone]
  );

  // Pääasiallinen näkymä, joka sisältää kalenterin ja näkymävalinnan
  return (
    <ThemedView style={[styles.container, { backgroundColor: background, flex: 1 }]}>

      {/* Painikkeet: kuukausinäkymän avaaminen ja päivä/viikko-vaihto */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={toggleExpand} style={styles.smallButton}>
          <Text style={styles.buttonText}>
            {expanded ? t('calendar.hide-month') : t('calendar.show-month')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
          style={styles.smallButton}
        >
          <Text style={styles.buttonText}>
            {viewMode === 'day' ? t('calendar.show-week') : t('calendar.show-day')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kuukausinäkymä avautuu muiden näkymien päälle tummennettuna overlayna */}
      {expanded && (
        <>
          {/* Tumma tausta, sulkeutuu kun käyttäjä napauttaa ulkopuolelle */}
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

          {/* Kuukausikalenteri itsessään, näkyy tummennuksen päällä */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 100, // sijoitetaan nappien alapuolelle
              alignSelf: 'center',
              opacity: fadeAnim,
              zIndex: 20,
            }}
          >
            <CustomMonthView
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date); // päivitetään valittu päivä
                toggleExpand(); // suljetaan kalenteri valinnan jälkeen
              }}
              textColor={textColor}
              background={background}
              events={allEvents}
            />
          </Animated.View>
        </>
      )}

      {/* Näyttää joko päivä- tai viikkonäkymän käyttäjän valinnan mukaan*/}
      <View style={{ flex: 1 }}>
        {viewMode === 'day' ? (
          <CustomDayView
            selectedDate={selectedDate}
            events={allEvents}
            textColor={textColor}
            background={background}
          />
        ) : (
          <CustomWeekView
            selectedDate={selectedDate}
            events={allEvents}
            textColor={textColor}
            background={background}
          />
        )}
      </View>

    {/* // UUsi today nappi koska vanha uhrattiin koodin toimimista varten
    {/* Today-nappi näkyviin vain jos ei olla tämän päivän kohdalla 
    {selectedDate !== getDate() && (
      <TouchableOpacity
        onPress={() => setSelectedDate(getDate())}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: '#007AFF',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 30,
          zIndex: 50,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 4,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Today</Text>
      </TouchableOpacity>
    )}
    */}
    </ThemedView>
  );
}



// Päivänäkymä näyttää yhden päivän aikajanan, tapahtumat ja nykyisen kellonajan viivan
function CustomDayView({
  selectedDate,
  events,
  textColor,
  background,
}: {
  selectedDate: string;
  events: ExtendedEvent[];
  textColor: string;
  background: string;
}) {
  // Päivän kaikki tunnit 0–24 (käytetään aikajanan rakentamiseen)
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const { settings } = useSettings();

  // Nykyinen päivämäärä vertailua varten
  const todayString = new Date().toISOString().split('T')[0];

  // Tallennetaan tämänhetkinen kellonaika minuutteina (käytetään punaisen viivan sijaintiin)
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Päivitetään nykyinen kellonaika minuutin välein
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Muodostaa näkyvän otsikon muodossa, esimerkiksi "Ma 06"
  const getDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
    // Lasketaan viikonpäivä niin, että maanantai on ensimmäinen
    const dayName = dayNames[(date.getDay() + 6) % 7];
    const dayNum = String(date.getDate()).padStart(2, '0');
    return `${dayName} ${dayNum}`;
  };

  // Suodatetaan vain valitun päivän tapahtumat
  const dayEvents = useMemo(() => {
    const day = selectedDate.split('T')[0];
    return events.filter((e) => e.start.split('T')[0] === day);
  }, [events, selectedDate]);

  // Laskee tapahtuman sijainnin aikajanalla (top ja height)
  const getEventStyle = (start: string, end: string) => {
    /** Tehdään laskut oikeassa aikavyöhykkeessä. */
    const startDate = DateTime.fromISO(start).setZone(settings.timezone);
    const endDate = DateTime.fromISO(end).setZone(settings.timezone);

    const startHour = startDate.hour + startDate.minute / 60;
    const endHour = endDate.hour + endDate.minute / 60;
    const top = startHour * HOUR_HEIGHT;
    const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 20);
    return { top, height };
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<TimelineEventProps | null>(null);

  const openEventModal = (event: TimelineEventProps) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Sulkee modalin ja tyhjentää valinnan
  const closeEventModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  // Nykyhetken viivan sijainti (minuuttien mukaan)
  const currentTop = currentMinutes * MINUTE_HEIGHT;
  const isToday = selectedDate === todayString;

  // 🔍 Debug: paljonko eventtejä päivälle
  console.log('DAY EVENTS LENGTH =', dayEvents.length);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: background }}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      {/* Päivän otsikko */}
      <View style={styles.weekHeader}>
        <Text
          style={[
            styles.weekHeaderText,
            { color: isToday ? '#00adf5' : textColor, fontWeight: 'bold' },
          ]}
        >
          {getDayLabel(selectedDate)}
        </Text>
      </View>

      {/* Aikajana ja tapahtumat yhdessä kiinteän korkuisessa näkymässä */}
      <View style={{ height: 24 * HOUR_HEIGHT }}>
        {/* tuntiviivat */}
        {HOURS.map((h) => (
          <View key={h} style={localStyles.hourRow}>
            <Text style={localStyles.hourLabel}>{h}:00</Text>
            <View style={localStyles.hourLine} />
          </View>
        ))}

        {/* tapahtumat */}
        {(() => {
          const { eventMeta, totalColumns } = calculateEventColumns(dayEvents);

          const safeColumns = Math.max(totalColumns, 1);
          const columnWidth = (SCREEN_WIDTH - 60) / safeColumns; // 60 = aika-akselin leveys
          return dayEvents.map((event, idx) => {
            const pos = getEventStyle(event.start, event.end);
            const meta = eventMeta.get(event);
            const column = meta?.column ?? 0;
            const left = 45 + column * columnWidth;

            if (event.isBusy) {
              return (
                <View
                  key={`busy-${idx}-${event.id ?? ''}`}
                  style={[
                    localStyles.eventBox,
                    {
                      top: pos.top,
                      height: pos.height,
                      left,
                      width: columnWidth - 5,
                      backgroundColor: '#B0B0B0',
                    },
                  ]}
                />
              );
            }

            return (
              <TouchableOpacity
                key={`event-${idx}-${event.id ?? ''}`}
                onPress={() => openEventModal(event)}
                style={[
                  localStyles.eventBox,
                  {
                    top: pos.top,
                    height: pos.height,
                    left,
                    width: columnWidth - 5,
                    backgroundColor: event.color || '#00adf5',
                  },
                ]}
              >
                <Text numberOfLines={2} style={localStyles.eventText}>
                  {event.title}
                </Text>
              </TouchableOpacity>
            );
          });
        })()}

        {/* nykyhetken viiva */}
        {isToday && <View style={[localStyles.nowLine, { top: currentTop }]} />}
      </View>

      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={closeEventModal}
      />
    </ScrollView>
  );
}


// Viikkonäkymä näyttää seitsemän päivän aikajanan rinnakkain
function CustomWeekView({
  selectedDate,
  events,
  textColor,
  background,
}: {
  selectedDate: string;
  events: ExtendedEvent[];
  textColor: string;
  background: string;
}) {
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
  const todayString = new Date().toISOString().split('T')[0];
  const { settings, setSettings } = useSettings() // Asetukset

  // ScrollView-viittaukset jokaiselle päivälle (käytetään synkronointiin)
  const scrollRefs = useRef<ScrollView[]>([]);
  const isSyncingScroll = useRef(false); // estää ääretöntä scroll-silmukkaa

  // Nykyhetken kellonaika minuutteina punaisen viivan sijaintiin
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Päivitetään viivan sijainti minuutin välein
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Ryhmitellään tapahtumat päivämäärän mukaan
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, TimelineEventProps[]> = {};
    for (const e of events) {
      const date = e.start.split('T')[0];
      (grouped[date] ||= []).push(e);
    }
    return grouped;
  }, [events, settings.timezone]);

  // Laskee viikonpäivät annetun päivämäärän perusteella (maanantai–sunnuntai)
  const getWeekDates = (dateString: string) => {
    const date = new Date(dateString);
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // siirrytään viikon alkuun
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  };
  const weekDates = getWeekDates(selectedDate);

  // Synkronoi pystysuuntainen scrollaus kaikissa päivänäkymissä
  const onScrollSync = (e: NativeSyntheticEvent<any>, index: number) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    const y = e.nativeEvent.contentOffset.y;
    scrollRefs.current.forEach((ref, i) => {
      if (i !== index && ref) ref.scrollTo({ y, animated: false });
    });
    // Palautetaan tila pienen viiveen jälkeen
    setTimeout(() => (isSyncingScroll.current = false), 16);
  };

  // Laskee tapahtuman sijainnin aikajanalla
  const getEventStyle = (start: string, end: string) => {
    /** Tehdään laskut oikeassa aikavyöhykkeessä. */
    const startDate = DateTime.fromISO(start).setZone(settings.timezone);
    const endDate = DateTime.fromISO(end).setZone(settings.timezone);

    const startHour = startDate.hour + startDate.minute / 60;
    const endHour = endDate.hour + endDate.minute / 60;
    const top = startHour * HOUR_HEIGHT;
    const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 20);
    return { top, height };
  };

  // Modalin hallintaan tarvittavat tilat ja apufunktiot
  const [modalVisible, setModalVisible] = useState(false); // kontrolloi näkyvyyttä
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventProps | null>(null); // tallentaa valitun tapahtuman

  // Avaa modalin ja asettaa valitun tapahtuman
  const openEventModal = (event: TimelineEventProps) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Sulkee modalin ja tyhjentää valinnan
  const closeEventModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const currentTop = currentMinutes * MINUTE_HEIGHT;

  // Rakentaa viikonäkymän (yksi sarake per päivä)
  return (
    <ScrollView horizontal style={{ backgroundColor: background }}>
      {weekDates.map((date, i) => {
        const isToday = date === todayString;
        const isSelected = date === selectedDate;

        return (
          <View
            key={date}
            style={{
              width: Math.max(SCREEN_WIDTH / 7, 110), // minimi leveys, jotta pysyy luettavana
              borderRightWidth: i < 6 ? 1 : 0,
              borderColor: '#ddd',
            }}
          >
            {/* Päiväotsikko (esim. Ti 12) */}
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

            {/* Päivän aikajana ja tapahtumat */}
            <ScrollView
              ref={(ref) => {
                if (ref) scrollRefs.current[i] = ref;
              }}
              onScroll={(e) => onScrollSync(e, i)}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{ height: 24 * HOUR_HEIGHT }}
            >
              {/* Tuntiviivat 0–24h */}
              {Array.from({ length: 24 }, (_, h) => (
                <View key={h} style={localStyles.hourRow}>
                  <Text style={localStyles.hourLabel}>{h}:00</Text>
                  <View style={localStyles.hourLine} />
                </View>
              ))}

              {/* Päivän tapahtumat aikajanalla */}
              {(() => {
                const dayEvents = eventsByDate[date] || [];
                const { eventMeta, totalColumns } = calculateEventColumns(dayEvents);

                return dayEvents.map((event, idx) => {
                  const pos = getEventStyle(event.start, event.end);
                  const meta = eventMeta.get(event);
                  const column = meta?.column ?? 0;

                  const availableWidth = (Math.max(SCREEN_WIDTH / 7, 110) - 50);
                  const columnWidth = availableWidth / totalColumns;
                  const left = 45 + column * columnWidth;

                  if (event.isBusy) {
                    return (
                      <View
                        key={idx}
                        style={{
                          ...localStyles.eventBox,
                          top: pos.top,
                          height: pos.height,
                          left,
                          width: columnWidth - 5,
                          backgroundColor: "#B0B0B0",
                        }}
                      />
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => openEventModal(event)}
                      style={{
                        ...localStyles.eventBox,
                        top: pos.top,
                        height: pos.height,
                        left,
                        width: columnWidth - 5,
                        backgroundColor: event.color || '#00adf5',
                      }}
                    >
                      <Text numberOfLines={2} style={localStyles.eventText}>
                        {event.title}
                      </Text>
                    </TouchableOpacity>
                  );
                });
              })()}

              {/* Punainen viiva näyttää nykyhetken vain tämän päivän kohdalla */}
              {isToday && <View style={[localStyles.nowLine, { top: currentTop }]} />}
            </ScrollView>
            {/* Näyttää modalin, jos tapahtuma on valittu */}
            <EventModal visible={modalVisible} event={selectedEvent} onClose={closeEventModal} />
          </View>
        );
      })}
    </ScrollView>
  );
}


// Kuukausinäkymä näyttää yhden kuukauden päivät ruudukossa (maanantaista alkava viikko)
function CustomMonthView({
  selectedDate,
  onDateSelect,
  textColor,
  background,
  events = [],
}: {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  textColor: string;
  background: string;
  events?: TimelineEventProps[];
}) {
  // Nykyinen päivä merkitsemistä varten
  const today = new Date();
  const todayStr = today.toLocaleDateString("sv-SE");

  // Hallitaan erikseen näkyvää kuukautta (mahdollistaa nuolinäppäimillä siirtymisen)
  const [visibleMonth, setVisibleMonth] = useState(new Date(selectedDate));

  // Haetaan valitun kuukauden tiedot näkyvän kuukauden perusteella
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  // Lasketaan kuukauden ensimmäinen ja viimeinen päivä
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Kuukausi alkaa maanantaista (muutetaan JS:n 0=sunnuntai → 0=maanantai)
  const startDay = (firstDay.getDay() + 6) % 7;

  // Tarvittavien solujen määrä (täydet viikot, myös osittaiset)
  const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7;

  // Rakennetaan lista jokaisesta kalenterisolusta
  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - startDay + 1;
    const dayDate = new Date(year, month, dayOffset);
    days.push({
      date: dayDate,
      isCurrentMonth: dayDate.getMonth() === month, // harmaa edellinen/seuraava kuukausi
    });
  }

  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  // Ryhmitellään tapahtumat päivämäärän mukaan, jotta voidaan merkitä aktiiviset päivät
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, ExtendedEvent[]> = {};

    // Suodata busy-slotit pois
    const realEvents = events.filter(e => !e.isBusy);

    for (const e of realEvents) {
      const date = e.start.split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    }

    return grouped;
  }, [events]);

  // Siirtyminen edelliseen tai seuraavaan kuukauteen
  const changeMonth = (offset: number) => {
    setVisibleMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + offset);
      return newMonth;
    });
  };

  return (
    <View style={[monthStyles.container, { backgroundColor: background }]}>
      {/* Kuukauden otsikko (esim. "marraskuu 2025") */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        {/* Nappi: siirtyy edelliseen kuukauteen */}
        <TouchableOpacity onPress={() => changeMonth(-1)} style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: textColor, fontSize: 16 }}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={[monthStyles.monthTitle, { color: textColor, flexShrink: 1 }]}>
          {visibleMonth.toLocaleString('fi-FI', { month: 'long', year: 'numeric' })}
        </Text>

        {/* Nappi: siirtyy seuraavaan kuukauteen */}
        <TouchableOpacity onPress={() => changeMonth(1)} style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: textColor, fontSize: 16 }}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Päivien nimet viikon yläosassa */}
      <View style={monthStyles.weekHeader}>
        {dayNames.map((d, i) => (
          <Text key={i} style={[monthStyles.weekDay, { color: textColor }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* Päiväruudukko */}
      <View style={monthStyles.grid}>
        {days.map((d, i) => {
          const dateStr = d.date.toLocaleDateString("sv-SE");
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasEvents = !!eventsByDate[dateStr];

          return (
            <TouchableOpacity
              key={i}
              style={[
                monthStyles.dayCell,
                {
                  backgroundColor: isSelected ? '#00adf5' : 'transparent',
                  opacity: d.isCurrentMonth ? 1 : 0.4, // haalentaa toisen kuukauden päivät
                },
              ]}
              onPress={() => {
                onDateSelect(dateStr);
                setVisibleMonth(new Date(dateStr)); // päivittää näkyvän kuukauden jos klikataan toisen kuun päivä
              }}
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
              {/* Pieni väripiste, jos päivällä on tapahtumia */}
              {hasEvents && (
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: isSelected ? '#fff' : '#00adf5',
                    marginTop: 2,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}


// Modaalikomponentti tapahtuman tietojen näyttöön.
function EventModal({
  visible,
  event,
  onClose,
}: {
  visible: boolean;
  event: TimelineEventProps | null;
  onClose: () => void;
}) {
  const { settings } = useSettings();
  const { t, i18n } = useTranslation();
  
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: 280,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              textAlign: 'center',
            }}
          >
            {event?.title}
          </Text>
          {event?.summary && (
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
              {event.summary}
            </Text>
          )}
          {event && (
            <View>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' }}>
              {t('event-info.begins')}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
              {DateTime.fromISO(event.start, { zone: settings.timezone}).toLocaleString(DateTime.DATETIME_FULL, { locale: settings.language })}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' }}>
              {t('event-info.ends')}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
              {DateTime.fromISO(event.end, { zone: settings.timezone}).toLocaleString(DateTime.DATETIME_FULL, { locale: settings.language })}
            </Text>
            </View>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: 'teal',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={onClose}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Sulje</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// funktio joka laskee miten tapahtumat jaetaan sarakkeisiin
function calculateEventColumns(events) {
  // Lajittele tapahtumat alkamisajan mukaan
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const columns = [];
  const eventMeta = new Map();

  sorted.forEach(event => {
    const start = new Date(event.start).getTime();
    const end   = new Date(event.end).getTime();

    // Etsitään sarake johon tämä mahtuu
    let assignedColumn = 0;
    while (true) {
      const colEvents = columns[assignedColumn] || [];
      const overlaps = colEvents.some(ev => {
        const evStart = new Date(ev.start).getTime();
        const evEnd = new Date(ev.end).getTime();
        return !(end <= evStart || start >= evEnd);
      });

      if (!overlaps) {
        if (!columns[assignedColumn]) columns[assignedColumn] = [];
        columns[assignedColumn].push(event);
        eventMeta.set(event, { column: assignedColumn });
        break;
      }
      assignedColumn++;
    }
  });

  // Laske sarakkeiden lukumäärä
  const totalColumns = columns.length;

  return { eventMeta, totalColumns };
}
