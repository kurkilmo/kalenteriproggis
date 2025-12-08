  import { CombinedCalendarView } from '@/components/calendar';
import { ThemedView } from '@/components/themed-view';
import { createUserEvent, getEvents } from '@/services/events';
import { getGroupEvents, getGroups } from '@/services/groups';
import styles from '@/styles/homeStyle';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import AddEvent from "@/components/addEvent"; // tapahtuman lisäystä varten
import { useFocusEffect } from 'expo-router';


  export default function HomeScreen() {
    const [events, setEvents] = useState<any>([]);
    const [showAddEvent, setShowAddEvent] = useState(false); // tapahtuman lisäystä varten

    async function loadAllEvents() {

      // Käyttäjän omat tapahtumat
      const myEvents = await getEvents();

      // Kaikki ryhmät, joissa käyttäjä on jäsen
      const groups = await getGroups();

      // Väliaikainen korjaus
      if (!Array.isArray(groups)) {
        console.warn("getGroups returned non-array:", groups);
        return; // tai aseta groups = []
      }

      // Tapahtumat jokaisesta ryhmästä
      const groupEventsArrays = await Promise.all(
        groups.map((g: any) => getGroupEvents(g.id))
      );

      // Yhdistä taulukot
      const allGroupEvents = groupEventsArrays.flat();

      // Yhdistä käyttäjän omat + ryhmien tapahtumat
      setEvents([...myEvents, ...allGroupEvents]);
    }

    useFocusEffect(useCallback(() => loadAllEvents(), []));

    const createEvent = (newEvent) => {
      createUserEvent(newEvent).then(loadAllEvents)
    }

    return (
      <ThemedView style={[styles.stepContainer, {flex: 1}]}>

        <TouchableOpacity onPress={() => setShowAddEvent(true)}
          style={{
            position: "absolute",
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

        <CombinedCalendarView events={events} refreshEvents={loadAllEvents}/>

        <AddEvent
          visible={showAddEvent}
          onClose={() => setShowAddEvent(false)}
          createEvent={createEvent}
        />
        
      </ThemedView>
    );
  }
