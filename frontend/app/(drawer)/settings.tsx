import React, { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Switch, Button, Modal, TouchableOpacity, Platform, TextInput } from 'react-native'
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
/** Otetaan modaaleille tyylit toistaiseksi EventView tyyleistä */
import evStyles from '@/styles/eventViewStyle';
import {Picker} from '@react-native-picker/picker';

import { getAllTimezones } from 'countries-and-timezones'

import { useTranslation } from 'react-i18next';
import { useSettings } from '@/components/SettingsContext';
import { getMe, patchSettings, patchUserDisplayname, User } from '@/services/users';
import { ScrollView } from 'react-native-gesture-handler';




export default function Settings() {
    const { settings, setSettings } = useSettings()        // Näin saa asetukset omaan käyttöön
    const { t, i18n } = useTranslation();
    const [selectedTheme, setSelectedTheme] = useState(settings.theme)    // Tumma/Vaalea/Oletus teemavalikko
    const [currentLanguage, setLanguage] = useState(settings.language)   // Kielivalikko
    const [isSelectTimezoneModalVisible, setSelectTimezoneModalVisible] = useState(false)   // Aikavyöhykevalikko
    const [isChangeDisplayNameVisible, setChangeDisplayNameVisible] = useState(false)   // Vaihda julkinen nimi modaali
    const [selectedTimezone, setSelectedTimezone] = useState(settings.timezone)  // Valittu aikavyöhyke
    const [user, setUser] = useState<User>({id: -1, username: "unknown", displayname: "unknown"})
    const [changeDisplayNameText, setChangeDisplayNameText] = useState("");

    /** Vaihtaa käyttäjän displayname ominaisuuden toiseen */
    function changeDisplayName(newDisplayName: string) {
        patchUserDisplayname(newDisplayName);
        setChangeDisplayNameText(newDisplayName);
        let newUser = user;
        newUser.displayname = newDisplayName;
        setUser(newUser);
    }

    useEffect( () => {  // Haetaan käyttäjän tiedot
        getMe().then(user => {setUser(user); setChangeDisplayNameText(user.displayname)});
    }, [])

    //console.log("Displayname", user)

    /** Kaikki aikavyöhykkeet listaamista varten */
    const timezones = Object.values(getAllTimezones());

    return (<ScrollView style={styles.container}><ThemedView style={styles.container}>
        <ThemedText style={styles.h1}>{user.displayname}</ThemedText>
        <ThemedText style={styles.h1}>{t('settingsPage.settings')}</ThemedText>

        {/** Asetuksia.*/}
        <ThemedView style={styles.settingsViewContainer}>
            <ThemedText style={styles.h2}>{t('settingsPage.general')}</ThemedText>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{t('settingsPage.language')}</ThemedText>
                <Picker
                    selectedValue={currentLanguage}
                    onValueChange={(itemValue, itemIndex) => {
                            let newSettings = settings;
                            newSettings.language = itemValue;
                            setSettings(newSettings);
                            patchSettings("language", itemValue);
                            i18n.changeLanguage(itemValue)
                            setLanguage(itemValue)
                        }
                    }
                    style={styles.pickerStyle}
                    >
                    <Picker.Item label="Suomi" value="fi" />
                    <Picker.Item label="English" value="en" />
                </Picker>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.select-theme')}</ThemedText>
                <Picker
                    selectedValue={selectedTheme}
                    onValueChange={(itemValue, itemIndex) => {
                        let newSettings = settings;
                        newSettings.theme = itemValue;
                        setSettings(newSettings);
                        patchSettings("theme", itemValue);
                        setSelectedTheme(itemValue);
                        }
                    }
                    style={styles.pickerStyle}
                    >
                    <Picker.Item label={i18n.t('settingsPage.default-theme')} value="default" />
                    <Picker.Item label={i18n.t('settingsPage.light-theme')} value="light" />
                    <Picker.Item label={i18n.t('settingsPage.dark-theme')} value="dark" />
                </Picker>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.timezone')}</ThemedText>
                <Button title={i18n.t('settingsPage.select')} onPress={() => setSelectTimezoneModalVisible(true)}/>
            </ThemedView>
        </ThemedView>
        <ThemedView style={styles.settingsViewContainer}>
            <ThemedText style={styles.h2}>{i18n.t('settingsPage.profile')}</ThemedText>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.public-name')}</ThemedText>
                <Button title={i18n.t('settingsPage.select')} onPress={() => setChangeDisplayNameVisible(true)}/>
            </ThemedView>
            {/*}
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.account-name')}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.switch-password')}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <Button color="#f00" title={i18n.t('settingsPage.delete-account')}/>
            </ThemedView>
            {*/}
        </ThemedView>
        
        

        {/** Aikavyöhyke modaali */}
        <Modal visible={isSelectTimezoneModalVisible} animationType="fade" transparent={true} onRequestClose={() => setSelectTimezoneModalVisible(false)}>
            <View style={styles.modalBackground}>
                <ThemedView style={styles.modalContent}>
                    <ThemedText style={styles.baseText}>{i18n.t('settingsPage.select-timezone')}</ThemedText>
                    <ThemedText style={styles.baseText}>Valittu {selectedTimezone}</ThemedText>
                    <Picker
                        selectedValue={selectedTimezone}
                        onValueChange={(itemValue, itemIndex) => {
                            let newSettings = settings;
                            newSettings.timezone = itemValue;
                            setSettings(newSettings);
                            setSelectedTimezone(itemValue)
                            patchSettings("timezone", itemValue);
                            }
                        }
                        style={styles.pickerStyleModal}
                        >
                        {
                            timezones.map((timezone) => (
                                <Picker.Item label={`${timezone.name + "   " + timezone.utcOffsetStr}`} value={timezone.name}/>
                            ))
                        }
                    </Picker>
                    <TouchableOpacity style={evStyles.button} onPress={() => setSelectTimezoneModalVisible(false)}>
                        <Text style={evStyles.buttonText}>{i18n.t('settingsPage.exit')}</Text>
                    </TouchableOpacity>
                </ThemedView>
            </View>
        </Modal>

        {/** Vaihda julkinen nimi modaali */}
        <Modal visible={isChangeDisplayNameVisible} animationType="fade" transparent={true} onRequestClose={() => setChangeDisplayNameVisible(false)}>
            <View style={styles.modalBackground}>
                <ThemedView style={styles.modalContent}>
                    <ThemedText style={styles.h2}>Vaihda nimi</ThemedText>
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={setChangeDisplayNameText}
                        value={changeDisplayNameText}
                    />
                    <ThemedView style={styles.horizontalButtons}>
                        <TouchableOpacity style={styles.button} onPress={() => {changeDisplayName(changeDisplayNameText); setChangeDisplayNameVisible(false)} }>
                            <Text style={evStyles.buttonText}>Vaihda</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setChangeDisplayNameVisible(false)}>
                            <Text style={evStyles.buttonText}>{i18n.t('settingsPage.exit')}</Text>
                        </TouchableOpacity>
                    </ThemedView>
                    
                </ThemedView>
            </View>
        </Modal>
    </ThemedView></ScrollView>
    
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    h1: {
        fontSize: 40,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 30
    },
    h2: {
        fontSize: 30,
        fontWeight: 'bold',
        flex: 1,
        flexGrow: 3,
    },
    baseText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingsViewContainer: {
        marginTop: 10,
        paddingTop: 30,
    },
    settingsView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        maxWidth: 400,
        margin: 25,
        marginTop: 50,
        minWidth: 50,
        minHeight: 50,
        flex: 0,
    },
    /** Eri tyylit alustan mukaan */
    pickerStyle: {
        ...Platform.select({
            android: {
                flex: 1,
                flexGrow: 1,
                backgroundColor: '#ffffff',
            },
            default: {
                
            }
        })        
    },
    pickerStyleModal: {
        ...Platform.select({
            android: {
                height: 75,
                width: 150,
                backgroundColor: '#ffffff',
            },
            default: {
                margin: 30,
                padding: 10
            }
        })        
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        padding: 100,
        borderRadius: 10,
        alignItems: "center",
    },
    horizontalButtons: {
        flex: 1,
        flexShrink: 0,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: 200
    },
    textInputStyle: {
        margin: 50,
        backgroundColor: 'lightgrey',
        color: 'black'
    },
    button: {
        flex: 1,
        backgroundColor: 'gray',
        alignItems: "center",
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        minHeight: 20,
    }
})