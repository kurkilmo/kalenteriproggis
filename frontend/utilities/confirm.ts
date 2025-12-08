import { Alert, Platform } from "react-native";


export const confirm = (
    title: string,
    onAccept: ()=>void,
    onCancel: ()=>void = ()=>{}
) => {
    if (Platform.OS === "web") {
        window.confirm(title) ? onAccept() : onCancel();
        return
    }

    Alert.alert(title, '', [
        {
            text: 'Cancel',
            onPress: onCancel,
            style: 'cancel',
        },
        { text: 'OK', onPress: onAccept }
    ])
}