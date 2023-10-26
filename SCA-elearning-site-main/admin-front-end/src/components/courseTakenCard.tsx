
//##################################
//      REACT IMPORTS
//##################################

import React, { Component } from "react";


//##################################
//      INTERFACE IMPORTS
//##################################

import { ICourseTakenByStudent } from "../interfaces";


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IProps {
    course: ICourseTakenByStudent
}


//##################################
//      CLASS DEFINITION
//##################################

class CourseTakenCard extends Component<IProps> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="course-taken-card-container">
                <p className="course-taken-card-values" >ID: {this.props.course.Course_ID}</p>
                <p className="course-taken-card-values" >{this.props.course.Course_Name}</p>
                <p className="course-taken-card-values" >{this.props.course.Course_Desc}</p>
            </div>
        );
    }
}

export default CourseTakenCard;
