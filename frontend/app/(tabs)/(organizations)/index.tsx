<<<<<<< HEAD
import { useState } from "react";
import { StyleSheet, FlatList, View, TextInput } from 'react-native';

=======
import React, { useState, useRef } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
>>>>>>> main
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from 'react-native-elements';

<<<<<<< HEAD
import {getGroups} from '@/services/groups';
import {getOrganisations} from '@/services/organisations'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from "@react-navigation/elements";

export default function OrganizaationsScreen() {
  console.log(getGroups)
  const groups = getGroups()
  const organisations = getOrganisations()
  const [newSearch, setNewSearch] = useState('');

  //Suodatetaan ryhmät haun perusteella
  const filteredGroups = groups.filter(group => group.name && group.name.toLowerCase().includes(newSearch.toLowerCase()))
  console.log(filteredGroups)

  //Suodatetaan organisaatiot haun perusteella
  const filteredOrganisations = organisations.filter(organisation => organisation.name && organisation.name.toLowerCase().includes(newSearch.toLowerCase()))
  console.log(filteredOrganisations)

  return (
    <>
    <View style ={styles.titleContainer}>
      <ThemedText>Tänne tulis yhistyksii tai jtn</ThemedText>
        </View>
        <SafeAreaView style = {styles.search}>
          <TextInput placeholder='Search' clearButtonMode='always' 
           style={styles.searchBox} 
           value={newSearch}
           onChangeText={setNewSearch}/>
        </SafeAreaView>
  <ThemedView style={styles.screenContainer}>
    <View style={styles.rowContainer}>
  {/* käyttäjien omat ryhmät */}   
    <View style={styles.groups}>
    <ThemedText style={styles.listTitle}>Groups</ThemedText>
       <FlatList 
         data={filteredGroups}
         keyExtractor={(item) => item.id.toString()}
         contentContainerStyle={{paddingBottom: 16}}
         renderItem={({item})=>{
        return<ThemedText>{item.name}</ThemedText>
      }}
      showsVerticalScrollIndicator={true}
      />
        </View>
  {/* Organisaatiot */}
  <View style={styles.groups}>
      <ThemedText style={styles.listTitle}>Organisations</ThemedText>
      <FlatList 
        data = {filteredOrganisations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{paddingBottom: 16}}
        renderItem={({item})=>{
        return<ThemedText>{item.name}</ThemedText>
        }}   
        showsVerticalScrollIndicator={true}
      />
    </View>
  </View>
</ThemedView>
    </>
=======
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

  const [organizations, setOrganizations] = useState(initOrganizations);
  const [groups, setGroups] = useState(initGroups);
  const [searchValue, setSearchValue] = useState('');

  const allOrganizations = useRef(initOrganizations);
  const allGroups = useRef(initGroups);


  const searchFunction = (text) => {
    const upperText = text.toUpperCase();

    const filteredOrganizations = allOrganizations.current.filter((item) =>
      item.title.toUpperCase().includes(upperText)
    );

    const filteredGroups = allGroups.current.filter((item) =>
      item.title.toUpperCase().includes(upperText)
    );

    setOrganizations(filteredOrganizations);
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

        {/* Omat ryhmät */}
        <View style={styles.listBox}>
          <ThemedText style={styles.listTitle}>Omat ryhmät</ThemedText>
          <FlatList
            data={groups}
            renderItem={({ item }) => (
              <Item
                title={item.title}
                href={{
                  pathname: '/details',
                  params: { type: 'group', id: item.id, name: item.title },
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </ThemedView>
>>>>>>> main
  );
}


const styles = StyleSheet.create({
<<<<<<< HEAD

  screenContainer:{
    flex: 1,
    padding: 16
    
  },

  titleContainer: {
=======
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
>>>>>>> main
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: 10,
  },
<<<<<<< HEAD

  groups: {
    flex: 1,
    padding: 16,
    borderColor: '#d3d3d3',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderTopWidth: 12,
    borderRadius: 8,
    marginBottom: 16,
    height: '30%',
    overflow: 'hidden'

  },

  listTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    fontFamily: "Quicksand-Regular",
    fontSize: 20
  },

  search: {
    marginHorizontal: 20,
    padding: 1
  },

  searchBox:{
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor:'#ccc',
    borderWidth: 1,
    borderRadius: 8
  },

  rowContainer: {
    flex: 1,
    gap: 12,
    flexDirection: 'row'
  },
  
  stepContainer: {
    gap: 8,
    marginBottom: 8,
=======
  listBox: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    padding: 8,
>>>>>>> main
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