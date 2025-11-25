import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 30
    },
    title: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        backgroundColor: "pink",
        paddingVertical: 12,
        paddingHorizontal: 15,
        paddingTop: 4,
        borderRadius: 8,
        marginLeft: 20,
        width: "22%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 0,
        minHeight: 0,
        ...Platform.select({
            ios: {
                width: "28%",
            },
            android: {
                width: "28%",
            },
        }),

    },

    button: {
        color: "white",
        fontSize: 15,
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginVertical: 0,
        paddingVertical: 0,
        gap: 10,
        flexGrow: 0,
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
        backgroundColor: 'pink',
        padding: 10,
        marginVertical: 6,
        borderRadius: 6,
    },
    itemText: {
        color: 'black',
        fontSize: 16,
    },
});