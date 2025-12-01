import EventList from '@/components/eventList';
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
    const [events, setEvents] = useState([])

    useEffect(() => {
        getGroupEvents(id).then(setEvents)
    }, [id])

    return (
        <EventList events={events} />
    );
}
