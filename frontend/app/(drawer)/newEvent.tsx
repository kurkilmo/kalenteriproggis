import { useState, useLayoutEffect } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedView } from '@/components/themed-view';
import { TextInput, Button, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NewEventScreen() {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Lisää uusi tapahtuma' });
  }, [navigation]);

  //Käsittelee päivämäärän ja ajan
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  //Luodaan uusi tapahtuma käyttäjän syöttämien tietojen perusteella
  const newEvent = {
    title,
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000), //tapahtuman kesto oletuksena 1h
  };

//Kun käyttäjä painaa lisää tapahtuma painiketta, tapahtuma tallennetaan kalenteriin. Ei toimi vielä.
  const handleAddEvent = () => {
    console.log('Lisää uusi tapahtuma', newEvent);
  };

  return (
    <ThemedView style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>Tapahtuma</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Tapahtuman nimi"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <Button title="Valitse aika ja päivämäärä" onPress={() => setShowPicker(true)} />
      <Text style={{ marginVertical: 10 }}>Valittu: {date.toLocaleString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Lisää tapahtuma" onPress={handleAddEvent} />
    </ThemedView>
  );
}
