import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { User, getUsers, getUser } from '@/services/users';
import { Group, getGroups } from '@/services/groups';

const DATA = [ 
    { "id": 1, "name": "kallet", "members": [1, 5, 7] },
    { "id": 2, "name": "pekat", "members": [2, 3] } 
];

type GroupProps = {group_name: string, members: number[]};
type UserProps = {user_id: number};

const UserItem = ({user_id}: UserProps) => {
    const [user, setUser] = useState<User>({"id":-1, username: "unknown"})

    useEffect( () => {
        getUser(user_id).then( result => {
            console.log("tulos:", result)
            setUser(result)
        })
    }, [])
    return <Text style={styles.jasenet}>{user.username}</Text>
}

const GroupItem = ({group_name, members}: GroupProps) => {
  return <View>
    <Text style={styles.ryhma}>{group_name}</Text>
    <FlatList
        data={members}
        renderItem={ ({item}) => <UserItem user_id={item}/>}
    />
  </View>
};

export default function OrganizaationsScreen() {
  //console.log(getGroups)
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  useEffect( () => {
    getUsers().then((result) => {
        setUsers(result)
        console.log("USERS:", users)
    }).catch(error => {
        console.error("Failed to fetch users:", error)
    })
    getGroups().then((result) => {
        setGroups(result)
        console.log("groups:", groups)
    }).catch(error => {
        console.error("Failed to fetch users:", error)
    })
  }, [])

  return (
    <ThemedView>
        <ThemedView style={styles.titleContainer}>
            <ThemedText>Testaamista varten</ThemedText>
            { users.map(u => <ThemedText key={u.id}>{u.username}</ThemedText> ) }
        </ThemedView>
        <ThemedView>
            <FlatList
                data={groups}
                renderItem={ ({item}) => <GroupItem group_name={item.name} members={item.members} />}
            />
        </ThemedView>
    </ThemedView>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  ryhma: {
    color: "green",
  },
  jasenet: {
    color: "lightblue",
    paddingLeft: 20,
  },
});
