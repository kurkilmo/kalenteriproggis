import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, TouchableWithoutFeedback, NativeSyntheticEvent, Modal } from 'react-native';
import { CalendarProvider, type TimelineEventProps } from 'react-native-calendars';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDate } from '@/utilities/utils';
import styles, { monthStyles, localStyles } from '@/styles/calendarStyle';
import { useTranslation } from 'react-i18next';

// Näytön mitat ja perusasetukset aikajanoille
const SCREEN_WIDTH = Dimensions.get('window').width;
const HOUR_HEIGHT = 30; // yhden tunnin korkeus pikseleinä // MUISTA MUUTTAA MYÖS TYYLEISSÄ!!!
const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // yhden minuutin korkeus


// Pääkomponentti, joka yhdistää kuukausi-, viikko- ja päivänäkymän
export function CombinedCalendarView({ events = [] }: { events?: TimelineEventProps[] }) {
  const { t, i18n } = useTranslation() // Lokalisaatio
  if (!Array.isArray(events)) events = []; // Jos tapahtumat eivät ole taulukko, alustetaan ne tyhjäksi

  // Teemavärit haetaan sovelluksen teemasta
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Komponentin tilat
  const [selectedDate, setSelectedDate] = useState(getDate()); // valittu päivä ISO-muodossa
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day'); // näkymätila
  const [expanded, setExpanded] = useState(false); // onko kuukausinäkymä näkyvissä
  const fadeAnim = useRef(new Animated.Value(0)).current; // animointiarvo overlaylle

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
  const formattedEvents = useMemo(
    () =>
      events.map((e) => {
        const startISO = e.start.includes("T") ? e.start : e.start.replace(" ", "T");
        const endISO   = e.end.includes("T")   ? e.end   : e.end.replace(" ", "T");

        return {
          ...e,
          start: startISO,
          end: endISO,
          date: e.start.slice(0, 10), // kriittinen korjaus
        };
      }),
    [events]
  );

  // Pääasiallinen näkymä, joka sisältää kalenterin ja näkymävalinnan
  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        showTodayButton
        disabledOpacity={0.6}
      >
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
                events={formattedEvents}
              />
            </Animated.View>
          </>
        )}

        {/* Näyttää joko päivä- tai viikkonäkymän käyttäjän valinnan mukaan */}
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


