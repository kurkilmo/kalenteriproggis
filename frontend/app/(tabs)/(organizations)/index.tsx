import { useState } from "react";
import { StyleSheet, FlatList, View, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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
  );
}


const styles = StyleSheet.create({

  screenContainer:{
    flex: 1,
    padding: 16
    
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

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
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
