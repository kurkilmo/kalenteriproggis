import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addUserToGroup, deleteGroup, getGroupById, leaveGroup } from '@/services/groups';
import { getMe, getUsers } from '@/services/users';
import styles from "@/styles/groupStyle";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, Platform, Text, TouchableOpacity } from 'react-native';

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

    const fetchGroup = () => {
        getGroupById(
            typeof id === "string" ? id : id[0]
        ).then(setGroup)
    }
    useEffect(() => {
        if (!id) return;
        fetchGroup();
        getMe().then(setUser)
    }, [id])
    
    const isOwner = (user?.id && group?.id) && user?.id === group?.owner_id;

    const DeleteButton = () => {
        const router = useRouter();
        if (!user?.id || !group?.id) return null;
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
                    backgroundColor: buttonColor,
                    position: "absolute",
                    start: "25%",
                    bottom: 20
                }}
                onPress={onPress}
            >
                <Text style={styles.modalButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        )
    }

    const AddUserButton = () => {
        if (!isOwner) return null;

        const [modalVisible, setModalVisible] = useState(false)
        const [allUsers, setAllUsers] = useState<User[]>([])
        const [ selectedUserId, setSelectedUserId ] = useState<number>()

        useEffect(() => {
            getUsers().then(users => {
                setAllUsers(users.filter(u => 
                    !group.users.map(u => u.id).includes(u.id)
                ))
                if (allUsers[0]) setSelectedUserId(allUsers[0].id)
            })
        }, [modalVisible])

        const closeModal = () => setModalVisible(false)
        const onPress = () => {setModalVisible(true)}

        const addUser = () => {
            if (!selectedUserId) return
            addUserToGroup(group.id, selectedUserId).then(() => {
                fetchGroup();
                setModalVisible(false)
            })
        }

        return (
            <TouchableOpacity style={{
                ...styles.modalButton,
                width: 200,
                backgroundColor: "#2ba141",
                marginTop: 20
            }}
                onPress={onPress}
            >
                <Text style={styles.modalButtonText}>{t('groups.add-user')}</Text>
                <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
                    <ThemedView style={styles.modalBackground}>
                        <ThemedView style={{...styles.modalContent, width: "80%"}}>
                            <Picker
                                selectedValue={selectedUserId}
                                
                                onValueChange={setSelectedUserId}
                            >
                                {
                                    allUsers.map((user) => (
                                        <Picker.Item label={user.displayname || user.username} value={user.id} />
                                    ))
                                }
                            </Picker>
                            <ThemedView style={{flexDirection: "row"}}>
                                <TouchableOpacity style={styles.modalButton} onPress={addUser}>
                                    <Text style={styles.modalButtonText}>{'Lisää'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                                    <Text style={styles.modalButtonText}>{'eiku'}</Text>
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </Modal>
            </TouchableOpacity>
        )
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>{name}</ThemedText>
            <ThemedText style={{ marginBottom: 20 }}>Jäsenet:</ThemedText>
            {group?.users.map((user) => {
                let text = user.displayname || user.username;
                if (group.owner_id === user.id) text += " (Omistaja)"
                return <ThemedText key={user.id}>{text}</ThemedText>
            })}
            <AddUserButton />
            <DeleteButton />
        </ThemedView>
    );
}
