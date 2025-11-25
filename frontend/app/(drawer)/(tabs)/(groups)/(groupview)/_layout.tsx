import { Tabs, useLocalSearchParams } from 'expo-router';
import { color } from 'react-native-elements/dist/helpers';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function GroupViewLayout() {
    const { id, name } = useLocalSearchParams();

    return (
        <Tabs
            initialRouteName='index'
            screenOptions={{
                headerShown: false,
                tabBarPosition: "top"
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Info",
                    tabBarIcon: ({ color}) => <MaterialIcons name="info-outline" size={24} color={color} />
                    
                }}
            />
            <Tabs.Screen
                name="list"
                options={{
                    title: "Tapahtumat",
                    href: {
                        pathname: "./list",
                        params: { id, name }
                    },
                    tabBarIcon: ({ color}) => <MaterialIcons name="list" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Kalenteri",
                    href: {
                        pathname: "./calendar",
                        params: { id, name }
                    },
                    tabBarIcon: ({ color}) => <MaterialIcons name="event" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}
