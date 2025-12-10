import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { color } from 'react-native-elements/dist/helpers';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';




export default function GroupViewLayout() {
    const { id, name } = useLocalSearchParams();
    const router = useRouter();
    const { t, i18n } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarPosition: "top",
                tabBarStyle: {
                    height: 50,
                    paddingTop: 0,
                    paddingBottom: 0
                }
                
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
                    title: t('groups.Events'),
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
                    title: t('groups.Calendar'),
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
