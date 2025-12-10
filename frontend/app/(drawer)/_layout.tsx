import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modal, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react';
import { useSession } from '@/utilities/ctx';
import { useRouter, router } from 'expo-router';


function CustomDrawerContent(props : DrawerContentComponentProps) {
  const { signOut } = useSession();
  const { t, i18n } = useTranslation();

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
              color: 'gray',
              padding: 20,
              borderTopColor: 'gray',
              borderTopWidth: 1,
            }}>
            {t("sign-out.logout")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
    const { t, i18n } = useTranslation();
    const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            drawerActiveTintColor : 'lightpink',
            headerRight: () => (
                <View style={{ marginRight: 15 }}>
                  <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)/(home)')}>
                    <Image
                        source={require('@/assets/images/Group-3.png')}
                        style={{
                            width: 47,
                            height: 47,
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
            name="info"
            options={{
            drawerLabel: t('drawer.info'),
            title: 'Menu'
        }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}