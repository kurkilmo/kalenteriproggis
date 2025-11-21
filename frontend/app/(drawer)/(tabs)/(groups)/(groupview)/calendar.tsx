import { CombinedCalendarView } from '@/components/calendar';
import { ThemedView } from '@/components/themed-view';
import { getGroupEvents } from '@/services/groups';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';

interface Group {
    id: number,
    owner_id: number,
    name: string
}

export default function GroupViewScreen() {
    const { id, name } = useLocalSearchParams();
    const [ events, setEvents ] = useState([])

    useEffect(() => {
        if (!id) return
        getGroupEvents(
            typeof id === "string" ? id : id[0]
        ).then(setEvents)
    }, [id])
    return (
        <ThemedView>
            <CombinedCalendarView events={events} />
        </ThemedView>
    );
}
