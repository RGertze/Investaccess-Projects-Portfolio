import { useEffect, useState } from "react";
import { APPOINTMENT_STATUS } from "../../interfaces/appointment_interfaces";
import { INotificationAppointment, INotificationProfileAccess } from "../../interfaces/notification_interfaces";
import { NOTIFICATIONS_TYPE, APPROVAL_STATUS } from "../../interfaces/general_enums";
import { IGlobalContext, INotification, IUser } from "../../interfaces/general_interfaces";
import "./notificationComponent.css";

interface IProps {
    notification: INotification,
}

const NotificationComponent = (props: IProps) => {

    const [content, setContent] = useState("");

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        let newContent = "";

        switch (props.notification.typeId) {
            case NOTIFICATIONS_TYPE.MESSAGE:
                let user: IUser = JSON.parse(props.notification.content);
                newContent = `New message received from ${user.firstName} ${user.lastName}.`;
                break;

            case NOTIFICATIONS_TYPE.APPOINTMENT:
                let appointment: INotificationAppointment = JSON.parse(props.notification.content);
                let dateParts = appointment.date.split("/");
                let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                if (appointment.status === APPOINTMENT_STATUS.PENDING) {
                    newContent = `${appointment.firstName} ${appointment.lastName} has requested an appointment for ${date} at ${appointment.startTime} to ${appointment.endTime}`;
                }
                if (appointment.status === APPOINTMENT_STATUS.APPROVED) {
                    newContent = `${appointment.firstName} ${appointment.lastName} has approved your appointment for ${date} at ${appointment.startTime} to ${appointment.endTime}`;
                }
                if (appointment.status === APPOINTMENT_STATUS.REJECTED) {
                    newContent = `${appointment.firstName} ${appointment.lastName} has rejected your appointment for ${date} at ${appointment.startTime} to ${appointment.endTime}`;
                }
                if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
                    newContent = `${appointment.firstName} ${appointment.lastName} has canceled your appointment for ${date} at ${appointment.startTime} to ${appointment.endTime}`;
                }
                break;

            case NOTIFICATIONS_TYPE.PROFILE_ACCESS:
                let accessInfo: INotificationProfileAccess = JSON.parse(props.notification.content);
                if (accessInfo.status === APPROVAL_STATUS.REJECTED) {
                    newContent = `${accessInfo.firstName} ${accessInfo.lastName} has rejected your request to access their profile.`;
                }
                if (accessInfo.status === APPROVAL_STATUS.PENDING) {
                    newContent = `${accessInfo.firstName} ${accessInfo.lastName} (${accessInfo.email}) has requested to access your profile.`;
                }
                if (accessInfo.status === APPROVAL_STATUS.APPROVED) {
                    newContent = `${accessInfo.firstName} ${accessInfo.lastName} has approved your request to access their profile.`;
                }
                break;
        }

        setContent(newContent);
    }, []);

    return (
        <div className="notification-container hor-center rounded">
            <div className="notification-header vert-flex space-evenly">
                <h5>{new Date(props.notification.dateSent).toDateString()} </h5>
                <h5>{props.notification.dateSent.substring(11)}</h5>
            </div>

            <div className="notification-body">
                <p>{content}</p>
            </div>
        </div>
    );
}

export default NotificationComponent;