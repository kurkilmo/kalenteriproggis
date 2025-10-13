import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CalendarView } from '@/components/calendar'
import { timelineEvents } from '@/services/events';

export default function HomeScreen() {
  
  return (
    <ThemedView style={styles.stepContainer}>
      <CalendarView
        style={styles.calendarContainer}
        events={timelineEvents}
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
