import { CombinedCalendarView, GroupWeekCalendar } from '@/components/calendar';
import { ThemedView } from '@/components/themed-view';
import { getGroupEvents, getGroupExternalBusy } from '@/services/groups';
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
    const [ busyTimes, setBusyTimes ] = useState([])

    useEffect(() => {
        if (!id) return
        getGroupEvents(
            typeof id === "string" ? id : id[0]
        ).then(setEvents)
        getGroupExternalBusy(
            typeof id === "string" ? id : id[0]
        ).then(setBusyTimes);
    }, [id])
    console.log(busyTimes)
    return (
        <ThemedView>
            <GroupWeekCalendar events={events} busy={busyTimes} />
        </ThemedView>
    );
}
