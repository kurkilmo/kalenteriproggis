import { Tabs, useLocalSearchParams } from 'expo-router';

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
                    title: "Info"
                }}
            />
            <Tabs.Screen
                name="list"
                options={{
                    title: "Tapahtumat",
                    href: {
                        pathname: "./list",
                        params: { id, name }
                    }
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Kalenteri",
                    href: {
                        pathname: "./calendar",
                        params: { id, name }
                    }
                }}
            />
        </Tabs>
    );
}
