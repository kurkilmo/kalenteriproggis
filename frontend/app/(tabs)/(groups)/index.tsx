import React, { useState, useRef } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from 'react-native-elements';

export default function GroupsScreen(){
    const initGroups = [
        { id: '1', title: 'Kallet' },
        { id: '2', title: 'Pekat' },
        { id: '3', title: 'Villet' },
        { id: '4', title: 'Kalja porukka' },
        { id: '5', title: 'Nörtit' },
        { id: '6', title: 'Täysin tavallinen ryhmä' },
        { id: '7', title: 'Eläke Bingo' },
        { id: '8', title: 'Villit Miehet' },
        { id: '9', title: 'Sotarikollisuuksia' },
        { id: '10', title: 'Ei ainakaan sotarikkolisuuksia' },
      ];


      const [groups, setGroups] = useState(initGroups);
      const [searchValue, setSearchValue] = useState('');

      const allGroups = useRef(initGroups);

      const searchFunction = (text) => {
        const upperText = text.toUpperCase();

        const filteredGroups = allGroups.current.filter((item) =>
          item.title.toUpperCase().includes(upperText)
        );
    
        setGroups(filteredGroups);
        setSearchValue(text);
      };


  const Item = ({ title, href }) => (
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
        title={item.title}
        href={{
            pathname: '/details',
            params: {type: 'group', id: item.id, name: item.title},
        }}
        />
        )} 
      keyExtractor={(item) => item.id}
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