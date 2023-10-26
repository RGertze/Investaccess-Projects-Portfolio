// react imports
import React, { Component } from "react";
import { ICourseAnnouncement } from "../interfaces";

// interface definitions
interface IProps {
    announcement: ICourseAnnouncement
}

class CourseAnnouncement extends Component<IProps, {}> {
    render() {
        return (
            <div id="course-announcement-container">
                <div id="course-announcement-details">
                    <h4>Added on: {new Date(this.props.announcement.Course_Announcement_Date).toDateString()}</h4>
                </div>
                <div id="course-announcement-value">
                    <p>{this.props.announcement.Course_Announcement_Message}</p>
                </div>
            </div>
        );
    }
}

export default CourseAnnouncement;
