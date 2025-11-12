import { useState, useLayoutEffect } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedView } from '@/components/themed-view';
import { TextInput, Button, View, Text, TouchableOpacity } from 'react-native';
import styles from '@/styles/newEventStyle';

export default function NewEventScreen() {

  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showPicker, setShowPicker] = useState(false);


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

      {/*<Button title="Valitse aika ja päivämäärä" onPress={() => setShowPicker(true)} />*/}
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.button}>Valitse aika ja päivämäärä</Text>
      </TouchableOpacity>

      <Text style={{ marginVertical: 10 }}>Valittu: {date.toLocaleString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/*<Button title="Lisää tapahtuma" onPress={handleAddEvent} />*/}
       <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.button}>Lisää tapahtuma</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
