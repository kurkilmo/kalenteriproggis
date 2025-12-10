import AddEvent from '@/components/addEvent';
import { CombinedCalendarView } from '@/components/calendar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createGroupEvent } from '@/services/events';
import { getGroupEvents, getGroupExternalBusy } from '@/services/groups';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

interface Group {
    id: number,
    owner_id: number,
    name: string
}

export default function GroupViewScreen() {
    const { id, name } = useLocalSearchParams();
    const [ events, setEvents ] = useState([])
    const [ busyTimes, setBusyTimes ] = useState([])

    const [showAddEvent, setShowAddEvent] = useState(false)

    const populateEvents = () => {
        if (!id) return
        getGroupEvents(
            typeof id === "string" ? id : id[0]
        ).then(setEvents)
        getGroupExternalBusy(
            typeof id === "string" ? id : id[0]
        ).then(setBusyTimes);
    }

    useEffect(populateEvents, [id])
    
    const createEvent = (newEvent) => {
        if (!id) return;
        createGroupEvent(id, newEvent).then(populateEvents)
    }

    return (
        <ThemedView style={{flex: 1}}>
            <TouchableOpacity onPress={() => setShowAddEvent(true)}
                style={{
                    position: "fixed",
                    right: 50,
                    bottom: 50,
                    backgroundColor: "#007AFF",
                    paddingVertical: 10,    // <--
                    paddingHorizontal: 15,  // <-- pitää olla eri arvot tkestikentän koon takia
                    paddingTop: 1,
                    borderRadius: 800,
                    margin: 10,
                    zIndex: 1000,
                }}>
                <ThemedText style={{ color: "white" }}>+</ThemedText>
            </TouchableOpacity>
            <CombinedCalendarView events={events} busy={busyTimes} refreshEvents={async () => {await populateEvents()}} />

            <AddEvent
                visible={showAddEvent}
                onClose={() => setShowAddEvent(false)}
                createEvent={createEvent}
            />
        </ThemedView>
    );
}
