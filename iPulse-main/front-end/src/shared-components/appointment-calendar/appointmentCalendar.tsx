import "./appointmentCalendar.css";
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import moment from 'moment'
import { APPOINTMENT_STATUS, IAppointment, IAppointmentSlot } from "../../interfaces/appointment_interfaces";
import { useEffect, useState } from "react";
import { IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import { Connection, GET_ENDPOINT } from "../../connection";
import { Modal } from "react-bootstrap";
import AppointmentCard from "../appointment-card/appointmentCard";
import { GlobalContext } from "../../contexts/globalContext";

const localizer = momentLocalizer(moment)

enum EVENT_COLOURS {
    AMBER = "#FFBF00",
    RED = "#EE0E00",
    GREEN = "#74EE15",
    BLUE = "#0096FF"
}

interface IProps {
    appointments: IAppointment[],
    openSlots: IAppointmentSlot[],
    slotDates: Date[],

    bookOpenSlot(slot: IAppointmentSlot, dateIndex: number): void,

    isPatient: boolean,
    patientId: number,

    reject?(appointment: IAppointment): Promise<void>,
    approve?(appointment: IAppointment): Promise<void>,
    cancel?(appointment: IAppointment): Promise<void>,
}

const AppointmentCalendar = (props: IProps) => {

    const [showAppointment, setShowAppointment] = useState(false);
    const [appointmentBeingViewed, setAppointmentBeingViewed] = useState<IAppointment>();

    const [events, setEvents] = useState<any[]>([]);
    const [slots, setSlots] = useState<IAppointmentSlot[][]>([]);

    const formats = {
        // dont show time data in day/week view
        eventTimeRangeFormat: () => {
            return "";
        },
    };

    //----   ON PROPS OPEN SLOTS CHANGE   ----
    useEffect(() => {
        filterSlots();
    }, [props.openSlots, props.appointments]);

    //----   ON SLOTS CHANGE   ----
    useEffect(() => {
        buildEvents();
    }, [slots]);


    //----   FILTER SLOTS   ----
    const filterSlots = () => {
        let mon = props.openSlots.filter(slot => slot.day === 1);
        let tue = props.openSlots.filter(slot => slot.day === 2);
        let wed = props.openSlots.filter(slot => slot.day === 3);
        let thu = props.openSlots.filter(slot => slot.day === 4);
        let fri = props.openSlots.filter(slot => slot.day === 5);
        let sat = props.openSlots.filter(slot => slot.day === 6);
        let sun = props.openSlots.filter(slot => slot.day === 7);

        setSlots([mon, tue, wed, thu, fri, sat, sun]);
    }

    //----   BUILD EVENTS ARRAY   ----
    const buildEvents = () => {

        // hash map to keep track of conflicts
        let conflictMap = new Map<string, string>();

        let aps = props.appointments.map(ap => {
            let start = moment(`${ap.date} ${ap.startTime}`, "DD/MM/yyyy HH:mm").toDate();
            let end = moment(`${ap.date} ${ap.endTime}`, "DD/MM/yyyy HH:mm").toDate();

            // add appointment to map
            conflictMap.set(`${start} ${end}`, "");
            return {
                appointment: ap,
                toolTip: `${ap.startTime} - ${ap.endTime} : ${(props.isPatient && ap.patientId !== props.patientId) ? "Booked" : ap.title}`,

                title: (props.isPatient && ap.patientId !== props.patientId) ? "Booked" : `${ap.title}`,  // display all titles to doctor. Only display titles to patient of appointments made by that patient
                start: start,
                end: end,
                resource: "",
                allDay: false,
                status: ap.status
            }
        });


        let currDate = moment().toDate();
        aps = aps.filter(ap => ap.end >= currDate);

        let openSlots: any = [];
        for (let i = 0; i < props.slotDates.length; i++) {
            let d = props.slotDates[i];
            let day = d.getDay();

            // 0 == sunday
            if (day === 0)
                day = 7;

            if (slots.length > 0) {
                for (let slot of slots[day - 1]) {
                    let start = moment(`${d.toDateString()} ${slot.startTime}`).toDate();
                    let end = moment(`${d.toDateString()} ${slot.endTime}`).toDate();

                    // add to array if there is no conflict and if start time > than current time
                    if (!conflictMap.has(`${start} ${end}`) && start > moment(Date.now()).toDate()) {
                        openSlots.push({
                            dateIndex: i,       // index of date to use if user clicks on slot to book
                            slot: slot,
                            toolTip: `${slot.startTime} - ${slot.endTime} : Open slot`,

                            title: `Open slot`,
                            start: start,
                            end: end,
                            resource: "",
                            allDay: false,
                            status: 3
                        });
                    }
                }
            }
        }

        let evs = [...aps, ...openSlots];
        setEvents(evs);
    }

    //----   ON EVENT CLICK   ----
    const onEventClick = (ev: any) => {

        // handle open slot click
        if (ev.status === 3 && props.isPatient) {
            props.bookOpenSlot(ev.slot, ev.dateIndex);
            return;
        }

        // handle appointment click
        if (ev.status < 3 && ev.status >= 0) {
            if (!props.isPatient || (props.isPatient && ev.appointment.patientId === props.patientId)) {
                setAppointmentBeingViewed(ev.appointment);
                setShowAppointment(true);
            }
        }
    }


    //----   GET DATE FOR APPOINTMENT CARD   ----
    const getDateForAppointmentCard = (ap: IAppointment | undefined): string => {
        if (ap) {
            let dateParts = ap.date.split("/");
            let date = (new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])).toDateString();
            return date;
        }
        return "";
    }


    return (
        <GlobalContext.Consumer>
            {context => (
                <div style={{ backgroundColor: context.theme.primary }} className="rounded appointment-calendar-container">
                    <Calendar
                        formats={formats}
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={ev => {
                            let backgroundColor = "";
                            if (ev.status === 0)
                                backgroundColor = EVENT_COLOURS.RED
                            if (ev.status === 1)
                                backgroundColor = EVENT_COLOURS.AMBER
                            if (ev.status === 2)
                                backgroundColor = EVENT_COLOURS.GREEN
                            if (ev.status === 3)
                                backgroundColor = EVENT_COLOURS.BLUE

                            return {
                                style: { backgroundColor: backgroundColor }
                            };
                        }}
                        tooltipAccessor={(ev) => `${ev.toolTip}`}
                        onSelectEvent={onEventClick}
                        popup={false}
                    />

                    {
                        // APPOINTMENT VIEW
                        showAppointment &&
                        <Modal size="lg" dialogClassName="calendar-appointment-view" centered={true} show={showAppointment} onHide={() => { setShowAppointment(false); setAppointmentBeingViewed(undefined); }}>
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body className="calendar-appointment-view-body">
                                {
                                    appointmentBeingViewed &&
                                    <AppointmentCard
                                        context={context}
                                        user={{
                                            email: appointmentBeingViewed ? appointmentBeingViewed.patientEmail : "",
                                            name: appointmentBeingViewed ? `${appointmentBeingViewed.patientFirstname} ${appointmentBeingViewed.patientLastname}` : "",
                                            profilePicPath: appointmentBeingViewed ? appointmentBeingViewed.patientProfilePic : "",
                                        }}
                                        appointment={{
                                            date: getDateForAppointmentCard(appointmentBeingViewed),
                                            time: appointmentBeingViewed ? `${appointmentBeingViewed.startTime} ${appointmentBeingViewed.endTime}` : "",
                                            description: appointmentBeingViewed ? appointmentBeingViewed.description : "",
                                            status: appointmentBeingViewed ? appointmentBeingViewed.status : 0,
                                            title: appointmentBeingViewed ? appointmentBeingViewed.title : ""
                                        }}
                                        approve={async () => {
                                            if (appointmentBeingViewed && props.approve) {
                                                props.approve(appointmentBeingViewed);
                                                setShowAppointment(false);
                                            } else {
                                                errorToast("unable to approve this appointment, try again later");
                                            }
                                        }}
                                        reject={async () => {
                                            if (appointmentBeingViewed && props.reject) {
                                                props.reject(appointmentBeingViewed);
                                                setShowAppointment(false);
                                            } else {
                                                errorToast("unable to reject this appointment, try again later");
                                            }
                                        }}
                                        cancel={async () => {
                                            if (appointmentBeingViewed && props.cancel) {
                                                props.cancel(appointmentBeingViewed);
                                                setShowAppointment(false);
                                            } else {
                                                errorToast("unable to cancel this appointment, try again later");
                                            }
                                        }}
                                    />
                                }
                            </Modal.Body>
                        </Modal>
                    }
                </div>
            )}
        </GlobalContext.Consumer>
    );
}
export default AppointmentCalendar;