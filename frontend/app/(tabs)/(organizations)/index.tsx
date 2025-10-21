import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from 'react-native-elements';

import { organizations as testOrganizations } from '@/servicesTest/organizations';

export default function OrganizationsScreen() {

  // Tilat organisaatioille
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Refit alkuperäisille tiedoille
  const allOrganizations = useRef<any[]>([]);

  // Alustetaan tiedot komponentin latautuessa
  useEffect(() => {
    setOrganizations(testOrganizations);

    // Tallennetaan koko data refeihin
    allOrganizations.current = testOrganizations;
  })

  // Hakutoiminto
  const searchFunction = (text: string) => {
    const upperText = text.toUpperCase();

    // Suodatetaan organisaatiot
    const filteredOrganizations = allOrganizations.current.filter((item) =>
      item.title.toUpperCase().includes(upperText)
    );

    // Päivitetään tilat
    setOrganizations(filteredOrganizations);
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

      <ThemedView style={styles.listsContainer}>
        {/* Organisaatiot */}
        <View style={styles.listBox}>
          <ThemedText style={styles.listTitle}>Organisaatiot</ThemedText>
          <FlatList
            data={organizations}
            renderItem={({ item }) => (
              <Item
                title={item.name}
                href={{
                  pathname: '/eventView',
                  params: { type: 'organization', id: item.id, name: item.name },
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