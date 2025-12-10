import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { getAllTimezones } from 'countries-and-timezones';

import { useSettings } from '@/components/SettingsContext';
import { getMe, patchSettings, patchUserDisplayname, User } from '@/services/users';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';




export default function Settings() {
    const { settings, setSettings } = useSettings()        // Näin saa asetukset omaan käyttöön
    const { t, i18n } = useTranslation();
    const [selectedTheme, setSelectedTheme] = useState(settings.theme)    // Tumma/Vaalea/Oletus teemavalikko
    const [currentLanguage, setLanguage] = useState(settings.language)   // Kielivalikko
    const [selectedTimezone, setSelectedTimezone] = useState(settings.timezone)  // Valittu aikavyöhyke
    const [user, setUser] = useState<User>({ id: -1, username: "unknown", displayname: "unknown" })
    const [changeDisplayNameText, setChangeDisplayNameText] = useState("");



    /** Vaihtaa käyttäjän displayname ominaisuuden toiseen */
    function changeDisplayName(newDisplayName: string) {
        patchUserDisplayname(newDisplayName);
        setChangeDisplayNameText(newDisplayName);
        let newUser = user;
        newUser.displayname = newDisplayName;
        setUser({ ...newUser });
    }

    useEffect(() => {  // Haetaan käyttäjän tiedot
        getMe().then(user => { setUser(user); setChangeDisplayNameText(user.displayname) });
    }, [])

    /** Kaikki aikavyöhykkeet listaamista varten */
    const timezones = Object.values(getAllTimezones());

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            extraScrollHeight={220}
            keyboardShouldPersistTaps="handled"
            enableResetScrollToCoords={false}
            enableOnAndroid
        >
            <ThemedView style={[styles.container, { paddingBottom: 500 }]} >

                <ThemedView style={styles.settingsViewContainer}>
                    <ThemedText style={styles.h1}>{user.displayname}</ThemedText>
                </ThemedView>
                <View style={styles.separator} />
                <ThemedView style={styles.settingsViewContainer}>
                    <ThemedText style={styles.h1}>{t('settingsPage.settings')}</ThemedText>
                    <View style={styles.separator} />
                </ThemedView>


                {/** Asetuksia.*/}
                <ThemedView style={styles.settingsViewContainer}>
                    <ThemedText style={styles.h2}>{t('settingsPage.general')}</ThemedText>
                    <ThemedView style={styles.settingsView}>
                        <ThemedText style={styles.baseText}>{t('settingsPage.language')}</ThemedText>
                        <View style={styles.pickerViewStyle}>
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
                        </View>
                    </ThemedView>
                    <ThemedView style={styles.settingsView}>
                        <ThemedText style={styles.baseText}>{i18n.t('settingsPage.select-theme')}</ThemedText>
                        <View style={styles.pickerViewStyle}>
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
                        </View>
                    </ThemedView>
                    <ThemedView style={styles.settingsView}>
                        <ThemedText style={styles.baseText}>{i18n.t('settingsPage.timezone')}</ThemedText>
                        <View style={styles.pickerViewStyle}>
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
                                style={styles.pickerStyle}
                            >
                                {
                                    timezones.map((timezone) => (
                                        <Picker.Item label={`${timezone.name + "   " + timezone.utcOffsetStr}`} value={timezone.name} />
                                    ))
                                }
                            </Picker>
                        </View>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.settingsViewContainer}>
                    <ThemedText style={styles.h2}>{i18n.t('settingsPage.profile')}</ThemedText>
                    <View style={styles.separator} />
                    <ThemedView>
                        <ThemedView style={styles.settingsView}>
                            <ThemedText style={styles.baseText}>{i18n.t('settingsPage.public-name')}</ThemedText>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={[styles.textInputStyle, { flexGrow: 2 }]}
                                    onChangeText={setChangeDisplayNameText}
                                    value={changeDisplayNameText}
                                    autoComplete='off'
                                    autoCorrect={false}
                                    contextMenuHidden={true}
                                />
                                {/*<Button title="Vaihda" onPress={() => {changeDisplayName(changeDisplayNameText);} } />*/}
                                <Pressable style={styles.button} onPress={() => { changeDisplayName(changeDisplayNameText); }} >
                                    <ThemedText style={{ color: 'white' }}>{t('settingsPage.select')}</ThemedText>
                                </Pressable>
                            </View>

                        </ThemedView>

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
            </ThemedView></KeyboardAwareScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        flex: 1,
    },
    separator: {
        borderTopWidth: 1,
        borderTopColor: 'gray'
    },
    h1: {
        fontSize: Platform.OS === "ios" ? 32 : 40,
        paddingVertical: Platform.OS === "ios" ? 5 : 10,
        marginTop: Platform.OS === "ios" ? 10 : 30,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
    },
    h2: {
        fontSize: 30,
        fontWeight: 'bold',
        flex: 1,
        flexGrow: 3,
        paddingVertical: Platform.OS === "ios" ? 5 : 10,
        marginTop: 20,
    },
    baseText: {
        fontSize: 22,
        fontWeight: 'regular',
    },
    settingsViewContainer: {
        marginLeft: 10,
        marginTop: 0,
    },
    settingsView: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 10,
        marginTop: 15,
        marginBottom: 15,
        minWidth: 50,
        minHeight: 50,
        maxWidth: 400,
    },
    pickerViewStyle: {
        borderRadius: 15,
        borderWidth: 0,
        borderColor: '#fff',
        overflow: 'hidden',
        marginTop: 10,
    },
    pickerStyle: {
        ...Platform.select({
            ios: {
                width: 180,
                borderRadius: 8,
            },
            android: {
                backgroundColor: '#fff',
                borderRadius: 8,
            },
            default: {

            }
        }),

    },
    textInputStyle: {
        borderRadius: 5,
        backgroundColor: 'lightgrey',
        color: 'black',
        marginRight: 10,
    },
    textInputViewStyle: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        ...Platform.select({
            ios: {
                /*
                paddingVertical: 8,
                alignSelf: 'flex-start',
                */
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: 'darkgreen'

            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 5,
                borderRadius: 8,
                backgroundColor: 'darkgreen'
            },
            default: {
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 5,
                borderRadius: 8,
                backgroundColor: 'darkgreen'

            }
        }),

    }
})