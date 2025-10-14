import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import {getGroups} from '@/services/groups';

export default function OrganizaationsScreen() {
  //console.log(getGroups)
  const groups = getGroups()


  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText>Tänne tulis yhistyksii tai jtn</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
