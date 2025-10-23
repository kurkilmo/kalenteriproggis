import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    title: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,
        marginBottom: 10,
    },
    searchInputContainer: {
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    listsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        gap: 10,
    },
    listBox: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 8,
        padding: 8,
    },
    listTitle: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    item: {
        backgroundColor: 'teal',
        padding: 10,
        marginVertical: 6,
        borderRadius: 6,
    },
    itemText: {
        color: 'black',
        fontSize: 16,
    },
});