import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  headerDay: {
    alignItems: 'center',
  },
  headerDayName: {
    color: '#00adf5',
    fontWeight: 'bold',
  },
  headerDayNumber: {
    color: '#999',
    fontSize: 12,
  },
  weekScrollView: {
    flexDirection: 'row',
  },
  weekDayColumn: {
    width: SCREEN_WIDTH / 7,
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
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
  selectedDateContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 16,
  },
  weekDayTitle: {
    textAlign: 'center',
    marginVertical: 4,
  },
});
