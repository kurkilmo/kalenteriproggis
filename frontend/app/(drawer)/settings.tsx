import { createContext, useContext, useState } from 'react'
import { View, Text, StyleSheet, Switch, Button, Modal, TouchableOpacity, Platform } from 'react-native'
import { ThemedView } from '@/components/themed-view';
/** Otetaan modaaleille tyylit toistaiseksi EventView tyyleistä */
import evStyles from '@/styles/eventViewStyle';
import {Picker} from '@react-native-picker/picker';

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
    const [isSelectTimezoneModalVisible, setSelectTimezoneModalVisible] = useState(false)
    

    return (<ThemedView>
        <Text style={styles.titleText}>Asetukset</Text>

        {/** Asetuksia.*/}
        <SettingsView>
            <SettingsText>Kieli</SettingsText>
            <Picker
                selectedValue={selectedTheme}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedTheme(itemValue)
                }
                style={styles.pickerStyle}
                >
                <Picker.Item label="Suomi" value="fin" />
                <Picker.Item label="English" value="eng" />
            </Picker>
        </SettingsView>
        <SettingsView>
            <SettingsText>Valitse teema</SettingsText>
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
            <SettingsText>Aikavyöhyke</SettingsText>
            <Button title="Valitse" onPress={() => setSelectTimezoneModalVisible(true)}/>
        </SettingsView>
        <SettingsView>
            <Button color="#f00" title="Poista käyttäjä"/>
        </SettingsView>

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
    titleText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
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