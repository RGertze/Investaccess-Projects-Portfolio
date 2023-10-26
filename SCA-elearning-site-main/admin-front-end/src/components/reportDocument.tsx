
//#########################################
//        REACT IMPORTS
//#########################################

import React from "react";
const { Document, Page, View, Text, StyleSheet } = await import("@react-pdf/renderer");

//#########################################
//        INTERFACE IMPORTS
//#########################################
import { ICourseMark, IStudentAll } from "../interfaces";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IProps {
    term: number,
    year: number,
    student: IStudentAll,
    courseMarks: ICourseMark[]
}

//#########################################
//        CLASS DEFINITION
//#########################################

const ReportDocument = (props: IProps) => (
    <Document>
        <Page style={{ padding: "10px" }}>
            {
                //#########################################
                //        HEADER
                //#########################################
            }
            <View style={[styles.rowFlex, styles.header]}>
                <Text style={styles.headerText}>Report Card</Text>
            </View>

            {
                //#########################################
                //        DETAILS SECTION
                //#########################################
            }
            <View style={[styles.details, styles.rowFlex]}>
                <View style={[styles.detailItems, styles.rowFlex, { width: "45%" }]}>
                    <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>Name:</Text>
                    <Text style={{ paddingLeft: "10px" }}>{props.student.Student_First_Name} {props.student.Student_Surname_Name}</Text>
                </View>

                <View style={[styles.detailItems, styles.rowFlex, { width: "27.5%" }]}>
                    <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>Term:</Text>
                    <Text style={{ paddingLeft: "10px" }}>{props.term}</Text>
                </View>

                <View style={[styles.detailItems, styles.rowFlex, { width: "27.5%" }]}>
                    <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>Year:</Text>
                    <Text style={{ paddingLeft: "10px" }}>{props.year}</Text>
                </View>
            </View>

            {
                //#########################################
                //        MARKS SECTION
                //#########################################
            }
            <View style={[styles.rowFlex, styles.tableValues, { fontSize: "20px", fontWeight: "bold" }]}>
                <Text style={{ width: "50%", textAlign: "center" }}>Course</Text>
                <Text style={{ width: "50%", textAlign: "center" }}>Mark Obtained %</Text>
            </View>

            {
                props.courseMarks.map(mark => {
                    return (
                        <View style={[styles.rowFlex, styles.tableValues]}>
                            <Text style={{ width: "50%", textAlign: "center" }}>{mark.Course_Name}</Text>
                            <Text style={{ width: "50%", textAlign: "center" }}>{mark.Student_Course_Mark}</Text>
                        </View >
                    );
                })
            }

        </Page>
    </Document>
);

const styles = StyleSheet.create({
    rowFlex: {
        display: "flex",
        flexDirection: "row",
    },

    header: {
        width: "90%",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "30px",
        paddingBottom: "15px",
        borderBottom: "1px solid black"
    },
    headerText: {
        width: "60%",
        fontSize: "25px",
        fontWeight: "bold",
        textAlign: "center"
    },

    details: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "30px"
    },
    detailItems: {
        textAlign: "center",
        justifyContent: "center"
    },

    tableValues: {
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottom: "1px solid black",
        paddingTop: "15px",
        paddingBottom: "15px"
    }
});

export default ReportDocument;
