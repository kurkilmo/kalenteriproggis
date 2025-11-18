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
    //const [ group, setGroup ] = useState<Group>()
//
    //useEffect(() => {
    //    getGroupById(
    //        typeof id === "string" ? id : id[0]
    //    ).then(setGroup)
    //}, [])

    return (
        <ThemedView>
            <ThemedText>{name}</ThemedText>
        </ThemedView>
    );
}
