import { useState } from 'react'
import { View, Text, StyleSheet, Switch, Button } from 'react-native'

const SettingsElement: React.FC<React.PropsWithChildren> = ({children}) => {
    return (<View style={styles.settingsView}>{children}</View>)
}
const SettingsText: React.FC<React.PropsWithChildren> = ({children}) => {
    return (<Text style={styles.baseText}>{children}</Text>)
}

export default function Settings() {
    const [isLightModeEnabled, setLightModeEnabled] = useState(true)
    return <View>
        <Text style={styles.titleText}>Asetukset</Text>
        <SettingsElement>
            <Text style={styles.baseText}>Kieli</Text>
            <Button title="Valitse"/>
        </SettingsElement>
        <SettingsElement>
            <Text style={styles.baseText}>Tumma teema</Text>
            <Switch
                onValueChange={() => setLightModeEnabled(!isLightModeEnabled)}
                value={isLightModeEnabled}
            />
        </SettingsElement>
        <SettingsElement>
            <SettingsText>Aikavyöhyke</SettingsText>
            <Button title="Valitse"/>
        </SettingsElement>
        <SettingsElement>
            <Button color="#f00" title="Poista käyttäjä"/>
        </SettingsElement>
    </View>
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
        
    }
})