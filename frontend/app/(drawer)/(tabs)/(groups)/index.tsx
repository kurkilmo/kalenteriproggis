import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/styles/groupStyle';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { getGroups } from '@/services/groups';

export default function GroupsScreen(){

  // tilat ryhmille
  const [groups, setGroups] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // refit alkuperäisille tiedoille
  const allGroups = useRef<any[]>([]);

  // alustetaan tiedot komponentin latautuessa
  useEffect(() => {
    getGroups().then(data => {
      allGroups.current = data
      setGroups(data)
    })
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
      <ThemedView style={[styles.buttons, {flex: 0, alignSelf: 'flex-start'}]}>
        <TouchableOpacity
          style={styles.buttonContainer}> 
          <Text style={styles.button}>Poistu ryhmästä</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}> 
          <Text style={styles.button}>Liity ryhmään</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}> 
          <Text style={styles.button}>Lisää ryhmä</Text>
        </TouchableOpacity>
      </ThemedView>
        
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