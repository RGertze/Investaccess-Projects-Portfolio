import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { GlobalContext } from "../../contexts/globalContext";
import { IAppointment } from "../../interfaces/appointment_interfaces";
import AppointmentCard from "../appointment-card/appointmentCard";
import Loading from "../loading-component/loading";
import "./pendingAppointmentsList.css";

interface IProps {
    appointments: IAppointment[],

    rejectAppointment(appointment: IAppointment),
    approveAppointment(appointment: IAppointment)

}

let PendingAppointmentsList = (props: IProps) => {

    return (
        <GlobalContext.Consumer>
            {context => (
                <div className="hor-center vert-flex space-evenly pending-appointment-list-container">
                    {
                        props.appointments.map((ap, index) => {
                            let dateParts = ap.date.split("/");
                            let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                            let time = `${ap.startTime} ${ap.endTime}`;
                            return (
                                <div className="pending-appointment-list-item">
                                    <AppointmentCard
                                        user={{
                                            email: ap.patientEmail,
                                            name: `${ap.patientFirstname} ${ap.patientLastname}`,
                                            profilePicPath: ap.patientProfilePic
                                        }}
                                        appointment={{
                                            date: date,
                                            time: time,
                                            description: ap.description,
                                            status: ap.status,
                                            title: ap.title
                                        }}
                                        context={context}
                                        approve={async () => {
                                            await props.approveAppointment(ap);
                                        }}
                                        reject={async () => {
                                            await props.rejectAppointment(ap);
                                        }}
                                    />
                                </div>
                            );
                        })
                    }
                    {
                        props.appointments.length === 0 &&
                        <h5>Nothing to show!</h5>
                    }
                </div>
            )}
        </GlobalContext.Consumer>
    );
}

export default PendingAppointmentsList;