import { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Switch, Button, Modal, TouchableOpacity, Platform } from 'react-native'
import { ThemedView } from '@/components/themed-view';
/** Otetaan modaaleille tyylit toistaiseksi EventView tyyleistä */
import evStyles from '@/styles/eventViewStyle';
import {Picker} from '@react-native-picker/picker';

import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import en from '@/locales/en.json'
import fi from '@/locales/fi.json'
import { ThemedText } from '@/components/themed-text';
import { initial } from 'lodash';

// Lokalisaatioita
const i18n = new I18n({
    fi: fi,
    en: en
})

     // Ottaa järjestelmän kielen; Jos ei löydy laittaa englanniksi.
i18n.enableFallback = true  // Jos ei löydy käännöstä ottaa englanniksi

/** View asetuksille */
const SettingsView: React.FC<React.PropsWithChildren> = ({children}) => {
    return (<ThemedView style={styles.settingsView}>{children}</ThemedView>)
}
/** Text asetuksille */
const SettingsText: React.FC<React.PropsWithChildren> = ({children}) => {
    return (<ThemedText>{children}</ThemedText>)
}

export interface Settings {
    theme: 'default' | 'light' | 'dark';
    language: string
    timezone: string
}

export const initialSettings: Settings = {
    theme: 'default',
    language: i18n.locale = getLocales()[0].languageCode ?? 'en',
    timezone: 'EET'
}

export const SettingsContext = createContext<Settings>(initialSettings);

export default function Settings() {
    const settings = useContext(SettingsContext)        // Näin saa asetukset omaan käyttöön
    const [selectedTheme, setSelectedTheme] = useState(initialSettings.theme)    // Tumma/Vaalea/Oletus teemavalikko
    const [currentLanguage, setLanguage] = useState(initialSettings.language)   // Kielivalikko
    const [isSelectTimezoneModalVisible, setSelectTimezoneModalVisible] = useState(false)   // Aikavyöhykevalikko

    i18n.locale = settings.language ?? 'en'
    

    return (<ThemedView>
        <ThemedText style={styles.h1}>{i18n.t('settingsPage.settings')}</ThemedText>

        {/** Asetuksia.*/}
        <ThemedView style={styles.settingsViewContainer}>
            <ThemedText style={styles.h2}>{i18n.t('settingsPage.general')}</ThemedText>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.language')}</ThemedText>
                <Picker
                    selectedValue={currentLanguage}
                    onValueChange={(itemValue, itemIndex) => {
                        settings.language = itemValue
                        i18n.locale = itemValue
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
                    <Picker.Item label="Oletus" value="default" />
                    <Picker.Item label="Vaalea" value="light" />
                    <Picker.Item label="Tumma" value="dark" />
                </Picker>
            </ThemedView>
            <ThemedView style={styles.settingsView}>
                <ThemedText style={styles.baseText}>{i18n.t('settingsPage.timezone')}</ThemedText>
                <Button title="Valitse" onPress={() => setSelectTimezoneModalVisible(true)}/>
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
            <View style={evStyles.modalBackground}>
                <View style={evStyles.modalContent}>
                <Text style={evStyles.modalTitle}>Valitse aikavyöhyke</Text>
                <Text style={evStyles.modalText}>...aikavyöhykkeitä...</Text>
                <TouchableOpacity style={evStyles.button} onPress={() => setSelectTimezoneModalVisible(false)}>
                    <Text style={evStyles.buttonText}>Sulje</Text>
                </TouchableOpacity>
                </View>
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
    }
})