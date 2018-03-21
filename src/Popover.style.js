import { StyleSheet, Platform } from "react-native";
  
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0,
        backgroundColor: "transparent",
    },
    containerVisible: {
        opacity: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    popover: {
        ...Platform.select({
            ios: {
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                shadowOpacity: 0.4,
                backgroundColor: "transparent",
            },
        }),
        position: "absolute",
    },
    content: {
        flexDirection: "column",
        position: "absolute",
        backgroundColor: "#f2f2f2",
        padding: 8,
    },
    arrow: {
        position: "absolute",
        borderTopColor: "#f2f2f2",
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
    },
});

export default styles;