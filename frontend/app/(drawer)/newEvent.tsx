import { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedView } from '@/components/themed-view';

export default function NewEventScreen() {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  const newEvent = {
    title,
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000), //tapahtuma on tunnin alotusajasta
  };

  return (
    <ThemedView style={{ padding: 20 }}>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ThemedView>
  );
}
