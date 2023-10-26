
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { POST_TYPE } from "../connection";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { ICourseTaughtByStaff, IRemoveCourseTaught, IResponse } from "../interfaces";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IProps {
    token: string,
    course: ICourseTaughtByStaff,
    staffID: number,
    refreshCourseTaught(): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class CourseTaughtCard extends Component<IProps> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);
    }


    //----------------------------------
    //      REMOVE COURSE TAUGHT
    //----------------------------------

    removeCourseTaught = async () => {
        let data: IRemoveCourseTaught = {
            courseID: this.props.course.Course_ID,
            staffID: this.props.staffID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.REMOVE_COURSE_TAUGHT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        alert("successfully removed course");
        this.props.refreshCourseTaught();
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="course-taught-card-container">
                <div id="course-taught-card">
                    <p className="course-taught-card-values" style={{ gridColumn: 1 }}>ID: {this.props.course.Course_ID}</p>
                    <p className="course-taught-card-values" style={{ gridColumn: 2 }}>Name: {this.props.course.Course_Name}</p>
                    <p className="course-taught-card-values" style={{ gridColumn: 3 }}>Grade: {this.props.course.Course_Grade}</p>
                </div>

                <div id="course-taught-card-remove" onClick={this.removeCourseTaught}>
                    <h4>remove</h4>
                </div>
            </div>
        );
    }
}

export default CourseTaughtCard;
