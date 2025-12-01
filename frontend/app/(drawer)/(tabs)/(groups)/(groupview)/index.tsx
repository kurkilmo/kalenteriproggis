import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getGroupById } from '@/services/groups';
import styles from "@/styles/groupStyle";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';

interface User {
    id: number,
    username: string,
    displayname: string
}

interface Group {
    id: number,
    owner_id: number,
    name: string,
    users: Array<User>
}

export default function GroupViewScreen() {
    const { id, name } = useLocalSearchParams();
    const [ group, setGroup ] = useState<Group>()

    useEffect(() => {
        getGroupById(
            typeof id === "string" ? id : id[0]
        ).then(setGroup)
    }, [id])

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>{name}</ThemedText>
            <ThemedText style={{ marginBottom: 20 }}>Jäsenet:</ThemedText>
            {group?.users.map((user) => {
                let text = user.displayname
                if (group.owner_id === user.id) text += " (Omistaja)"
                return <ThemedText key={user.id}>{text}</ThemedText>
            })}
        </ThemedView>
    );
}
