// react imports
import DeleteForever from "@material-ui/icons/DeleteForever";
import React, { Component } from "react";
import Connection, { POST_TYPE } from "../connection";
import { ICourseAnnouncement, IDeleteCourseAnnouncement, IDeleteLink, IResponse } from "../interfaces";

// interface definitions
interface IProps {
    token: string,
    refreshAnnouncements(): void,
    announcement: ICourseAnnouncement
}

class CourseAnnouncement extends Component<IProps, {}> {

    deleteAnnouncement = async () => {
        let data: IDeleteCourseAnnouncement = {
            caID: this.props.announcement.Course_Announcement_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_COURSE_ANNOUNCEMENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        alert("announcement deleted!");
        this.props.refreshAnnouncements();
    }

    render() {
        return (
            <div id="course-announcement-container">
                <div id="course-announcement-details" className="title-col">
                    <h4>{new Date(this.props.announcement.Course_Announcement_Date).toDateString()}</h4>

                    <div className="center flex-row">
                        <DeleteForever className="resource-topic-header-button" onClick={() => this.deleteAnnouncement()} />
                    </div>
                </div>
                <div id="course-announcement-value">
                    <p>{this.props.announcement.Course_Announcement_Message}</p>
                </div>
            </div>
        );
    }
}

export default CourseAnnouncement;
