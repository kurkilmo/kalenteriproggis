import { DateTime } from 'luxon';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates';
import ColorPicker from "react-native-wheel-color-picker";
import { useSettings } from "./SettingsContext";

const DateDialog = ({date, setDate}: {date:Date, setDate: any}) => {
  const [visible, setVisible] = useState(false)

  const onDismiss = () => {
    setVisible(false)
  }
  const onTimeConfirm = ({hours, minutes}) => {
    setVisible(false)
    const newDate = new Date(date)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    setDate(newDate)
  }

  const onDateChange = (changedDate: Date | undefined) => {
    if (!changedDate) return;
    changedDate.setHours(date.getHours())
    changedDate.setMinutes(date.getMinutes())
    setDate(changedDate)
  }

  return (
    <View style={{maxHeight: 100}}>
      <DatePickerInput
        locale="fi"
        inputMode='start'
        value={date}
        onChange={onDateChange}
      />
      <TouchableOpacity
        style={DatePickerStyle.timeButton}
        onPress={() => setVisible(true)}
      >
        <Text>{`${date.getHours()}:${String(date.getMinutes()).padStart(2,'0')}`}</Text>
      </TouchableOpacity>
      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onTimeConfirm}
        hours={date.getHours()}
        minutes={date.getMinutes()}
        use24HourClock={true}
      />
    </View>
  )
}

const DatePickerStyle = StyleSheet.create({
  timeButton: {
    backgroundColor: "#bcbcbcff",
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5
  }
})

export default function AddEvent({ visible, onClose, createEvent, oldEvent }) {
  // Basic fields
  const [title, setTitle] = useState(oldEvent?.title || "");
  const [summary, setSummary] = useState(oldEvent?.summary || "");
  const [startDate, setStartDate] = useState(new Date(oldEvent?.start || new Date())); // Nyt
  const [endDate, setEndDate] = useState(new Date(
    oldEvent ? oldEvent.end : new Date().getTime() + 3600000
  )) // Tunnin päästä
  const { settings } = useSettings();
  const { t, i18n } = useTranslation();

  // Random default color
  const [color, setColor] = useState( oldEvent?.color ||
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  const [showColorPicker, setShowColorPicker] = useState(false);

  const titleText = oldEvent
    ? t('create-event.edit-event')
    : t("create-event.new-event")
  const saveText = oldEvent
    ? t('create-event.save')
    : t('create-event.create')

  const submit = () => {
    if (!title) return;
    const newEvent = {
      title,
      summary,
      start: DateTime.fromISO(startDate.toISOString(), { zone: settings.timezone }).toISO(),
      end: DateTime.fromISO(endDate.toISOString(), { zone: settings.timezone }).toISO(),
      color
    }
    createEvent(newEvent)
    return true
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{titleText}</Text>

          {/* TITLE */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("create-event.title")}</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={t("create-event.write-title")}
            />
          </View>

          {/* SUMMARY */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("create-event.summary")}</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={summary}
              onChangeText={setSummary}
              placeholder={t("create-event.write-summary")}
              multiline
            />
          </View>
          {/* Start day + time */}
          <Text>{t('create-event.start-time')}</Text>
          <DateDialog date={startDate} setDate={setStartDate} />
          <Text style={{marginTop: 20}}>{t('create-event.end-time')}</Text>
          <DateDialog date={endDate} setDate={setEndDate} />
          {/* COLOR PICKER BUTTON + SMALL PREVIEW SQUARE */}
          <View style={{ marginVertical: 20, width: "100%" }}>
            <Text style={styles.label}>{t("create-event.color")}</Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Small color preview square */}
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: "#999",
                  marginRight: 12,
                }}
              />

              {/* Button to open color picker */}
              <TouchableOpacity
                onPress={() => setShowColorPicker(true)}
                style={{
                  flex: 1,
                  height: 45,
                  backgroundColor: "#333",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {t("create-event.choose-color")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            {/** Peruuta nappi */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t('create-event.cancel')}</Text>
            </TouchableOpacity>

            {/** Luo nappi */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.createButton,
                { backgroundColor: "#00838f" },
              ]}
              onPress={() => {submit() && onClose();}} // Will save later
            >
              <Text style={styles.buttonText}>{saveText}</Text>
            </TouchableOpacity>
          </View>

          {/* COLOR PICKER MODAL */}
          <Modal visible={showColorPicker} transparent animationType="fade">
            <View style={styles.modalBackground}>
              <View
                style={[
                  styles.modalContainer,
                  { width: "50%", alignItems: "center" },
                ]}
              >
                <Text style={styles.modalTitle}>Valitse väri</Text>

                <View style={{ height: 300, width: "100%" }}>
                  <ColorPicker
                    color={color}
                    onColorChangeComplete={(selected) => setColor(selected)}
                    thumbSize={30}
                    sliderSize={35}
                    noSnap={true}
                    row={false}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setShowColorPicker(false)}
                  style={{
                    marginTop: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    backgroundColor: "#333",
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>Sulje</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
}

// Tyylit
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.25)",
    },

    modalContainer: {
        width: 300,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        alignItems: "flex-start",
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },

    field: {
        width: "100%",
        marginBottom: 12,
    },

    label: {
        fontSize: 14,
        marginBottom: 4,
    },

    input: {
        width: "100%",
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 20,
    },

    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 6,
    },

    cancelButton: {
        backgroundColor: "#00838f",
    },

    createButton: {
        backgroundColor: "#4527A0",
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },

    row: {
        width: "48.5%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
});
