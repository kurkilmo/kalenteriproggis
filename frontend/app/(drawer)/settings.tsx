import { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Switch, Button, Modal, TouchableOpacity, Platform } from 'react-native'
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
/** Otetaan modaaleille tyylit toistaiseksi EventView tyyleistä */
import evStyles from '@/styles/eventViewStyle';
import {Picker} from '@react-native-picker/picker';

import { getAllTimezones } from 'countries-and-timezones'

import { getLocales, getCalendars } from 'expo-localization'
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/components/SettingsContext';

/*
export interface Settings {
    theme: 'default' | 'light' | 'dark';
    language: string
    timezone: string
}

export const initialSettings: Settings = {
    theme: 'default',
    language: getLocales()[0].languageCode ?? 'fi',
    timezone: getCalendars()[0].timeZone ?? 'Europe/Helsinki'
}*/

//export const SettingsContext = createContext<Settings>(initialSettings);

export default function Settings() {
    const { settings, setSettings } = useSettings()        // Näin saa asetukset omaan käyttöön
    const { t, i18n } = useTranslation();
    const [selectedTheme, setSelectedTheme] = useState(settings.theme)    // Tumma/Vaalea/Oletus teemavalikko
    const [currentLanguage, setLanguage] = useState(settings.language)   // Kielivalikko
    const [isSelectTimezoneModalVisible, setSelectTimezoneModalVisible] = useState(false)   // Aikavyöhykevalikko
    const [selectedTimezone, setSelectedTimezone] = useState(settings.timezone)  // Valittu aikavyöhyke

    /** Kaikki aikavyöhykkeet listaamista varten */
    const timezones = Object.values(getAllTimezones());

    return (<ThemedView>
        <ThemedText style={styles.h1}>{t('settingsPage.settings')}</ThemedText>

        {/** Asetuksia.*/}
        <ThemedView style={styles.settingsViewContainer}>
            <ThemedText style={styles.h2}>{t('settingsPage.general')}</ThemedText>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{t('settingsPage.language')}</ThemedText>
                <Picker
                    selectedValue={currentLanguage}
                    onValueChange={(itemValue, itemIndex) => {
                            settings.language = itemValue
                            i18n.changeLanguage(itemValue)
                            console.log("Setting sivu kieli asetettu", itemValue)
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
                        settings.theme = itemValue
                        setSelectedTheme(itemValue)
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
            <ThemedText style={styles.h2}>Profiili</ThemedText>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.public-name')}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.account-name')}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.switch-password')}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <Button color="#f00" title={i18n.t('settingsPage.delete-account')}/>
            </ThemedView>
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
                            settings.timezone = itemValue
                            setSelectedTimezone(itemValue)
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
    </ThemedView>
    
    )
}

const styles = StyleSheet.create({
    h1: {
        fontSize: 40,
        fontWeight: 'bold',
        margin: 30
    },
    h2: {
        fontSize: 30,
        marginLeft: 30,
        fontWeight: 'bold',
    },
    baseText: {
        fontSize: 18,
        marginLeft: 30,
        fontWeight: 'bold',
    },
    settingsViewContainer: {
        margin: 10,
        padding: 30
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
                height: 75,
                width: 150,
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
        padding: 20,
        borderRadius: 10,
        width: 280,
        alignItems: "center",
    },
})