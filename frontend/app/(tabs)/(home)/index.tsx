import { CalendarView } from '@/components/calendar';
import { ThemedView } from '@/components/themed-view';
import { getEvents } from '@/services/events';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    getEvents().then(data => setEvents(data))
  }, [])

  return (
    <ThemedView style={styles.stepContainer}>
      <CalendarView
        style={styles.calendarContainer}
        events={events}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  calendarContainer: {
    minHeight: 1000,
    padding: 10,
  }
});
