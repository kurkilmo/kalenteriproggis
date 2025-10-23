import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    searchContainer: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 10,
    },
    searchInputContainer: {
        backgroundColor: "#ddd",
        borderRadius: 10,
    },
    searchInput: {
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    itemText: {
        color: "black",
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: 280,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    modalText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "teal",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});
  