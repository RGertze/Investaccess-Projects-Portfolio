// react imports
import React, { Component } from "react";
import { IAssignmentMarksByCourse } from "../interfaces";

// interface/enum imports

// interface definitions
interface IProps {
    mark: IAssignmentMarksByCourse
}

class CourseMarksCard extends Component<IProps, {}> {
    render() {
        return (
            <div id="course-marks-card-container">
                <h4>{this.props.mark.Course_Assignment_Name}</h4>
                <h4>{this.props.mark.Course_Assignment_Marks_Available}</h4>
                <h4>{this.props.mark.Assignment_Mark}</h4>
            </div>
        );
    }
}

export default CourseMarksCard;
