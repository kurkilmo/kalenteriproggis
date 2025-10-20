import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from 'react-native-elements';

import { organizations as testOrganizations } from '@/servicesTest/organizations';
import { groups as testGroups } from '@/servicesTest/groups';

export default function OrganizationsScreen() {

//  const initOrganizations = [
//    { id: '1', title: 'Google' },
//    { id: '2', title: 'Micorsoft' },
//    { id: '3', title: 'Aple' },
//    { id: '4', title: 'Amazon' },
//    { id: '5', title: 'NASA' },
//    { id: '6', title: 'World Health Organization' },
//    { id: '7', title: 'UNICEF' },
//    { id: '8', title: 'Red Cross' },
//    { id: '9', title: 'Greenplace' },
//    { id: '10', title: 'Tesla' },
//  ];
//
//  const initGroups = [
//    { id: '1', title: 'Kallet' },
//    { id: '2', title: 'Pekat' },
//    { id: '3', title: 'Villet' },
//    { id: '4', title: 'Kalja porukka' },
//    { id: '5', title: 'Nörtit' },
//    { id: '6', title: 'Täysin tavallinen ryhmä' },
//    { id: '7', title: 'Eläke Bingo' },
//    { id: '8', title: 'Villit Miehet' },
//    { id: '9', title: 'Sotarikollisuuksia' },
//    { id: '10', title: 'Ei ainakaan sotarikkolisuuksia' },
//  ];

  // Tilat organisaatioille ja ryhmille
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Refit alkuperäisille tiedoille
  const allOrganizations = useRef<any[]>([]);
  const allGroups = useRef<any[]>([]);

  // Alustetaan tiedot komponentin latautuessa
  useEffect(() => {
    setOrganizations(testOrganizations);
    setGroups(testGroups);

    // Tallennetaan koko data refeihin
    allOrganizations.current = testOrganizations;
    allGroups.current = testGroups;
  })

  // Hakutoiminto
  const searchFunction = (text: string) => {
    const upperText = text.toUpperCase();

    // Suodatetaan organisaatiot ja ryhmät
    const filteredOrganizations = allOrganizations.current.filter((item) =>
      item.title.toUpperCase().includes(upperText)
    );

    const filteredGroups = allGroups.current.filter((item) =>
      item.title.toUpperCase().includes(upperText)
    );

    // Päivitetään tilat
    setOrganizations(filteredOrganizations);
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Organisaatiot ja omat ryhmät</ThemedText>

      <SearchBar
        placeholder="Hae organisaatioita ja ryhmiä..."
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
                title={item.name}
                href={{
                  pathname: '/details',
                  params: { type: 'organization', id: item.id, name: item.name },
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Omat ryhmät */}
        <View style={styles.listBox}>
          <ThemedText style={styles.listTitle}>Omat ryhmät</ThemedText>
          <FlatList
            data={groups}
            renderItem={({ item }) => (
              <Item
                title={item.name}
                href={{
                  pathname: '/details',
                  params: { type: 'group', id: item.id, name: item.name },
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
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