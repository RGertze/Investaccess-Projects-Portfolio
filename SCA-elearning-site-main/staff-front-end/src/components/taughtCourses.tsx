
// ##########    REACT IMPORTS    ############

import React, { Component } from "react";

// ##########    CONNECTION IMPORTS    ############

import Connection, { GET_TYPE } from "../connection";

// ##########    COMPONENT IMPORTS    ############

import CourseCard from "./courseCard";

// ##########    INTERFACE/ENUM IMPORTS    ############

import { ICourseDetails, ICourseTaught, IGetTaughtCoursesDetailed, IResponse } from "../interfaces"
import EmptyListNotification from "./emptyListNotification/emptyListNotification";



// ######################################
//          INTERFACE DEFINITIONS
// ######################################

interface IState {
    taughtCourses: ICourseTaught[],
}

interface IProps {
    token: string,
    staffID: string,

    viewCourse(course: ICourseTaught): void
}

// ######################################
// ######################################



// ######################################
//          CLASS DEFINITION
// ######################################

class TaughtCourses extends Component<IProps, IState> {

    // ##########     CONSTRUCTOR    ############

    constructor(props: IProps) {
        super(props);

        this.state = {
            taughtCourses: []
        }
    }


    //############      COMP DID MOUNT FUNC     ##################

    componentDidMount() {
        this.getTaught();
    }


    //############      GET TAUGHT FUNC     ##################

    getTaught = async () => {
        let data: IGetTaughtCoursesDetailed = {
            staffID: this.props.staffID,
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_TAUGHT_DETAILED, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ taughtCourses: [] });
        } else {
            let courses: ICourseTaught[] = result.data;
            this.setState({ taughtCourses: courses });
        }
    }


    // ##########    RENDER FUNC    ############

    render() {
        return (
            <div id="course-enrolled-container">
                {
                    this.state.taughtCourses.map((course) => {
                        return (
                            <CourseCard taught={true} key={course.Course_ID} course={course} viewCourse={this.props.viewCourse} />
                        );
                    })
                }
                {
                    this.state.taughtCourses.length === 0 &&
                    <div className="center" style={{ gridColumn: "1/3", width: "90%" }}>
                        <EmptyListNotification message={"No courses found"} />
                    </div>

                }
            </div>
        );
    }

}

export default TaughtCourses;

// ######################################
// ######################################
