import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import styles from '@/styles/groupStyle';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Input, SearchBar } from 'react-native-elements';

import { createGroup, getGroups } from '@/services/groups';
import { useTranslation } from 'react-i18next';

const CreateGroupModal = ({ visible, closeModal, refresh }) => {
  const [ groupName, setGroupName ] = useState("");
  const { t, i18n } = useTranslation();

  const _createGroup = () => {
    if (!groupName) return;
    createGroup(groupName).then(resp => {
      if (resp.status === 201) {
        refresh();
        closeModal();
        setGroupName("")
      }
    })
  }

  const textColor = useThemeColor({}, 'text')

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={closeModal}>
      <ThemedView style={styles.modalBackground}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>{t('groups.create.title')}</ThemedText>
          <ThemedView style={styles.groupForm}>
            <ThemedText style={styles.modalTitle}>{t('groups.create.name')}</ThemedText>
            <Input
              style={{...styles.modalInput, color: textColor}}
              value={groupName}
              spellCheck={false}
              onChangeText={setGroupName}
            />
          </ThemedView>
          <ThemedView style={{flexDirection: "row"}}>
            <TouchableOpacity style={styles.modalButton} onPress={_createGroup}>
              <Text style={styles.modalButtonText}>{t('groups.create.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>{t('groups.create.exit')}</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  )
}


export default function GroupsScreen(){
  const {t, i18n } = useTranslation(); // Lisätään lokalisaatio
  const [modalVisible, setModalVisible] = useState(false); // Ryhmänluontimodaalin näkyvyys

  // tilat ryhmille
  const [groups, setGroups] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // refit alkuperäisille tiedoille
  const allGroups = useRef<any[]>([]);

  // alustetaan tiedot komponentin latautuessa
  const refreshGroups = () => {
    getGroups().then(data => {
      allGroups.current = data
      setGroups(data)
    })
  }
  useFocusEffect(useCallback(refreshGroups, []));

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

  const closeModal = () => setModalVisible(false);

  return(
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.buttons, {flex: 0, alignSelf: 'flex-start'}]}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setModalVisible(true)}> 
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

      <CreateGroupModal
        visible={modalVisible}
        closeModal={closeModal}
        refresh={refreshGroups}
      />
    </ThemedView>
  );
}