import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {

  const { t, i18n } = useTranslation()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
            drawerActiveTintColor : 'lightpink'
        }}>
        <Drawer.Screen
            name="(tabs)"
            options={{
            drawerLabel: t('drawer.my-profile'),
            title: 'Menu'
        }}
        />
        <Drawer.Screen
            name="settings"
            options={{
            drawerLabel: t('drawer.settings'),
            title: 'Menu'
        }}
        />
          <Drawer.Screen
          name="newEvent"
          options={{
            drawerLabel: t('drawer.new-event'),
            title: 'Menu'
          }}
        />
        <Drawer.Screen
          name="logOut"
          options={{
            drawerLabel: t('drawer.logout'),
            title: 'Menu'
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}