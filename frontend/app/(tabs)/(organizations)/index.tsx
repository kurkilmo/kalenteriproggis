import React, { useState, useRef } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from 'react-native-elements';

export default function OrganizationsScreen() {

  const initOrganizations = [
    { id: '1', title: 'Google' },
    { id: '2', title: 'Micorsoft' },
    { id: '3', title: 'Aple' },
    { id: '4', title: 'Amazon' },
    { id: '5', title: 'NASA' },
    { id: '6', title: 'World Health Organization' },
    { id: '7', title: 'UNICEF' },
    { id: '8', title: 'Red Cross' },
    { id: '9', title: 'Greenplace' },
    { id: '10', title: 'Tesla' },
  ];


  const [organizations, setOrganizations] = useState(initOrganizations);
  const [searchValue, setSearchValue] = useState('');

  const allOrganizations = useRef(initOrganizations);


  const searchFunction = (text) => {
    const upperText = text.toUpperCase();

    const filteredOrganizations = allOrganizations.current.filter((item) =>
      item.title.toUpperCase().includes(upperText)
    );

    setOrganizations(filteredOrganizations);
    setSearchValue(text);
  };


  const Item = ({ title, href }) => (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Organisaatiot</ThemedText>

      <SearchBar
        placeholder="Hae organisaatioita..."
        value={searchValue}
        onChangeText={searchFunction}
        autoCorrect={false}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        searchIcon={{ size: 22, color: 'black' }}
        clearIcon={{ size: 22, color: 'black' }}
      />

      <View style={styles.listsContainer}>
        {/* Organisaatiot */}
        <View style={styles.listBox}>
          <ThemedText style={styles.listTitle}>Organisaatiot</ThemedText>
          <FlatList
            data={organizations}
            renderItem={({ item }) => (
              <Item
                title={item.title}
                href={{
                  pathname: '/details',
                  params: { type: 'organization', id: item.id, name: item.title },
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
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
    backgroundColor: 'teal',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
});