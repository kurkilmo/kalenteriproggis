import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from 'react-native-elements';

import { groups as testGroups} from '@/servicesTest/groups';

export default function GroupsScreen(){

  // tilat ryhmille
  const [groups, setGroups] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // refit alkuperäisille tiedoille
  const allGroups = useRef<any[]>([]);

  // alustetaan tiedot komponentin latautuessa
  useEffect(() => {
    setGroups(testGroups);

    // tallennetaan koko data refeihin
    allGroups.current = testGroups;
  }, []);

  // hakutoiminto
  const searchFunction = (text: string) => {
    const upperText = text.toUpperCase();

    // suodatetaan ryhmät
    const filteredGroups = allGroups.current.filter((item) =>
      item.name.toUpperCase().includes(upperText)
    );
    
    // päivitetään tilat
    setGroups(filteredGroups);
    setSearchValue(text);
  };

  // Item komponentti listan riveille
  const Item = ({ title, href }: { title: string; href: any }) => (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return(
    <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Ryhmät</ThemedText>

        <SearchBar
        placeholder="Hae ryhmiä..."
        value={searchValue}
        onChangeText={searchFunction}
        autoCorrect={false}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        searchIcon={{ size: 22, color: 'black' }}
        clearIcon={{ size: 22, color: 'black' }}
      />

    <ThemedView style={styles.listsContainer}>
     {/* Omat ryhmät */}    
      <View style={styles.listBox}>
      <ThemedText style={styles.listTitle}>Omat ryhmät</ThemedText>
      <FlatList
          data={groups}
          renderItem={({item}) => (
            <Item
              title={item.name}
              href={{
                  pathname: '/eventView',
                  params: {type: 'group', id: item.id, name: item.name},
                  }}
                />
              )} 
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  listsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: 10,
  },
  listBox: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    padding: 8,
  },
  listTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
    item: {
    backgroundColor: 'pink',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
});