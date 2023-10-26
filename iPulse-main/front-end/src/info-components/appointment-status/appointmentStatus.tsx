import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { APPOINTMENT_STATUS, IAppointment } from "../../interfaces/appointment_interfaces";
import { IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./appointmentStatus.css";

const AppointmentStatus = () => {

    let { appointmentId, code } = useParams();

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState<IAppointment>();

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAppointment();
    }, []);

    //----   GET APPOINTMENT DETAILS   ----
    const getAppointment = async () => {
        setLoading(true);
        let qry = `?id=${appointmentId}&code=${code}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_APPOINTMENT_VIA_CODE + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        setAppointment(result.data);
    }

    return (
        <div className="rounded shadow hor-center appointment-status-container">
            {
                (!loading && appointment) &&
                <>
                    <h3 className="appointment-status-title">Appointment {appointment.status === APPOINTMENT_STATUS.APPROVED ? "Approved" : "Rejected"}!</h3>
                    <p>
                        Appointment for <u>{appointment.patientFirstname} {appointment.patientLastname}</u> on
                        <br />
                        <b>{appointment.date} {appointment.startTime} -- {appointment.endTime}</b>
                        <br />
                        has successfully been <b>{appointment.status === APPOINTMENT_STATUS.APPROVED ? "approved" : "rejected"}</b>
                    </p>
                </>
            }

            {
                (!loading && !appointment) &&
                <>
                    <h3 className="appointment-status-title-error">Failed to load appointment details!</h3>
                    <p>Try again later.</p>
                </>
            }

            {
                loading &&
                <Loading color="blue" />
            }
        </div>
    );
}

export default AppointmentStatus;