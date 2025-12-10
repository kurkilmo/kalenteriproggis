import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function GroupsLayout() {

  const { t, i18n } = useTranslation();

  return (
    <>
      <Stack>
        <Stack.Screen name="index" 
        options={{ headerShown: false,
        title: t('groups.back')
        }} 
        />
        <Stack.Screen name='(groupview)' options={{ 
          title: Platform.OS === "ios" ? "" :t ('groups.back-to-groups'),
          headerShown: true,
       }}
       />
      </Stack>
    </>
  );
}
