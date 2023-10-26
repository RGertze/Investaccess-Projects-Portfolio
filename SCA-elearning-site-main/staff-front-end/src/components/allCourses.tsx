// react imports
import React, { Component } from "react";
import { ICourseDetails } from "../interfaces";

// component imports
import CourseGradeCard from "./courseGradeCard";

// interface/enum imports

// interface definitions
interface IProps {
    token: string,
    staffID: string,
    viewCourse(course: ICourseDetails): void
}


class AllCourses extends Component<IProps, {}> {
    render() {
        return (
            <div id="all-courses-container">
                <CourseGradeCard grade={1} token={this.props.token} staffID={this.props.staffID} viewCourse={this.props.viewCourse} />
                <CourseGradeCard grade={2} token={this.props.token} staffID={this.props.staffID} viewCourse={this.props.viewCourse} />
                <CourseGradeCard grade={3} token={this.props.token} staffID={this.props.staffID} viewCourse={this.props.viewCourse} />
            </div>
        );
    }
}

export default AllCourses;
