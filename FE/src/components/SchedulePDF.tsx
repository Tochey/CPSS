import React from "react"
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"

const SchedulePDF = () => {
    const styles = StyleSheet.create({
        page: {
            backgroundColor: "white",
        },

        headerText: {
            fontSize: 20,
            textAlign: "center",
            margin: 10,
            padding: 10,
            fontWeight: "bold",
        },
    })
    return (
        <Document>
            <Page size='A4' style={styles.page}>
                <View style={styles.headerText}>
                    <Text>CSC 520 CS Capstone Project Presentations</Text>
                    <br />
                    <Text>December 12, 2023</Text>
                </View>
            </Page>
        </Document>
    )
}

export default SchedulePDF
