import { StyleSheet } from 'react-native';

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
        borderRadius: 8,
        marginLeft: 20,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 0,
        minHeight: 0
    },

    button: {
        color: "black",
        fontSize: 15
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginVertical: 0,
        paddingVertical: 0,
        gap: 10,
        flexGrow: 0,
        marginLeft: 100
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
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: 280,
        alignItems: "center",
    },
    modalContentList: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: 280,
        alignItems: "center",
        maxHeight: "80%"
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "pink",
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 0,
        minHeight: 0
    },
    modalText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtonText: {
        fontSize: 16,
    },
    modalInput: {
        borderStyle: "solid",
        borderWidth: 1.5,
        borderColor: "#aaa"
    },
    groupForm: {
        marginTop: 10,
        width: "100%"
    }
});