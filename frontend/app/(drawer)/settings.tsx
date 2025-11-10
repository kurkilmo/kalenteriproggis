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
import { initial } from 'lodash';

const i18n = new I18n({
    fi: fi,
    en: en
})

i18n.locale = getLocales()[0].languageCode ?? 'en';
i18n.enableFallback = true
//i18n.locale = 'en'

/** View */
const SettingsView: React.FC<React.PropsWithChildren> = ({children}) => {
    return (<ThemedView style={styles.settingsView}>{children}</ThemedView>)
}
/** Text */
const SettingsText: React.FC<React.PropsWithChildren> = ({children}) => {
    return (<Text style={styles.baseText}>{children}</Text>)
}

export interface Settings {
    theme: string
    language: string
    timezone: string
}

export const initialSettings: Settings = {
    theme: 'default',
    language: 'fi',
    timezone: 'EET'
}

export const SettingsContext = createContext<Settings>(initialSettings);

export default function Settings() {
    const settings = useContext(SettingsContext)
    const [selectedTheme, setSelectedTheme] = useState(true)
    const [currentLanguage, setLanguage] = useState(initialSettings.language)
    const [isSelectTimezoneModalVisible, setSelectTimezoneModalVisible] = useState(false)
    

    return (<ThemedView>
        <Text style={styles.h1}>{i18n.t('settingsPage.settings')}</Text>

        {/** Asetuksia.*/}
        <View>
            <Text style={styles.h2}>{i18n.t('settingsPage.general')}</Text>
            <SettingsView>
                <SettingsText>{i18n.t('settingsPage.language')}</SettingsText>
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
            </SettingsView>
            <SettingsView>
                <SettingsText>{i18n.t('settingsPage.select-theme')}</SettingsText>
                <Picker
                    selectedValue={selectedTheme}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedTheme(itemValue)
                    }
                    style={styles.pickerStyle}
                    >
                    <Picker.Item label="Oletus" value="default" />
                    <Picker.Item label="Vaalea" value="light" />
                    <Picker.Item label="Tumma" value="dark" />
                </Picker>
            </SettingsView>
            <SettingsView>
                <SettingsText>{i18n.t('settingsPage.timezone')}</SettingsText>
                <Button title="Valitse" onPress={() => setSelectTimezoneModalVisible(true)}/>
            </SettingsView>
        </View>
        <View>
            <Text style={styles.h2}>Profiili</Text>
            <SettingsView>
                <SettingsText>{i18n.t('settingsPage.public-name')}</SettingsText>
            </SettingsView>
            <SettingsView>
                <SettingsText>{i18n.t('settingsPage.account-name')}</SettingsText>
            </SettingsView>
            <SettingsView>
                <SettingsText>{i18n.t('settingsPage.switch-password')}</SettingsText>
            </SettingsView>
            <SettingsView>
                <Button color="#f00" title={i18n.t('settingsPage.delete-account')}/>
            </SettingsView>
        </View>
        
        

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
        color: 'white',
        marginLeft: 10,
    },
    h2: {
        fontSize: 30,
        color: 'white',
        paddingLeft: 10,
    },
    baseText: {
        fontSize: 18,
        color: 'white',
    },
    settingsView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        maxWidth: 400,
        marginLeft: 25,
        marginRight: 25,
        marginTop: 20,
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