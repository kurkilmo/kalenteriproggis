import EventList from "@/components/eventList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {  getOrganizationEvents,  importOrganizationEvent } from "@/services/organisations";
import styles from "@/styles/eventViewStyle";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Switch, Alert } from "react-native";
import { useSettings } from "@/components/SettingsContext";

export default function OrganziationView() {
  const { id, name } = useLocalSearchParams();
  const [events, setEvents] = useState<any[]>([]);

  const { settings, setSettings } = useSettings();

  // varmistetaan että orgId on string
  const orgId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  const subscribedOrgs = settings.orgSubscriptions ?? [];
  const isSubscribed = orgId ? subscribedOrgs.includes(orgId) : false;

  useEffect(() => {
    if (!orgId) return;
    getOrganizationEvents(orgId).then(setEvents);
  }, [orgId]);

  const toggleSubscription = () => {
    if (!orgId) return;

    const current = settings.orgSubscriptions ?? [];
    const alreadyOn = current.includes(orgId);
    const next = alreadyOn
      ? current.filter((n) => n !== orgId)
      : [...current, orgId];

    setSettings({
      ...settings,
      orgSubscriptions: next,
    });
  };

  const handleImport = async (event: any) => {
    if (!orgId) return;
    try {
      await importOrganizationEvent(orgId, event);
      Alert.alert("Kalenteri", "Tapahtuma lisätty omaan kalenteriisi.");
      // EventList sulkee modaalin, koska se odottaa onImportia ja kutsuu closeModal()
    } catch (err) {
      console.error(err);
      Alert.alert("Virhe", "Tapahtuman lisääminen epäonnistui.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.headerText}>{name}</ThemedText>

      {/* Näytä tämän organisaation tapahtumat kalenterissa -switch */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        <ThemedText style={{ marginRight: 8 }}>
          Näytä kalenterissa
        </ThemedText>
        <Switch value={isSubscribed} onValueChange={toggleSubscription} />
      </View>

      {/* EventList näyttää modaalissa "Lisää omaan kalenteriin" -napin,
          koska onImport on annettu */}
      <EventList events={events} onImport={handleImport} />
    </ThemedView>
  );
}
