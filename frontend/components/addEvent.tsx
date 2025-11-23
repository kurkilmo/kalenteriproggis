import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import ColorPicker from "react-native-wheel-color-picker";

export default function AddEvent({ visible, onClose }) {
  // Basic fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Random default color
  const [color, setColor] = useState(
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Uusi tapahtuma</Text>

          {/* TITLE */}
          <View style={styles.field}>
            <Text style={styles.label}>Otsikko</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Kirjoita otsikko"
            />
          </View>

          {/* SUMMARY */}
          <View style={styles.field}>
            <Text style={styles.label}>Kuvaus</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={summary}
              onChangeText={setSummary}
              placeholder="Lyhyt kuvaus"
              multiline
            />
          </View>

          {/* Start day + time */}
        <View style={styles.row}>
            <View style={[styles.field, { marginRight: 8 }]}>
                <Text style={styles.label}>Alkupäivä</Text>
                <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Alkuaika</Text>
                <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                />
            </View>
        </View>

        {/* End day + time */}
        <View style={styles.row}>
            <View style={[styles.field, { marginRight: 8 }]}>
                <Text style={styles.label}>Loppupäivä</Text>
                <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Loppuaika</Text>
                <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                />
            </View>
        </View>

          {/* COLOR PICKER BUTTON + SMALL PREVIEW SQUARE */}
          <View style={{ marginBottom: 20, width: "100%" }}>
            <Text style={styles.label}>Väri</Text>

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
                  Valitse väri
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Peruuta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.createButton,
                { backgroundColor: "#00838f" },
              ]}
              onPress={onClose} // Will save later
            >
              <Text style={styles.buttonText}>Luo</Text>
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
