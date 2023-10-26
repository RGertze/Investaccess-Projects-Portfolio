// react imports
import React, { Component } from "react";

// interface/enum imports
import { ICourseDetails, ICourseTaught } from "../interfaces";

// interface definitions
interface IProps {
    taught: boolean,
    course: ICourseTaught,
    viewCourse(course: ICourseDetails): void
}

class CourseCard extends Component<IProps, {}> {
    render() {
        return (
            <div id="course-card-container" onClick={() => { this.props.viewCourse(this.props.course) }}>
                <div id="course-card-id" >
                    <h1>{this.props.course.Course_ID}</h1>
                </div>

                <div id="course-card-info">
                    <h4 id="course-card-name">{this.props.course.Course_Name}</h4>
                    {
                        !this.props.taught &&
                        <p>Staff: {this.props.course.Staff_Name}</p>
                    }
                    {
                        this.props.taught &&
                        <p>Grade: {this.props.course.Course_Grade}</p>
                    }
                </div>
            </div>
        );
    }
}

export default CourseCard;
