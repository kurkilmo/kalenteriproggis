import { ThemedText } from "@/components/themed-text";
import styles from '@/styles/eventViewStyle';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View} from "react-native";
import { SearchBar } from "react-native-elements";

import { getGroupEvents } from "@/services/groups";
import { getOrganizationEvents } from "@/services/organisations";
import { ThemedView } from "@/components/themed-view";

import { GroupWeekCalendar } from '@/components/calendar';


const Item = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ backgroundColor: item.color || "#e6875c", ...styles.item}}>
    <Text style={styles.itemText}>{item.title}</Text>
  </TouchableOpacity>
);

export default function DetailsScreen() {
  // Haetaan tiedot navigoinnista
  const { type, id,  name } = useLocalSearchParams(); 

  const [data, setData] = useState<any[]>([]); // hallitsee suodatetut tiedot
  const [searchValue, setSearchValue] = useState(""); // hallitsee hakutekstit
  const [modalVisible, setModalVisible] = useState(false); // hallitsee modalin näkyvyyttä
  const [selectedItem, setSelectedItem] = useState<any>(null); // hallitsee valitun itemin modaalissa
  const arrayholder = useRef<any[]>([]); // tämä pitää alkuperäisen tiedon tallessa
  const [groupEvents, setGroupEvents] = useState([]);

  useEffect(() => { // haetaan data organisaation tai ryhmän perusteella
    const getter = type === "organization" ? getOrganizationEvents : getGroupEvents

    getter(id).then(events => {
      console.log(events)
      arrayholder.current = events
      setData(events)
      setGroupEvents(events)
    })
  }, [type, id]);

  // funktio joka hoitaa haku jutut
  const searchFunction = (text: string) => {
    const filtered = arrayholder.current.filter((item) => // filtteröidään data
      item.title.toUpperCase().includes(text.toUpperCase())
    );
    setData(filtered); // asetetaan suodatettu data
    setSearchValue(text); // asetetaan hakuteksti
  };

  // funktio modalin avaamiseen
  const openModal = (item: any) => {
    setSelectedItem(item); // asetetaan valittu item
    setModalVisible(true); // avataan modal
  };

  // funktio modalin sulkemiseen
  const closeModal = () => {
    setModalVisible(false); // seljetaan modal
    setSelectedItem(null); // nollataan valittu item
  };

  // Muodostetaan otsikko riippuen tyypistä
  const typeText = type === "organization" ? "organisaation" : "ryhmän";
  const headerTitle = `${name}, ${typeText} tapahtumat`;

  return (
    <View style={styles.container}>
      {/*Tähän tulisi kalenteri*/}
      <ThemedText style={styles.headerText}>{headerTitle}</ThemedText>

      {/* Näytetään ryhmäkalenteri vain jos EI olla organisaatiossa */}
      {type !== "organization" && (
        <GroupWeekCalendar events={groupEvents} />
      )}

      <SearchBar
        placeholder="Hae tapahtumia..."
        value={searchValue}
        onChangeText={searchFunction}
        autoCorrect={false}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        searchIcon={{ size: 24, color: "black" }}
        clearIcon={{ size: 24, color: "black" }}
      />

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Item item={item} onPress={() => openModal(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            Ei tapahtumia tälle {typeText}.
          </Text>
        }
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalText}>{selectedItem?.summary}</Text>
            <Text style={styles.modalText}>
              {new Date(selectedItem?.start).toLocaleString()} - {new Date(selectedItem?.end).toLocaleString()}
            </Text>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Sulje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
