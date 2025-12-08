import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "react-i18next";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";


export default function () {
    const { t, i18n } = useTranslation();

    return (
        <ScrollView style={styles.container}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.h1}>Ryhmäkalenteri</ThemedText>
                <View style={{borderTopWidth: 1, borderTopColor: 'gray'}}></View>

                <ThemedText style={[styles.baseText]}>{t('info.social-calendar')}</ThemedText>
                <View style={{margin:5}}></View>
                <ThemedText>{t('info.group-project')}</ThemedText>
                <View style={{margin:20}}></View>

                <ThemedText style={styles.h2}>{t('info.what-is-it')}</ThemedText>
                <ThemedText>{t('info.explain-1')}</ThemedText>
                <ThemedText>{t('info.explain-2')}</ThemedText>



                <View style={{margin:20}}></View>
                <ThemedText style={[styles.h2, {fontWeight:'bold'}]}>{t('info.authors')}</ThemedText>
                <ThemedView>
                    <ThemedText style={{marginLeft: 20}}>Ilmo Kurki</ThemedText>
                    <ThemedText style={{marginLeft: 20}}>Valtteri Luukkala</ThemedText>
                    <ThemedText style={{marginLeft: 20}}>Mikko Oinonen</ThemedText>
                    <ThemedText style={{marginLeft: 20}}>Vilma Vartiainen</ThemedText>
                </ThemedView>
                <View style={{margin:20}}></View>
                <ThemedView>
                    <ThemedText style={styles.h2}>Github:</ThemedText>
                    <ThemedText style={{marginLeft: 20}}>https://github.com/kurkilmo/kalenteriproggis</ThemedText>
                </ThemedView>
            </ThemedView>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft:10,
    },
    h1: {
        fontSize: Platform.OS === "ios" ? 32 : 40,
        paddingVertical: Platform.OS === "ios" ? 5 : 10,
        marginTop: 10,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 20,
    },
    h2: {
        fontSize: 30,
        fontWeight: 'bold',
        flex: 1,
        flexGrow: 3,
        paddingVertical: Platform.OS === "ios" ? 5 : 10,
    },
    baseText: {
        fontSize: 18,
        minWidth: 400,
    },
    settingsViewContainer: {
        marginTop: 10,
        paddingTop: 30,
    },
    settingsView: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        minWidth: 50,
        minHeight: 50,
        flex: 0,
    },
    /** Eri tyylit alustan mukaan */
    pickerStyle: {
        ...Platform.select({
            ios:{
                width: 180,
                borderRadius: 8,
                marginLeft: 20,
            },
            android: {
                flex: 1,
                flexGrow: 1,
                backgroundColor: '#ffffff',
                marginLeft: 20,
            },
            default: {
                
            }
        }),
        
    },
    pickerStyleModal: {
        ...Platform.select({
            ios:{
                height: 120,
                width: 250,
                borderRadius: 8
            },
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
        padding: Platform.OS === "ios" ? 32 : 100,
        borderRadius: 10,
        alignItems: "center",
    },
    horizontalButtons: {
        flex: 1,
        flexShrink: 0,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: 200,
    },
    textInputStyle: {
        borderRadius: 5,
        backgroundColor: 'lightgrey',
        color: 'black',
        marginRight: 10,
    },
    button: {
        ...Platform.select({
            ios:{
                backgroundColor: 'gray',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 6,
                margin: 5,
                alignSelf: 'flex-start',
                
            },
            android: {
                flex: 1,
                backgroundColor: 'gray',
                alignItems: "center",
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 5,
                minHeight: 20,
        },
        default:{

        }
    }),

    }
})