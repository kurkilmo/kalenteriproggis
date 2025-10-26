import { CalendarView } from '@/components/calendar';
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
      <CalendarView
        style={styles.calendarContainer}
        events={events}
      />
    </ThemedView>
  );
}
