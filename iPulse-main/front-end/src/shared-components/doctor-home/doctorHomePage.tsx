import { useEffect, useState } from "react";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { APPOINTMENT_STATUS, IAppointment, IAppointmentSlot } from "../../interfaces/appointment_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import PendingAppointmentsList from "../pending-appointment-card/pendingAppointmentsList";
import AppointmentCalendar from "../appointment-calendar/appointmentCalendar";
import "./doctorHomePage.css";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import CancelAppointment from "../cancel-appointment-component/cancelAppointmentComponent";
import { NOTIFICATIONS_TYPE } from "../../interfaces/general_enums";

interface IProps {
    context: IGlobalContext,
    doctorId: number
}

let DoctorHome = (props: IProps) => {

    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [myAppointments, setMyAppointments] = useState<IAppointment[]>([]);
    const [appointmentSlots, setAppointmentSlots] = useState<IAppointmentSlot[]>([]);
    const [newAppointmentDates, setNewAppointmentDates] = useState<Date[]>([new Date()]);

    const [showCancellingAppointment, setShowCancellingAppointment] = useState(false);
    const [appointmentBeingCancelled, setAppointmentBeingCancelled] = useState<IAppointment>();

    // COMPONENT DID MOUNT
    useEffect(() => {
        createNewAppointmentDates();
        getDoctorSlots();
        getAppointmentsForDoctor();
    }, []);

    //----   ON APPOINTMENT NOTIFICATION RECEIVED    ----
    useEffect(() => {
        if (props.context.newNotificationRecv) {
            if (props.context.newNotificationRecv.typeId === NOTIFICATIONS_TYPE.APPOINTMENT)
                getAppointmentsForDoctor();
        }
    }, [props.context.newNotificationRecv]);

    // GET ALL APPOINTMENTS FOR DOCTOR
    const getAppointmentsForDoctor = async () => {
        setLoadingAppointments(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_APPOINTMENTS_FOR_DOCTOR + props.doctorId, "");
        setLoadingAppointments(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("Failed to get all appointments: " + result.errorMessage, true);
            return;
        }
        setMyAppointments(result.data);
    }

    // APPROVE APPOINTMENT
    const approveAppointment = async (appointment: IAppointment) => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.APPROVE_APPOINTMENT, { appointmentId: appointment.appointmentId, patientId: appointment.patientId }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        getAppointmentsForDoctor();
        successToast("Appointment Approved", true);
    }

    // REJECT APPOINTMENT
    const rejectAppointment = async (appointment: IAppointment) => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REJECT_APPOINTMENT, { appointmentId: appointment.appointmentId, patientId: appointment.patientId }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        getAppointmentsForDoctor();
        successToast("Appointment Rejected", true);
    }

    //----   GET DOCTOR APPOINTMENT SLOTS   ----
    const getDoctorSlots = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_APPOINTMENT_SLOTS_FOR_DOCTOR + props.doctorId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            return;
        }
        setAppointmentSlots(result.data);
    }

    // CREATE NEW APPOINTMENT DATES
    const createNewAppointmentDates = () => {
        // get array numbers
        let days = [...Array(7).keys()];

        // get array of dates starting from current day
        let dates = days.map((value) => {
            let d = new Date();
            d.setDate(d.getDate() + value);
            return d;
        });

        setNewAppointmentDates(dates);
    }



    return (
        <div className="doctor-home-container">

            {
                loadingAppointments &&
                <Loading />
            }

            <h3>Calendar</h3>
            {
                // Doctor Calendar
                <div className="hor-center calendar-container">
                    <AppointmentCalendar bookOpenSlot={(slot, index) => { }} isPatient={false} patientId={0} appointments={myAppointments} openSlots={appointmentSlots} slotDates={newAppointmentDates}
                        reject={rejectAppointment}
                        approve={approveAppointment}
                        cancel={async (ap) => {
                            setAppointmentBeingCancelled(ap);
                            setShowCancellingAppointment(true);
                        }}
                    />
                </div>
            }

            <hr className="hor-center" style={{ width: "90%", height: "1px" }} />

            <h3>Pending Appointments</h3>
            {
                // Pending Appointments
                <div className="hor-center pending-appointments-container">
                    <PendingAppointmentsList approveAppointment={approveAppointment} rejectAppointment={rejectAppointment} appointments={myAppointments.filter(ap => ap.status === APPOINTMENT_STATUS.PENDING)} />
                </div>
            }

            {
                // Cancel appointment
                showCancellingAppointment &&
                <CancelAppointment
                    appointmentId={appointmentBeingCancelled ? appointmentBeingCancelled.appointmentId : 0}
                    appointmentStatus={appointmentBeingCancelled ? appointmentBeingCancelled.status : 0}
                    context={props.context}
                    userId={props.doctorId}
                    close={() => { setShowCancellingAppointment(false); setAppointmentBeingCancelled(undefined); }}
                    refresh={() => getAppointmentsForDoctor()}
                />
            }
        </div>
    );
}

export default DoctorHome;