import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
            drawerActiveTintColor : 'lightpink'
        }}>
        <Drawer.Screen
            name="(tabs)"
            options={{
            drawerLabel: 'Oma profiili',
            title: 'Menu'
        }}
        />
        <Drawer.Screen
            name="settings"
            options={{
            drawerLabel: 'Asetukset',
            title: 'Menu'
        }}
        />
          <Drawer.Screen
          name="newEvent"
          options={{
            drawerLabel: 'Uusi tapahtuma',
            title: 'Menu'
          }}
        />
        <Drawer.Screen
          name="logOut"
          options={{
            drawerLabel: 'Kirjaudu ulos',
            title: 'Menu'
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}