import EventList from "@/components/eventList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getOrganizationEvents } from "@/services/organisations";
import styles from '@/styles/eventViewStyle';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function OrganziationView() {
    const { id, name } = useLocalSearchParams();
    const [events, setEvents] = useState([])

    useEffect(() => {
        getOrganizationEvents(id).then(setEvents)
    }, [])

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={ styles.headerText }>{name}</ThemedText>
            <EventList events={events} />
        </ThemedView>
    )
}