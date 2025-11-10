// styles/calendarStyle.ts
import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HOUR_HEIGHT = 60;

export default StyleSheet.create({
  // --- Yleiset kontit ---
  container: {
    flex: 1,
  },

  // --- Kuukausi- ja päivä/viikkonäkymän toggle ---
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

  // --- Kuukausikalenterin valitun päivän näyttö ---
  selectedDateContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 16,
  },

  // --- Viikkonäkymän rakenne ---
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

  // --- Aikajanan tunnit ---
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

  // --- Tapahtumalaatikot ---
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

  // --- Punainen nykyhetken viiva ---
  nowLine: {
    position: 'absolute',
    left: 35,
    right: 0,
    height: 2,
    backgroundColor: 'red',
    zIndex: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },

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

