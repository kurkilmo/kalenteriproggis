import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DateTime } from 'luxon';

import ColorPicker from "react-native-wheel-color-picker";
import { useSettings } from "./SettingsContext";
import { useTranslation } from "react-i18next";

export default function AddEvent({ visible, onClose, createEvent }) {
  // Basic fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [validStart, setValidStart] = useState(false);
  const [validEnd, setValidEnd] = useState(false);
  const { settings } = useSettings();
  const { t, i18n } = useTranslation();

  // Random default color
  const [color, setColor] = useState(
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    setValidStart(!isNaN(new Date(startDate + " " + startTime).getTime()))
  }, [startDate, startTime])
  useEffect(() => {
    setValidEnd(!isNaN(new Date(startDate + " " + startTime).getTime()))
  }, [endDate, endTime])

  const submit = () => {
    if (!validEnd || !validStart) return false

    const newEvent = {
      title,
      summary,
      start: DateTime.fromISO(startDate + "T" + startTime, { zone: settings.timezone }).toISO(),
      end: DateTime.fromISO(endDate + "T" + endTime, { zone: settings.timezone }).toISO(),
      color
    }
    createEvent(newEvent)
    return true
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t("create-event.new-event")}</Text>

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
        <View style={styles.row}>
            <View style={[styles.field, { marginRight: 8 }]}>
                <Text style={styles.label}>{t("create-event.start-date")}</Text>
                <TextInput
                style={{ ...styles.input, borderColor: validStart ? "#ccc" : "#c22" }}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor = "black"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>{t("create-event.start-time")}</Text>
                <TextInput
                style={{ ...styles.input, borderColor: validStart ? "#ccc" : "#c22" }}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                placeholderTextColor = "black"
                />
            </View>
        </View>

        {/* End day + time */}
        <View style={styles.row}>
            <View style={[styles.field, { marginRight: 8 }]}>
                <Text style={styles.label}>{t("create-event.end-date")}</Text>
                <TextInput
                style={{ ...styles.input, borderColor: validEnd ? "#ccc" : "#c22" }}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor = "black"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>{t("create-event.end-time")}</Text>
                <TextInput
                style={{ ...styles.input, borderColor: validEnd ? "#ccc" : "#c22" }}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                placeholderTextColor = "black"
                />
            </View>
        </View>

          {/* COLOR PICKER BUTTON + SMALL PREVIEW SQUARE */}
          <View style={{ marginBottom: 20, width: "100%" }}>
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
              <Text style={styles.buttonText}>{t('create-event.create')}</Text>
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
