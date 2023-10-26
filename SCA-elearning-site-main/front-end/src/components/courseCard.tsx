// react imports
import React, { Component } from "react";

// interface/enum imports
import { ICourseDetails } from "../interfaces";

// interface definitions
interface IProps {
    course: ICourseDetails,
    viewCourse(course: ICourseDetails): void
}

class CourseCard extends Component<IProps, {}> {
    render() {
        return (
            <div id="course-card-container" onClick={() => { this.props.viewCourse(this.props.course) }}>
                <div id="course-card-id">
                    <h1>{this.props.course.Course_ID}</h1>
                </div>

                <div id="course-card-info">
                    <h4 id="course-card-name">{this.props.course.Course_Name}</h4>
                    <p>{this.props.course.Course_Desc}</p>
                </div>
            </div>
        );
    }
}

export default CourseCard;
