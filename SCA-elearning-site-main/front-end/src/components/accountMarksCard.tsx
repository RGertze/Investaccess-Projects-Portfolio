
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import AccountCourseMarkCard from "./accountCourseMarkCard";

//#########################################
//        INTERFACE/ENUM IMPORTS
//#########################################

import { ICourseMark, IGetCourseMarks, IResponse } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    courseMarks: ICourseMark[]
}

interface IProps {
    token: string,
    studentID: number
}


//#########################################
//        CLASS DEFINITION
//#########################################

class AccountMarksCard extends Component<IProps, IState> {

    //#########################################
    //        CONSTRUCTOR
    //#########################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            courseMarks: []
        }
    }


    //#########################################
    //        COMPONENT DID MOUNT
    //#########################################

    componentDidMount() {
        this.getMarksForCourse();
    }


    //#########################################
    //        GET COURSE MARKS
    //#########################################

    getMarksForCourse = async () => {
        let data: IGetCourseMarks = {
            username: this.props.studentID.toString()
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_MARKS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ courseMarks: result.data });
        }
    }

    //#########################################
    //#########################################


    //#########################################
    //        RENDER METHOD
    //#########################################

    render() {
        return (
            <div id="account-marks-card-container">
                <h2 id="account-marks-card-title">Course Marks</h2>

                <div id="account-marks-card-header-container">
                    <h3 style={{ gridColumn: 1 }} className="account-marks-card-header-value">Course</h3>
                    <h3 style={{ gridColumn: 2 }} className="account-marks-card-header-value">Mark Obtained %</h3>
                </div>

                {

                    //#######   NO RECORDS TO DISPLAY    #######

                    this.state.courseMarks.length === 0 &&
                    <h3 style={{ textAlign: "center" }}>No records found!</h3>

                }

                {
                    this.state.courseMarks.map((courseMark) => {
                        return (
                            <AccountCourseMarkCard courseMark={courseMark} />
                        );
                    })
                }
            </div>
        );
    }
}

export default AccountMarksCard;
