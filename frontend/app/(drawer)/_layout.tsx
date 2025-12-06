import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Image, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';

export default function DrawerLayout() {

  const { t, i18n } = useTranslation()
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
            drawerActiveTintColor : 'lightpink',
            headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)')}>
                    <Image
                        source={require('@/assets/images/Group-3.png')}
                        style={{
                            width: 40,
                            height: 40,
                            resizeMode: 'contain',
                            borderRadius: 50
                        }}
                    />
                    </TouchableOpacity>
                </View>
            )
        }}>
        <Drawer.Screen
            name="(tabs)"
            options={{
            drawerLabel: t('drawer.home'),
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