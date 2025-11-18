import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from "expo-router";

interface Group {
    id: number,
    owner_id: number,
    name: string
}

export default function GroupViewScreen() {
    const { id, name } = useLocalSearchParams();
    return (
        <ThemedView>
            <ThemedText>Tänne lista: {name} {id}</ThemedText>
        </ThemedView>
    );
}
