import styles from '@/styles/eventViewStyle';
import React, { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { SearchBar } from "react-native-elements";

const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: item.color || "#e6875c", ...styles.item }}>
        <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
);

type EventListProps = {
    events: any[];
    onImport?: (event: any) => void;
};

export default function EventList({ events, onImport }: EventListProps) {
    // Haetaan tiedot navigoinnista

    const [data, setData] = useState<any[]>(events); // hallitsee suodatetut tiedot
    const [searchValue, setSearchValue] = useState(""); // hallitsee hakutekstit
    const [modalVisible, setModalVisible] = useState(false); // hallitsee modalin näkyvyyttä
    const [pastModalVisible, setPastModalVisible] = useState(false); //hallitsee menneiden tapahtumien modaalin näkyvyyttä
    const [selectedItem, setSelectedItem] = useState<any>(null); // hallitsee valitun itemin modaalissa

    const now = new Date(); //tallenetaan nykyhetki vertailua varten

    const pastEvents = data.filter((event) => new Date(event.end) < now) //filteröidään menneet tapahtumat kaikista tapahtumista

    const comingEvents = data.filter((event) => new Date(event.start) >= now) //flteröidään tulevat tapahtumat kaikista tapahtumista

    useEffect(() => setData(events), [events])

    // funktio joka hoitaa haku jutut
    const searchFunction = (text: string) => {
        const filtered = events.filter((item) => // filtteröidään data
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
        setModalVisible(false); // suljetaan modal
        setSelectedItem(null); // nollataan valittu item
    };

    return (
        <View style={styles.container}>
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

            <TouchableOpacity style={styles.pastEventsButton} onPress={() => setPastModalVisible(true)}>
                <Text style={styles.itemText}>Menneet tapahtumat</Text>
            </TouchableOpacity>

            <Modal visible={pastModalVisible} animationType="slide" transparent={true} onRequestClose={() => setPastModalVisible(false)}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContentList}>
                        <FlatList
                            data={pastEvents}
                            renderItem={({ item }) => (
                                <Item item={item} onPress={() => openModal(item)} />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            ListEmptyComponent={
                                <Text style={{ textAlign: "center", marginTop: 30 }}>
                                    Ei menneitä tapahtumia tälle ryhmälle.
                                </Text>
                            }
                        />
                        <TouchableOpacity style={styles.button} onPress={() => setPastModalVisible(false)}>
                            <Text style={styles.buttonText}>Sulje</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <FlatList
                data={comingEvents}
                renderItem={({ item }) => (
                    <Item item={item} onPress={() => openModal(item)} />
                )}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 30 }}>
                        Ei tapahtumia haulle {searchValue}.
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

                        {/* Näytä tämä nappi VAIN jos onImport-prop on annettu (eli organizationView:ssä) */}
                        {onImport && selectedItem && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={async () => {
                                try {
                                    // odota että backend-kutsu onnistuu
                                    await onImport(selectedItem);
                                    // jos ei heitä virhettä → sulje modali
                                    closeModal();
                                } catch (e) {
                                    // virheistä vastaa jo handleImport (Alert), mutta logataan varmuuden vuoksi
                                    console.error(e);
                                }
                                }}
                            >
                                <Text style={styles.buttonText}>Lisää omaan kalenteriin</Text>
                            </TouchableOpacity>
                            )}
                        <TouchableOpacity style={styles.button} onPress={closeModal}>
                            <Text style={styles.buttonText}>Sulje</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}