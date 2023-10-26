import { useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Form, FormGroup, Modal, ToggleButton } from "react-bootstrap";
import { Grid1x2, List } from "react-bootstrap-icons";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { APPOINTMENT_STATUS, IAppointment } from "../../interfaces/appointment_interfaces";
import { IDoctorAppointment } from "../../interfaces/doctor_interfaces";
import { APPROVAL_STATUS } from "../../interfaces/general_enums";
import { IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import AppointmentCard from "../../shared-components/appointment-card/appointmentCard";
import CancelAppointment from "../../shared-components/cancel-appointment-component/cancelAppointmentComponent";
import Loading from "../../shared-components/loading-component/loading";
import TableComponent, { IColumnData, TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import "./doctorAppointmentsPage.css";

interface IProps {
    context: IGlobalContext
}

const DoctorAppointmentsPage = (props: IProps) => {
    const [isListView, setIsListView] = useState<boolean>(true);

    const [appointmentBeingCancelled, setAppointmentBeingCancelled] = useState<IDoctorAppointment>();

    const [appointmentHistory, setAppointmentHistory] = useState<IDoctorAppointment[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<IDoctorAppointment[]>([]);
    const [pendingAppointments, setPendingAppointments] = useState<IDoctorAppointment[]>([]);

    const [loadingPendingAppointments, setLoadingPendingAppointments] = useState(false);
    const [loadingUpcomingAppointments, setLoadingUpcomingAppointments] = useState(false);
    const [loadingAppointmentHistory, setLoadingAppointmentHistory] = useState(false);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getPendingAppointments();
        getUpcomingAppointments();
        getAppointmentHistory();
    }, []);

    //----   GET PENDING APPOINTNMENTS   ----
    const getPendingAppointments = async () => {
        setLoadingPendingAppointments(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PENDING_APPOINTMENTS_FOR_DOCTOR + props.context.userId, "");
        setLoadingPendingAppointments(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        console.log(result.data);
        setPendingAppointments(result.data);
    }

    //----   GET UPCOMING APPOINTNMENTS   ----
    const getUpcomingAppointments = async () => {
        setLoadingUpcomingAppointments(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_UPCOMING_APPOINTMENTS_FOR_DOCTOR + props.context.userId, "");
        setLoadingUpcomingAppointments(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        console.log(result.data);
        setUpcomingAppointments(result.data);
    }

    //----   GET APPOINTNMENT HISTORY   ----
    const getAppointmentHistory = async () => {
        setLoadingAppointmentHistory(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_APPOINTMENT_HISTORY_FOR_DOCTOR + props.context.userId, "");
        setLoadingAppointmentHistory(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        console.log(result.data);
        setAppointmentHistory(result.data);
    }

    // APPROVE APPOINTMENT
    const approveAppointment = async (appointment: IDoctorAppointment) => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.APPROVE_APPOINTMENT, { appointmentId: appointment.appointmentId, patientId: appointment.patientId }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        getPendingAppointments();
        getUpcomingAppointments();
        successToast("Appointment Approved", true);
    }

    // REJECT APPOINTMENT
    const rejectAppointment = async (appointment: IDoctorAppointment) => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REJECT_APPOINTMENT, { appointmentId: appointment.appointmentId, patientId: appointment.patientId }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        getPendingAppointments();
        getAppointmentHistory();
        successToast("Appointment Rejected", true);
    }

    return (
        <div className="appointments-page-container full-size vert-flex space-evenly">
            <h1>Appointments</h1>

            <div className="vert-flex justify-end appointments-view-toggle">
                <ButtonGroup>
                    <ToggleButton
                        value="0"
                        type="radio"
                        variant="outline-secondary"
                        checked={isListView}
                        onClick={() => setIsListView(true)}
                    >
                        <List className="icon-sm" />
                    </ToggleButton>
                    <ToggleButton
                        value="1"
                        type="radio"
                        variant="outline-secondary"
                        checked={isListView === false}
                        onClick={() => { console.log("hi"); setIsListView(false); }}
                    >
                        <Grid1x2 className="icon-sm" />
                    </ToggleButton>
                </ButtonGroup>
            </div>

            {
                // Pending appointments

                isListView &&
                <TableComponent
                    title={"Pending Appointments"}
                    titleCol={props.context.theme.primary}
                    titleBgCol={props.context.theme.tertiary}
                    context={props.context}
                    ids={[...pendingAppointments]}
                    headerValues={["", "Email", "Name", "Title", "Description", "Date", "Time", ""]}
                    data={pendingAppointments.map((ap, index) => {
                        let dateParts = ap.date.split("/");
                        let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                        let time = `${ap.startTime} to ${ap.endTime}`;
                        let colVals: IColumnData[] = [
                            { type: TABLE_DATA_TYPE.AVATAR, value: ap.profilePicPath },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.email },
                            { type: TABLE_DATA_TYPE.STRING, value: `${ap.firstName} ${ap.lastName}` },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.title },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.description },
                            { type: TABLE_DATA_TYPE.STRING, value: date },
                            { type: TABLE_DATA_TYPE.STRING, value: time },
                        ];
                        if (ap.status === APPROVAL_STATUS.APPROVED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_SUCCESS, value: "approved" });
                        }
                        if (ap.status === APPROVAL_STATUS.PENDING) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_WARNING, value: "pending" });
                        }
                        if (ap.status === APPROVAL_STATUS.REJECTED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_DANGER, value: "rejected" });
                        }

                        if (((ap.status === APPROVAL_STATUS.APPROVED || (ap.status === APPROVAL_STATUS.PENDING && props.context.userType === UserType.PATIENT))
                            && Date.parse(`${date} ${time.substring(0, 5)}`) > Date.now())) {
                            colVals.push({
                                type: TABLE_DATA_TYPE.BADGE_DANGER, value: "cancel", callback: async () => {
                                    setAppointmentBeingCancelled(ap);
                                }
                            });
                        }
                        return {
                            colValues: colVals
                        };
                    })}
                    loading={loadingPendingAppointments}
                    onApprove={approveAppointment}
                    onReject={rejectAppointment}
                />
            }

            {
                // upcoming appointments

                isListView &&
                <TableComponent
                    title={"Upcoming Appointments"}
                    titleCol={props.context.theme.primary}
                    titleBgCol={props.context.theme.tertiary}
                    context={props.context}
                    ids={[...upcomingAppointments]}
                    headerValues={["", "Email", "Name", "Title", "Description", "Date", "Time", "", ""]}
                    data={upcomingAppointments.map((ap, index) => {
                        let dateParts = ap.date.split("/");
                        let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                        let time = `${ap.startTime} to ${ap.endTime}`;
                        let colVals: IColumnData[] = [
                            { type: TABLE_DATA_TYPE.AVATAR, value: ap.profilePicPath },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.email },
                            { type: TABLE_DATA_TYPE.STRING, value: `${ap.firstName} ${ap.lastName}` },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.title },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.description },
                            { type: TABLE_DATA_TYPE.STRING, value: date },
                            { type: TABLE_DATA_TYPE.STRING, value: time },
                        ];
                        if (ap.status === APPROVAL_STATUS.APPROVED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_SUCCESS, value: "approved" });
                        }
                        if (ap.status === APPROVAL_STATUS.PENDING) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_WARNING, value: "pending" });
                        }
                        if (ap.status === APPROVAL_STATUS.REJECTED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_DANGER, value: "rejected" });
                        }

                        if (((ap.status === APPROVAL_STATUS.APPROVED || (ap.status === APPROVAL_STATUS.PENDING && props.context.userType === UserType.PATIENT))
                            && Date.parse(`${date} ${time.substring(0, 5)}`) > Date.now())) {
                            colVals.push({
                                type: TABLE_DATA_TYPE.BADGE_DANGER, value: "cancel", callback: async () => {
                                    setAppointmentBeingCancelled(ap);
                                }
                            });
                        }
                        return {
                            colValues: colVals
                        };
                    })}
                    loading={loadingUpcomingAppointments}
                />
            }

            {
                // appointment history

                isListView &&
                <TableComponent
                    title={"Appointment History"}
                    titleCol={props.context.theme.primary}
                    titleBgCol={props.context.theme.tertiary}
                    context={props.context}
                    ids={[...appointmentHistory]}
                    headerValues={["", "Email", "Name", "Title", "Description", "Date", "Time", ""]}
                    data={appointmentHistory.map((ap, index) => {
                        let dateParts = ap.date.split("/");
                        let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                        let time = `${ap.startTime} to ${ap.endTime}`;
                        let colVals: IColumnData[] = [
                            { type: TABLE_DATA_TYPE.AVATAR, value: ap.profilePicPath },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.email },
                            { type: TABLE_DATA_TYPE.STRING, value: `${ap.firstName} ${ap.lastName}` },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.title },
                            { type: TABLE_DATA_TYPE.STRING, value: ap.description },
                            { type: TABLE_DATA_TYPE.STRING, value: date },
                            { type: TABLE_DATA_TYPE.STRING, value: time },
                        ];
                        if (ap.status === APPROVAL_STATUS.APPROVED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_SUCCESS, value: "approved" });
                        }
                        if (ap.status === APPROVAL_STATUS.PENDING) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_WARNING, value: "pending" });
                        }
                        if (ap.status === APPROVAL_STATUS.REJECTED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_DANGER, value: "rejected" });
                        }
                        if (ap.status === APPROVAL_STATUS.CANCELLED) {
                            colVals.push({ type: TABLE_DATA_TYPE.BADGE_DANGER, value: "cancelled" });
                        }
                        return {
                            colValues: colVals
                        };
                    })}
                    loading={loadingUpcomingAppointments}
                />
            }

            {
                // Pending appointments 

                !isListView &&
                <div className="rounded appointments-page-row" >
                    <h4 className="appointments-page-col-header" style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }}>Pending Appointments</h4>
                    {
                        loadingPendingAppointments &&
                        <Loading />
                    }
                    {
                        pendingAppointments.length === 0 &&
                        <p>nothing to show</p>
                    }

                    <div className="vert-flex space-evenly">
                        {
                            pendingAppointments.map((ap, index) => {
                                let dateParts = ap.date.split("/");
                                let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                                let time = `${ap.startTime} ${ap.endTime}`;
                                return (
                                    <div className="doctor-pending-appointment-card">
                                        <AppointmentCard
                                            key={index}
                                            user={{
                                                email: ap.email,
                                                name: `${ap.firstName} ${ap.lastName}`,
                                                profilePicPath: ap.profilePicPath
                                            }}
                                            appointment={{
                                                date: date,
                                                time: time,
                                                description: ap.description,
                                                status: ap.status,
                                                title: ap.title
                                            }}
                                            context={props.context}
                                            cancel={async () => {
                                                setAppointmentBeingCancelled(ap);
                                            }}
                                            approve={() => approveAppointment(ap)}
                                            reject={() => rejectAppointment(ap)}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            }

            {
                // Upcoming appointments 

                !isListView &&
                <div className="rounded appointments-page-col">
                    <h5 className="appointments-page-col-header" style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }}>Upcoming Appointments</h5>
                    {
                        loadingUpcomingAppointments &&
                        <Loading />
                    }
                    {
                        upcomingAppointments.length === 0 &&
                        <p>nothing to show</p>
                    }
                    {
                        upcomingAppointments.map((ap, index) => {
                            let dateParts = ap.date.split("/");
                            let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                            let time = `${ap.startTime} ${ap.endTime}`;
                            return (
                                <AppointmentCard
                                    key={index}
                                    user={{
                                        email: ap.email,
                                        name: `${ap.firstName} ${ap.lastName}`,
                                        profilePicPath: ap.profilePicPath
                                    }}
                                    appointment={{
                                        date: date,
                                        time: time,
                                        description: ap.description,
                                        status: ap.status,
                                        title: ap.title
                                    }}
                                    context={props.context}
                                    cancel={async () => {
                                        setAppointmentBeingCancelled(ap);
                                    }}
                                />
                            );
                        })
                    }
                </div>
            }

            {
                // Appointment history 

                !isListView &&
                <div className="rounded appointments-page-col">
                    <h5 className="appointments-page-col-header" style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }}>Appointment History</h5>
                    {
                        loadingAppointmentHistory &&
                        <Loading />
                    }
                    {
                        appointmentHistory.length === 0 &&
                        <p>nothing to show</p>
                    }
                    {
                        appointmentHistory.map((ap, index) => {
                            let dateParts = ap.date.split("/");
                            let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
                            let time = `${ap.startTime} ${ap.endTime}`;
                            return (
                                <AppointmentCard
                                    key={index}
                                    user={{
                                        email: ap.email,
                                        name: `${ap.firstName} ${ap.lastName}`,
                                        profilePicPath: ap.profilePicPath
                                    }}
                                    appointment={{
                                        date: date,
                                        time: time,
                                        description: ap.description,
                                        status: ap.status,
                                        title: ap.title
                                    }}
                                    context={props.context} />
                            );
                        })
                    }
                </div>
            }

            {
                appointmentBeingCancelled &&
                <CancelAppointment
                    appointmentId={appointmentBeingCancelled ? appointmentBeingCancelled.appointmentId : 0}
                    appointmentStatus={appointmentBeingCancelled ? appointmentBeingCancelled.status : 0}
                    context={props.context}
                    userId={props.context.userId}
                    close={() => { setAppointmentBeingCancelled(undefined); }}
                    refresh={() => getUpcomingAppointments()}
                />
            }
        </div >
    );
}

export default DoctorAppointmentsPage;