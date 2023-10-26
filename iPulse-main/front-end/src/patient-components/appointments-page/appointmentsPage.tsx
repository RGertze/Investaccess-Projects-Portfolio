import { useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Form, FormGroup, Modal, ToggleButton } from "react-bootstrap";
import { Grid1x2, List } from "react-bootstrap-icons";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { APPOINTMENT_STATUS, IAppointment } from "../../interfaces/appointment_interfaces";
import { APPROVAL_STATUS } from "../../interfaces/general_enums";
import { IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import { IPatientAppointment } from "../../interfaces/patient_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import AppointmentCard from "../../shared-components/appointment-card/appointmentCard";
import CancelAppointment from "../../shared-components/cancel-appointment-component/cancelAppointmentComponent";
import Loading from "../../shared-components/loading-component/loading";
import TableComponent, { IColumnData, TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import "./appointmentsPage.css";

interface IProps {
    context: IGlobalContext
}

const AppointmentsPage = (props: IProps) => {
    const statusNames = ["rejected", "pending", "approved"];
    const statusColors = ["danger", "warning", "success"];

    const [isListView, setIsListView] = useState<boolean>(true);

    const [appointmentBeingCancelled, setAppointmentBeingCancelled] = useState<IPatientAppointment>();

    const [appointmentHistory, setAppointmentHistory] = useState<IPatientAppointment[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<IPatientAppointment[]>([]);

    const [loadingUpcomingAppointments, setLoadingUpcomingAppointments] = useState(false);
    const [loadingAppointmentHistory, setLoadingAppointmentHistory] = useState(false);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getUpcomingAppointments();
        getAppointmentHistory();
    }, []);

    //----   GET UPCOMING APPOINTNMENTS   ----
    const getUpcomingAppointments = async () => {
        setLoadingUpcomingAppointments(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_UPCOMING_APPOINTMENTS_FOR_PATIENT + props.context.userId, "");
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

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_APPOINTMENT_HISTORY_FOR_PATIENT + props.context.userId, "");
        setLoadingAppointmentHistory(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        console.log(result.data);
        setAppointmentHistory(result.data);
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
                // Upcoming appointments 

                !isListView &&
                <div className="rounded appointments-page-col">
                    <h5 style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }} className="appointments-page-col-header">Upcoming Appointments</h5>
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
                    <h5 style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }} className="appointments-page-col-header">Appointment History</h5>
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

export default AppointmentsPage;