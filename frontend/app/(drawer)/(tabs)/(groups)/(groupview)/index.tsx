import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { deleteGroup, getGroupById, leaveGroup } from '@/services/groups';
import { getMe } from '@/services/users';
import styles from "@/styles/groupStyle";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Text, TouchableOpacity } from 'react-native';

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

const confirm = (title: string, onAccept: ()=>void, onCancel: ()=>void) => {
    if (Platform.OS === "web") {
        window.confirm(title) ? onAccept() : onCancel();
        return
    }

    Alert.alert(title, '', [
        {
            text: 'Cancel',
            onPress: onCancel,
            style: 'cancel',
        },
        { text: 'OK', onPress: onAccept }
    ])
}

export default function GroupViewScreen() {
    const { id, name } = useLocalSearchParams();
    const [ group, setGroup ] = useState<Group>();
    const [ user, setUser ] = useState<User>();
    const { t, i18n } = useTranslation();

    
    useEffect(() => {
        if (!id) return;
        getGroupById(
            typeof id === "string" ? id : id[0]
        ).then(setGroup)
        getMe().then(setUser)
    }, [id])

    const DeleteButton = () => {
        const router = useRouter();
        if (!user?.id || !group?.id) return null;
        const isOwner = user?.id === group?.owner_id
        const leaveFunction = isOwner ? deleteGroup : leaveGroup
        const onPress = () => {
            const confirmText = t(isOwner ? 'groups.confirm-delete' : 'groups.confirm-leave')
            confirm(
                confirmText,
                async () => {   // Callback hyväksyessä
                    await leaveFunction(group.id);
                    router.dismiss();
                },
                ()=>{}  // Callback peruuttaessa, ei tehä mittään
            )
        }
        const buttonText = t(isOwner ? 'groups.delete' : 'groups.leave-group');
    
        const buttonColor = isOwner ? "red" : styles.modalButton.backgroundColor;

        return (
            <TouchableOpacity style={{
                    ...styles.modalButton,
                    width: "50%",
                    backgroundColor: buttonColor
                }}
                onPress={onPress}
            >
                <Text style={styles.modalButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>{name}</ThemedText>
            <DeleteButton />
            <ThemedText style={{ marginBottom: 20 }}>Jäsenet:</ThemedText>
            {group?.users.map((user) => {
                let text = user.displayname
                if (group.owner_id === user.id) text += " (Omistaja)"
                return <ThemedText key={user.id}>{text}</ThemedText>
            })}
        </ThemedView>
    );
}
