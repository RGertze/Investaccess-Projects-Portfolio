
// ##########    REACT IMPORTS    ############

import React, { Component } from "react";

// ##########    COMPONENT IMPORTS    ############

import CourseCard from "./courseCard";

// ##########    INTERFACE/ENUM IMPORTS    ############

import { ICourseDetails, ICoursesByGrade, IGetCoursesByGrade, IResponse } from "../interfaces"
import Connection, { GET_TYPE } from "../connection";



// ######################################
//          INTERFACE DEFINITIONS
// ######################################

interface IState {
    collapsed: boolean,
    courses: ICoursesByGrade[]
}
interface IProps {
    token: string,
    staffID: string,
    grade: number,
    viewCourse(course: ICourseDetails): void
}

// ######################################
// ######################################



// ######################################
//          CLASS DEFINITION
// ######################################

class CourseGradeCard extends Component<IProps, IState> {

    // ##########     CONSTRUCTOR    ############

    constructor(props: IProps) {
        super(props);

        this.state = {
            collapsed: true,
            courses: []
        }
    }


    // ##########    TOGGLE COLLAPSE FUNC    ############

    toggleCollapse = async () => {
        let courses: ICoursesByGrade[] = [];

        //##  GET COURSES BY GRADE ##
        if (this.state.courses.length === 0) {
            let data: IGetCoursesByGrade = {
                grade: this.props.grade
            }

            let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_BY_GRADE, this.props.token, data);

            if (result.stat !== "ok") {
                alert(result.error);
            } else {
                courses = result.data;
            }
        } else {
            courses = this.state.courses.slice();
        }

        let collapsed = !this.state.collapsed;
        this.setState({ collapsed: collapsed, courses: courses });
    }


    // ##########    RENDER FUNC    ############

    render() {
        return (
            <div id="course-grade-card-container">
                <h2 id="course-grade-card-toggle" style={{ gridColumn: "1/3" }} onClick={this.toggleCollapse}>Grade {this.props.grade}</h2>
                {!this.state.collapsed &&
                    this.state.courses.map((course) => {
                        return (
                            <CourseCard taught={false} key={course.Course_ID} course={course} viewCourse={this.props.viewCourse} />
                        );
                    })
                }
            </div>
        );
    }
}

export default CourseGradeCard;

// ######################################
// ######################################
