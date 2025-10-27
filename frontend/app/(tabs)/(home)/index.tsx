import { CalendarView, DayCalendarView, WeekCalendarView, MonthlyCalendarView, CombinedCalendarView } from '@/components/calendar';
import { ThemedView } from '@/components/themed-view';
import { getEvents } from '@/services/events';
import styles from '@/styles/homeStyle';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(data => setEvents(data));
  }, []);

  return (
    <ThemedView style={styles.stepContainer}>

      <CombinedCalendarView events={events} />

      {/* Voi itse vaihtaa näkymää */}
      {/* <CalendarView style={styles.calendarContainer} events={events} /> */}

      {/* Vain päivänäkymää */}
      {/* <DayCalendarView events={events} /> */}

      {/* Vain viikkonäkymää */}
      {/* <WeekCalendarView events={events} /> */}
    </ThemedView>
  );
}
