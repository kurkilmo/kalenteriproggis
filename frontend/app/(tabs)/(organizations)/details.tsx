import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { SearchBar } from "react-native-elements";
import { useLocalSearchParams } from "expo-router";

import { organizations } from "@/servicesTest/organizations";
import { groups } from "@/servicesTest/groups";
import { timelineEvents as events } from "@/servicesTest/events";

// const DATA = [
//   { id: "1", title: "Mahdollinen tapahtuma" },
//   { id: "2", title: "Tapahtuma, joka saattaa tapahtua" },
//   { id: "3", title: "Tapahtuma, jonka mahdollisuus on olemassa" },
//   { id: "4", title: "Tilanne, jossa voi ilmetä jonkinlainen tapahtuma" },
//   { id: "5", title: "Epävarma tilanne, jossa jokin tapahtuma voi toteutua" },
//   { id: "6", title: "Epäselvä tapahtuma, jonka todennäköisyys on olemassa, mutta ei varma" },
//   { id: "7", title: "Mahdollisuus tapahtumalle, jonka toteutuminen on vielä auki ja epätietoista" },
//   { id: "8", title: "Tapahtuma, jonka esiintyminen ei ole varmaa, mutta on silti jollain tasolla odotettavissa" },
//   { id: "9", title: "Tilanne, jossa on olemassa pieni mahdollisuus, että tietty tapahtuma voisi tapahtua tulevaisuudessa" },
//   { id: "10", title: "Mahdollinen tapahtuma, jonka todennäköisyys on osittain arvioitavissa, mutta ei täysin ennustettavissa" },
//   { id: "11", title: "Epäselvä tilanne, jossa tapahtuman toteutuminen on mahdollista, mutta se voi myös jäädä toteutumatta täysin odottamattomasta syystä" },
//   { id: "12", title: "Tapahtuma, joka voi esiintyä tulevaisuudessa, mutta jonka lopullinen toteutuminen riippuu useista epävarmoista tekijöistä, joita ei voida täysin ennustaa" },
// ];

const Item = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <Text style={styles.itemText}>{title}</Text>
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

  useEffect(() => { // haetaan data organisaation tai ryhmän perusteella
    let eventIds: Number[] = [];

    if (type === "organization") { // tarkistetaan tyyppi
      const org = organizations.find((o) => o.id.toString() === id); // etsitään organisaatio
      eventIds = org ? org.eventIds : []; // haetaan tapahtuma ID:t
    } else if (type === "group") {
      const group = groups.find((g) => g.id.toString() === id);
      eventIds = group ? group.eventIds : [];
    }

    // haetaan tapahtumat
    const relatedEvents = events.filter((e) => eventIds.includes(e.id));

    // asetetaan data tilaan ja refiin
    setData(relatedEvents);
    arrayholder.current = relatedEvents;
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

  // funktio madalin sulkemiseen
  const closeModal = () => {
    setModalVisible(false); // seljetaan modal
    setSelectedItem(null); // nollataan valittu item
  };

  // Muodostetaan otsikko riippuen tyypistä
  const typeText = type === "organization" ? "organisaation" : "ryhmän";
  const headerTitle = `${name}, ${typeText} tapahtumat`;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.headerText}>{headerTitle}</ThemedText>

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
          <Item title={item.title} onPress={() => openModal(item)} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 10,
  },
  searchInputContainer: {
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: "teal",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  itemText: {
    color: "black",
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 280,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "teal",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