// Päivänäkymä näyttää yhden päivän aikajanan, tapahtumat ja nykyisen kellonajan viivan
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
  // Päivän kaikki tunnit 0–23 (käytetään aikajanan rakentamiseen)
  const HOURS = Array.from({ length: 24 }, (_, i) => i);

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
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    const top = startHour * HOUR_HEIGHT; // pystysijainti
    const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 20); // minimi korkeus
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

  // Nykyhetken viivan sijainti (minuuttien mukaan)
  const currentTop = currentMinutes * MINUTE_HEIGHT;
  const isToday = selectedDate === todayString;

  // Rakentaa yhden päivän aikajanan
  return (
    <ScrollView style={{ backgroundColor: background }}>
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

      {/* Aikajana 0–24h */}
      <ScrollView style={{ height: 24 * HOUR_HEIGHT }} showsVerticalScrollIndicator>
        {/* Tuntiviivat ja tunnit vasemmalla */}
        {HOURS.map((h) => (
          <View key={h} style={localStyles.hourRow}>
            <Text style={localStyles.hourLabel}>{h}:00</Text>
            <View style={localStyles.hourLine} />
          </View>
        ))}

        {/* Päivän tapahtumat sijoitettuna aikajanan kohdalle */}
        {dayEvents.map((event, idx) => {
          const pos = getEventStyle(event.start, event.end);
          return (
            // Kun käyttäjä painaa tapahtumaa, avataan modal sen tiedoilla
            <TouchableOpacity
              key={idx}
              onPress={() => openEventModal(event)}
              style={[
                localStyles.eventBox,
                {
                  top: pos.top,
                  height: pos.height,
                  left: 45 + (idx % 2) * 70, // vuorottelee tapahtumien vaakasijaintia
                  backgroundColor: event.color || '#00adf5',
                },
              ]}
            >
              <Text numberOfLines={2} style={localStyles.eventText}>
                {event.title}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Punainen viiva osoittaa nykyisen kellonajan, jos katsotaan tätä päivää */}
        {isToday && <View style={[localStyles.nowLine, { top: currentTop }]} />}
      </ScrollView>
      {/* Näyttää modalin, jos tapahtuma on valittu */}
      <EventModal visible={modalVisible} event={selectedEvent} onClose={closeEventModal} />
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
  events: TimelineEventProps[];
  textColor: string;
  background: string;
}) {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
  const todayString = new Date().toISOString().split('T')[0];

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
  }, [events]);

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
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
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
              {(eventsByDate[date] || []).map((event, idx) => {
                const pos = getEventStyle(event.start, event.end);
                return (
                  // Kun käyttäjä painaa tapahtumaa, avataan modal sen tiedoilla
                  <TouchableOpacity
                    key={idx}
                    onPress={() => openEventModal(event)}
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
                  </TouchableOpacity>
                );
              })}

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
    const grouped: Record<string, TimelineEventProps[]> = {};
    for (const e of events) {
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
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
              {new Date(event.start).toLocaleString('fi-FI')} –{' '}
              {new Date(event.end).toLocaleString('fi-FI')}
            </Text>
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

/*---*/

// Ryhmän viikkokalenteri: näyttää vapaus/varaus-tiedon anonyymisti
export function GroupWeekCalendar({
  events = [],  // ryhmän omat
  busy = []     // muiden ryhmien varatut slotit
}: {
  events?: any[];
  busy?: any[];
}) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const SCREEN_WIDTH = Dimensions.get("window").width;

  const dayNames = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];
  const todayStr = new Date().toISOString().split("T")[0];

  // Normalisoidaan päivämäärät
  const normalized = useMemo(() => {
    const mark = (e: any, isBusy: boolean) => {
      const startISO = e.start.includes("T") ? e.start : e.start.replace(" ", "T");
      const endISO   = e.end.includes("T") ? e.end : e.end.replace(" ", "T");
      return {
        ...e,
        startISO,
        endISO,
        date: e.start.slice(0, 10),
        isBusy
      };
    };

    return [
      ...events.map(ev => mark(ev, false)),   // ryhmän omat
      ...busy.map(ev => mark(ev, true)),      // muiden busy-slotit
    ];
  }, [events, busy]);

  // Ryhmitellään tapahtumat päivittäin
  const eventsByDate = useMemo(() => {
    const g: Record<string, any[]> = {};
    for (const e of normalized) {
      if (!g[e.date]) g[e.date] = [];
      g[e.date].push(e);
    }
    return g;
  }, [normalized]);

  // Viikon aloituspäivä (maanantai)
  const baseMonday = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    const offset = (now.getDay() + 6) % 7;
    monday.setDate(now.getDate() - offset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  // Näytetään 1 vuosi vikkoja eteenpäin (52 viikkoa)
  const weeks = Array.from({ length: 52 }, (_, i) => i);

  const getEventPos = (startISO: string, endISO: string) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const SH = start.getHours() + start.getMinutes() / 60;
    const EH = end.getHours() + end.getMinutes() / 60;

    return {
      top: SH * HOUR_HEIGHT,
      height: Math.max((EH - SH) * HOUR_HEIGHT, 20),
    };
  };

  const BUSY_COLOR = "#b0b0b0";    // Varattu alue väri

  const renderWeek = (weekOffset: number) => {
    const weekStart = new Date(baseMonday);
    weekStart.setDate(baseMonday.getDate() + weekOffset * 7);

    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dateStr = d.toLocaleDateString("sv-SE");
      return { date: d, dateStr };
    });

    return (
      <View key={weekOffset} style={{ width: SCREEN_WIDTH }}>
        <ScrollView style={{ height: 2400 * HOUR_HEIGHT }} showsVerticalScrollIndicator={false}>
        {/* Viikon päiväotsikot */}
        <View style={{ flexDirection: "row" }}>
          {days.map((d, i) => {
            const isToday = d.dateStr === todayStr;
            return (
              <View
                key={i}
                style={{
                  width: Math.max(SCREEN_WIDTH / 7, 110),
                  flex: 1,
                  borderRightWidth: i < 6 ? 1 : 0,
                  borderColor: "#ddd",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 5,
                    borderBottomWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <Text
                    style={{
                      color: isToday ? "#00adf5" : textColor,
                      fontWeight: isToday ? "bold" : "normal",
                    }}
                  >
                    {dayNames[i]} {d.date.getDate()}.{d.date.getMonth() + 1}
                  </Text>
                </View>

                {/* Tuntiviivat */}
                <View style={{ height: 24 * HOUR_HEIGHT }}>
                  {Array.from({ length: 24 }, (_, h) => (
                    <View key={h} style={localStyles.hourRow}>
                        <Text style={localStyles.hourLabel}>{h}:00</Text>
                        <View style={localStyles.hourLine} />
                    </View>
                  ))}

                  {/* Tapahtumat tässä */}
                  {(eventsByDate[d.dateStr] || []).map((ev, idx) => {
                    const pos = getEventPos(ev.startISO, ev.endISO);

                    if (!ev.isBusy) {
                      // Ryhmän omat tapahtumat
                      return (
                        <View
                          key={idx}
                          style={{
                            position: "absolute",
                            left: 45,
                            width: Math.max(SCREEN_WIDTH / 7, 110) - 50,
                            top: pos.top,
                            height: pos.height,
                            backgroundColor: ev.color || "#007AFF",
                            borderRadius: 6,
                            padding: 4,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ color: "white", fontSize: 11, fontWeight: "600" }}>
                            {ev.title}
                          </Text>
                        </View>
                      );
                    }

                    // Muista ryhmistä / tapahtumista tulleet "varatut" ajat
                    return (
                      <View
                        key={idx}
                        style={{
                          position: "absolute",
                          left: 45,
                          width: Math.max(SCREEN_WIDTH / 7, 110) - 50,
                          top: pos.top,
                          height: pos.height,
                          backgroundColor: "#B0B0B0",
                          borderRadius: 6,
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView
      horizontal
      pagingEnabled
      style={{ backgroundColor: background }}
    >
      {weeks.map(renderWeek)}
    </ScrollView>
  );
}
