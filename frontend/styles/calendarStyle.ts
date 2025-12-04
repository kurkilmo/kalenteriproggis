// styles/calendarStyle.ts
// Kalenterinäkymien yhteiset tyylit (päivä-, viikko- ja kuukausinäkymä)

import { StyleSheet, Dimensions } from 'react-native';

// Näytön leveys ja tunnin korkeus, joita käytetään laskennassa
const SCREEN_WIDTH = Dimensions.get('window').width;
export const HOUR_HEIGHT = 60; // MUISTA MUUTTAA MYÖS KOMPONENTEISSA!!!

// --- Yleiset tyylit kaikille kalenterinäkymille ---
export default StyleSheet.create({
  // Pääkontti, joka täyttää koko näkymän
  container: {
    flex: 1,
  },

  // Kuukausi- ja päivä/viikkonäkymän vaihtonapit
  toggleContainer: {
    padding: 10,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Valitun päivämäärän näyttö (jos käytössä)
  selectedDateContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 16,
  },

  // Viikkonäkymän rakenteen perusmuoto
  weekScroll: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  weekColumn: {
    width: SCREEN_WIDTH / 7,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  weekHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  weekHeaderText: {
    fontWeight: '600',
  },

  // Aikajanan tunnit (tuntirivit ja viivat)
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HOUR_HEIGHT,
  },
  hourLabel: {
    width: 35,
    fontSize: 10,
    color: '#666',
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },

  // Tapahtumaruudut aikajanalla
  eventBox: {
    position: 'absolute',
    width: 70,
    borderRadius: 6,
    padding: 3,
  },
  eventText: {
    fontSize: 10,
    color: '#fff',
  },

  // Punainen viiva, joka näyttää nykyisen kellonajan
  nowLine: {
    position: 'absolute',
    left: 35,
    right: 0,
    height: 2,
    backgroundColor: 'red',
    zIndex: 10,
  },

  // Nappien sijoittelu vierekkäin yläosassa
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },

  // Pienempi nappityyli viikko/päivä ja kuukausi -napeille
  smallButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

// --- Kuukausinäkymän omat tyylit ---
export const monthStyles = StyleSheet.create({
  // Koko kuukausinäkymän peruslayout
  container: {
    paddingVertical: 8,
    alignItems: 'center',
  },

  // Kuukauden otsikko (esim. "marraskuu 2025")
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'capitalize',
    textAlign: 'center',
  },

  // Päivien nimien rivin asettelu
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },

  // Kuukauden ruudukko, jossa päivät esitetään
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 320,
    alignSelf: 'center',
  },

  // Yksittäinen päivän solu ruudukossa
  dayCell: {
    width: 320 / 7 - 2,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 1,
  },
});

// --- Päivä- ja viikkonäkymien paikalliset tyylit ---
export const localStyles = StyleSheet.create({
  // Tuntirivit pystyakselilla
  hourRow: {
    flexDirection: 'row',
    height: HOUR_HEIGHT,
  },
  hourLabel: {
    width: 35,
    fontSize: 10,
    color: '#666',
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },

  // Tapahtumaruudut aikajanalla
  eventBox: {
    position: 'absolute',
    width: 70,
    borderRadius: 6,
    padding: 3,
  },
  eventText: {
    fontSize: 10,
    color: '#fff',
  },

  // Punainen "nykyhetki"-viiva
  nowLine: {
    position: 'absolute',
    left: 35,
    right: 0,
    height: 2,
    backgroundColor: 'red',
    zIndex: 10,
  },
});
