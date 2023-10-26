
// ##########    REACT IMPORTS    ############

import React, { Component } from "react";

// ##########    CONNECTION IMPORTS    ############

import Connection, { GET_TYPE } from "../connection";

// ##########    COMPONENT IMPORTS    ############

import CourseCard from "./courseCard";

// ##########    INTERFACE/ENUM IMPORTS    ############

import { ICourseDetails, IEnrolledCourses, IGetEnrolled, IResponse } from "../interfaces"
import EmptyListNotification from "../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";



// ######################################
//          INTERFACE DEFINITIONS
// ######################################

interface IState {
    enrolledCourses: IEnrolledCourses[],
}

interface IProps {
    token: string,
    username: string,

    viewCourse(course: ICourseDetails): void
}

// ######################################
// ######################################



// ######################################
//          CLASS DEFINITION
// ######################################

class EnrolledCourses extends Component<IProps, IState> {

    // ##########     CONSTRUCTOR    ############

    constructor(props: IProps) {
        super(props);

        this.state = {
            enrolledCourses: []
        }
    }


    //############      COMP DID MOUNT FUNC     ##################

    componentDidMount() {
        this.getEnrolled();
    }


    //############      GET ENROLLED FUNC     ##################

    getEnrolled = async () => {
        let data: IGetEnrolled = {
            username: this.props.username,
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ENROLLED, this.props.token, data);
        console.log(result.data);

        if (result.stat !== "ok") {
            this.setState({ enrolledCourses: [] });
        } else {
            let courses: IEnrolledCourses[] = result.data;
            this.setState({ enrolledCourses: courses });
        }
    }


    // ##########    RENDER FUNC    ############

    render() {
        return (
            <div id="course-enrolled-container">
                {
                    this.state.enrolledCourses.map((course) => {
                        return (
                            <CourseCard key={course.Course_ID} course={course} viewCourse={this.props.viewCourse} />
                        );
                    })
                }
                {
                    this.state.enrolledCourses.length === 0 &&
                    <div className="center" style={{ gridColumn: "1/3", width: "90%" }}>
                        <EmptyListNotification message={"No courses found"} />
                    </div>
                }
            </div>
        );
    }

}

export default EnrolledCourses;

// ######################################
// ######################################
