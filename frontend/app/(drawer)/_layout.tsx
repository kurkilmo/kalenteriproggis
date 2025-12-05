import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react';
import { useSession } from '@/utilities/ctx';
import { router } from 'expo-router';


function CustomDrawerContent(props : DrawerContentComponentProps) {
  const { signOut } = useSession();

  return (
    <View style={{flex:1}}>
      <DrawerContentScrollView {...props}>
          <DrawerItemList {...props}/>
          <View style={{borderTopColor: 'gray', borderTopWidth: 1, marginTop: 10, padding: 20, paddingBottom: 0}} />
      </DrawerContentScrollView>
      <View
      style={{}}
      >
        <TouchableOpacity onPress={() => {    /** Uloskirjautuminen */
                              signOut();
                              router.replace('/');
                            }}>
          <Text style={{
              color: 'white',
              padding: 20,
              borderTopColor: 'gray',
              borderTopWidth: 1,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {

  const { t, i18n } = useTranslation();

  const [logoutVisible, setLogoutVisible] = useState(false);

  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            drawerActiveTintColor : 'lightpink',
            headerShown: true,
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
      </Drawer>
    </GestureHandlerRootView>
  );
}