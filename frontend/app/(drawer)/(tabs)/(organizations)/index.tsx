import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getOrganisations } from '@/services/organisations';
import styles from '@/styles/orgStyle';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';


export default function OrganizationsScreen() {
  const { t, i18n } = useTranslation();

  // Tilat organisaatioille
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Refit alkuperäisille tiedoille
  const allOrganizations = useRef<any[]>([]);

  // Alustetaan tiedot komponentin latautuessa
  useEffect(() => {
    getOrganisations().then(data => {
      data.forEach(console.log)
      allOrganizations.current = data
      setOrganizations(data)
    })
  }, []);

  // Hakutoiminto
  const searchFunction = (text: string) => {
    const upperText = text.toUpperCase();

    // Suodatetaan organisaatiot
    const filteredOrganizations = allOrganizations.current.filter((item) =>
      item.fullname.toUpperCase().includes(upperText)
    );

    // Päivitetään tilat
    setOrganizations(filteredOrganizations);
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{t('organizations.organizations')}</ThemedText>

      <SearchBar
        placeholder={t('organizations.search-organizations')}
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
        {/* Organisaatiot */}
        <View style={styles.listBox}>
          <ThemedText style={styles.listTitle}>{t('organizations.organizations')}</ThemedText>
          <FlatList
            data={organizations}
            renderItem={({ item }) => (
              <Item
                title={item.fullname}
                href={{
                  pathname: '/eventView',
                  params: { type: 'organization', id: item.name, name: item.fullname },
                }}
              />
            )}
            keyExtractor={(item) => item.name.toString()}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}
