import React from "react";
import { StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { SearchBar } from "react-native-elements";
import { useLocalSearchParams } from "expo-router"; // 🆕 tärkeä lisäys!

const DATA = [
  { id: "1", title: "Mahdollinen tapahtuma" },
  { id: "2", title: "Tapahtuma, joka saattaa tapahtua" },
  { id: "3", title: "Tapahtuma, jonka mahdollisuus on olemassa" },
  { id: "4", title: "Tilanne, jossa voi ilmetä jonkinlainen tapahtuma" },
  { id: "5", title: "Epävarma tilanne, jossa jokin tapahtuma voi toteutua" },
  { id: "6", title: "Epäselvä tapahtuma, jonka todennäköisyys on olemassa, mutta ei varma" },
  { id: "7", title: "Mahdollisuus tapahtumalle, jonka toteutuminen on vielä auki ja epätietoista" },
  { id: "8", title: "Tapahtuma, jonka esiintyminen ei ole varmaa, mutta on silti jollain tasolla odotettavissa" },
  { id: "9", title: "Tilanne, jossa on olemassa pieni mahdollisuus, että tietty tapahtuma voisi tapahtua tulevaisuudessa" },
  { id: "10", title: "Mahdollinen tapahtuma, jonka todennäköisyys on osittain arvioitavissa, mutta ei täysin ennustettavissa" },
  { id: "11", title: "Epäselvä tilanne, jossa tapahtuman toteutuminen on mahdollista, mutta se voi myös jäädä toteutumatta täysin odottamattomasta syystä" },
  { id: "12", title: "Tapahtuma, joka voi esiintyä tulevaisuudessa, mutta jonka lopullinen toteutuminen riippuu useista epävarmoista tekijöistä, joita ei voida täysin ennustaa" },
];

const Item = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <Text style={styles.itemText}>{title}</Text>
  </TouchableOpacity>
);

export default function DetailsScreen() {
  // 🆕 Haetaan tiedot navigoinnista
  const { type, name } = useLocalSearchParams(); 

  const [data, setData] = React.useState(DATA); // hallitsee suodatetut tiedot
  const [searchValue, setSearchValue] = React.useState(""); // hallitsee hakutekstit
  const [modalVisible, setModalVisible] = React.useState(false); // hallitsee modalin näkyvyyttä
  const [selectedItem, setSelectedItem] = React.useState(null); // hallitsee valitun itemin modaalissa
  const arrayholder = React.useRef(DATA); // tämä pitää alkuperäisen tiedon tallessa

  // funktio joka hoitaa haku jutut
  const searchFunction = (text) => {
    const updatedData = arrayholder.current.filter((item) => {
      const itemData = item.title.toUpperCase(); // otsikko isolla kirjaimella
      const textData = text.toUpperCase(); // hakuteksti isoiksi kirjaimiksi
      return itemData.includes(textData); // tarkistaa täsmääkö haku
    });
    setData(updatedData); // suodatetun tiedon päivitys
    setSearchValue(text); // hakutekstin arvon päivitys
  };

  // funktio modalin avaamiseen
  const openModal = (item) => {
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
        keyExtractor={(item) => item.id}
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalText}>
              Kuvaus tapahtumasta: "{selectedItem?.title}"
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
