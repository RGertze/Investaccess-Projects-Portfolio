
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        INTERFACE/ENUM IMPORTS
//#########################################

import { ICourseMark } from "../interfaces";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
}

interface IProps {
    courseMark: ICourseMark
}


//#########################################
//        CLASS DEFINITION
//#########################################

class AccountCourseMarkCard extends Component<IProps, IState> {

    render() {
        return (
            <div id="account-course-mark-card-container">
                <p style={{ gridColumn: 1 }} className="account-course-mark-card-values">{this.props.courseMark.Course_Name}</p>
                <p style={{ gridColumn: 2 }} className="account-course-mark-card-values">{this.props.courseMark.Student_Course_Mark}</p>
            </div>
        );
    }
}

export default AccountCourseMarkCard;
