import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/styles/groupStyle';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { getGroups } from '@/services/groups';
import { useLocalization } from '@/locales/LocalizationContext';
import { useTranslation } from 'react-i18next'

export default function GroupsScreen(){
  const {t, i18n } = useTranslation(); // Lisätään lokalisaatio

  // tilat ryhmille
  const [groups, setGroups] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // refit alkuperäisille tiedoille
  const allGroups = useRef<any[]>([]);

  // alustetaan tiedot komponentin latautuessa
  useEffect(() => {
    getGroups().then(data => {
      allGroups.current = data
      setGroups(data)
    })
  }, []);

  // hakutoiminto
  const searchFunction = (text: string) => {
    const upperText = text.toUpperCase();

    // suodatetaan ryhmät
    const filteredGroups = allGroups.current.filter((item) =>
      item.name.toUpperCase().includes(upperText)
    );
    
    // päivitetään tilat
    setGroups(filteredGroups);
    setSearchValue(text);
  };

  // Item komponentti listan riveille
  const Item = ({ title, href }: { title: string; href: any }) => (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return(
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.buttons, {flex: 0, alignSelf: 'flex-start'}]}>
        <TouchableOpacity
          style={styles.buttonContainer}> 
          <Text style={styles.button}>{t('groups.leave-group')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}> 
          <Text style={styles.button}>{t('groups.join-group')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}> 
          <Text style={styles.button}>{t('groups.add-group')}</Text>
        </TouchableOpacity>
      </ThemedView>
        
        <ThemedText style={styles.title}>{t('groups.groups')}</ThemedText>

        <SearchBar
        placeholder={t('groups.search-groups')}
        value={searchValue}
        onChangeText={searchFunction}
        autoCorrect={false}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        searchIcon={{ size: 22, color: 'black' }}
        clearIcon={{ size: 22, color: 'black' }}
      />

    <ThemedView style={styles.listsContainer}>
     {/* Omat ryhmät */}    
      <View style={styles.listBox}>
      <ThemedText style={styles.listTitle}>{t('groups.my-groups')}</ThemedText>
      <FlatList
          data={groups}
          renderItem={({item}) => (
            <Item
              title={item.name}
              href={{
                  pathname: './(groupview)',
                  params: {type: 'group', id: item.id, name: item.name},
                  }}
                />
              )} 
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}