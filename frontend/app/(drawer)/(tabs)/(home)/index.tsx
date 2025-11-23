import { CombinedCalendarView } from '@/components/calendar';
import { ThemedView } from '@/components/themed-view';
import { getEvents } from '@/services/events';
import styles from '@/styles/homeStyle';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import AddEvent from "@/components/addEvent"; // tapahtuman lisäystä varten


export default function HomeScreen() {
  const [events, setEvents] = useState([]);

  const [showAddEvent, setShowAddEvent] = useState(false); // tapahtuman lisäystä varten

  useEffect(() => {
    getEvents().then(data => setEvents(data));
  }, []);

  return (
    <ThemedView style={styles.stepContainer}>

      <TouchableOpacity onPress={() => setShowAddEvent(true)}
        style={{
          position: "fixed",
          right: 50,
          bottom: 50,
          backgroundColor: "#007AFF",
          paddingVertical: 10,    // <--
          paddingHorizontal: 15,  // <-- pitää olla eri arvot tkestikentän koon takia
          borderRadius: 800,
          margin: 10,
          zIndex: 1000,
        }}>
        <Text style={{color: "white"}}>+</Text>
      </TouchableOpacity>

      <CombinedCalendarView events={events} />

      <AddEvent
        visible={showAddEvent}
        onClose={() => setShowAddEvent(false)}
      />
      
    </ThemedView>
  );
}
