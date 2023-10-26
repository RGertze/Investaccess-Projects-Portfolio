import "./doctorViewPage.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IDoctorProfile, IPatientDoctorType } from "../../interfaces/doctor_interfaces";
import AppointmentCalendar from "../../shared-components/appointment-calendar/appointmentCalendar";
import { IAppointment, IAppointmentSlot } from "../../interfaces/appointment_interfaces";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { Alert, Button, Col, Form, FormControl, FormGroup, FormLabel, Modal, Row } from "react-bootstrap";
import Loading from "../../shared-components/loading-component/loading";
import DoctorDetailsCard from "../../shared-components/doctor-details-card/doctorDetailsCard";
import { IRequestStatus } from "../../interfaces/patient_interfaces";
import { APPROVAL_STATUS, NOTIFICATIONS_TYPE } from "../../interfaces/general_enums";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import CancelAppointment from "../../shared-components/cancel-appointment-component/cancelAppointmentComponent";
import moment from "moment";

interface IProps {
    context: IGlobalContext
}
interface INewAppointmentState {
    slotId: number,
    patientId: number,
    title: string,
    description: string,
    date: string
}

let DoctorViewPage = (props: IProps) => {
    const params = useLocation();
    const doctorId = (params.state as any).userId;

    // appointments state
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [appointmentSlots, setAppointmentSlots] = useState<IAppointmentSlot[]>([]);

    // new appointment variables
    const NUM_OF_DAYS_FOR_SLOTS = 14;
    const [showNewAppointmentPopup, setShowNewAppointmentPopup] = useState<boolean>(false);
    const [newAppointmentLoading, setNewAppointmentLoading] = useState<boolean>(false);
    const [newAppointmentDates, setNewAppointmentDates] = useState<Date[]>([new Date()]);
    const [formSlots, setFormSlots] = useState<IAppointmentSlot[]>([]);

    // cancel appointment variables
    const [showCancellingAppointment, setShowCancellingAppointment] = useState(false);
    const [appointmentBeingCancelled, setAppointmentBeingCancelled] = useState<IAppointment>();

    // new appointment state
    const [newAppointment, setNewAppointment] = useState<INewAppointmentState>({
        slotId: 0,
        patientId: props.context.userId,
        title: "",
        description: "",
        date: newAppointmentDates[0].toLocaleDateString()
    });

    // make this your doctor state
    const [showPersonalDoctorPopup, setShowPersonalDoctorPopup] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    // patient doctor types
    const [patientDoctorTypes, setPatientDoctorTypes] = useState<IPatientDoctorType[]>([]);

    // choosen doctor type
    const [pdTypeId, setPdTypeId] = useState(0);

    // request to be personal doctor status
    const [reqToBePersonalDocStatus, setReqToBePersonalDocStatus] = useState<IRequestStatus>({ status: 0 });

    // COMPONENT DID MOUNT
    useEffect(() => {
        createNewAppointmentDates();
        getRequestToBePersonalDoctorStatus();
        getDoctorSlots();
        getPatientDoctorTypes();
        getAppointmentsForDoctor();
    }, []);

    //----   ON APPOINTMENT NOTIFICATION RECEIVED    ----
    useEffect(() => {
        if (props.context.newNotificationRecv) {
            if (props.context.newNotificationRecv.typeId === NOTIFICATIONS_TYPE.APPOINTMENT)
                getAppointmentsForDoctor();
        }
    }, [props.context.newNotificationRecv]);


    //----   ON NEW APPOINTMENT DATE CHANGE   ----
    useEffect(() => {
        if (appointmentSlots.length === 0)
            return;

        // filter slots to those matching chosen date
        let day = (new Date(newAppointment.date)).getDay();
        let newFormSlots = appointmentSlots.filter(slot =>
            slot.day === ((day === 0) ? 7 : day)      // our slots use 1-7 for mon to sun, but javascript uses 0-6 for sun to sat
        );

        // if date is current date, remove slots that have passed
        let date = new Date();
        if (newAppointment.date === date.toLocaleDateString()) {
            newFormSlots = newFormSlots.filter(slot => {
                let start = moment(`${date.toDateString()} ${slot.startTime}`).toDate();
                return start > moment(Date.now()).toDate();
            });
        }

        // check if current new appointment slot id is in current slots
        if (newFormSlots.filter(s => s.id === newAppointment.slotId).length === 0)
            setNewAppointment({ ...newAppointment, slotId: (newFormSlots.length > 0) ? newFormSlots[0].id : 0 });

        setFormSlots(newFormSlots);
    }, [newAppointment.date, appointmentSlots]);

    //----   GET DOCTOR APPOINTMENT SLOTS   ----
    const getDoctorSlots = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_APPOINTMENT_SLOTS_FOR_DOCTOR + doctorId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            return;
        }
        setAppointmentSlots(result.data);
    }

    // GET ALL APPOINTMENTS FOR DOCTOR
    const getAppointmentsForDoctor = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_APPOINTMENTS_FOR_DOCTOR + doctorId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            return;
        }
        setAppointments(result.data);
    }


    // CREATE NEW APPOINTMENT DATES
    const createNewAppointmentDates = () => {
        // get array numbers
        let days = [...Array(NUM_OF_DAYS_FOR_SLOTS).keys()];

        // get array of dates starting from current day
        let dates = days.map((value) => {
            let d = new Date();
            d.setDate(d.getDate() + value);
            return d;
        });

        setNewAppointmentDates(dates);
    }

    // VALIDATE NEW APPOINTMENT
    const validateNewAppointment = async (): Promise<boolean> => {
        if (newAppointment.date === "") {
            errorToast("Choose a date!");
            return false;
        }
        if (newAppointment.slotId === 0) {
            errorToast("Choose a slot!");
            return false;
        }
        if (newAppointment.title === "") {
            errorToast("Enter a title");
            return false;
        }
        if (newAppointment.description === "") {
            errorToast("Enter a description");
            return false;
        }

        return true;
    }

    // ADD NEW APPOINTMENT
    const addNewAppointment = async () => {
        setNewAppointmentLoading(true);

        if (!await validateNewAppointment()) {
            setNewAppointmentLoading(false);
            return;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_NEW_APPOINTMENT, newAppointment, {});
        if (result.errorMessage.length > 0) {
            setNewAppointmentLoading(false);
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        successToast("Request for an appointment has been made! You will be notified once it has been approved");

        getAppointmentsForDoctor();
        setNewAppointmentLoading(false);
        clearNewAppointment();
        setShowNewAppointmentPopup(false);
    }

    //----   ON OPEN SLOT CLICKED   ----
    const onOpenSlotClicked = (slot: IAppointmentSlot, dateIndex: number) => {
        setNewAppointment({ ...newAppointment, date: newAppointmentDates[dateIndex].toLocaleDateString(), slotId: slot.id });
        setShowNewAppointmentPopup(true);
    }

    // CLEAR NEW APPOINTMENT DATA
    const clearNewAppointment = () => {
        setNewAppointment({
            ...newAppointment,
            slotId: 0,
            title: "",
            description: "",
        });
    }

    // GET PATIENT DOCTOR TYPES 
    const getPatientDoctorTypes = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PATIENT_DOCTOR_TYPES, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage);
            return;
        }
        setPatientDoctorTypes(result.data);
    }

    // GET REQUEST TO BE PERSONAL DOCTOR STATUS

    const getRequestToBePersonalDoctorStatus = async () => {
        let qry = `?patientId=${props.context.userId}&doctorId=${doctorId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REQUEST_TO_BE_PERSONAL_DOCTOR_STATUS + qry, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            return;
        }
        setReqToBePersonalDocStatus(result.data);
    }

    // REQUEST DOCTOR TO BE PERSONAL DOCTOR
    const requestDoctorToBePersonalDoctor = async () => {
        setModalLoading(true);

        if (pdTypeId === 0) {
            alert("Choose a type!");
            setModalLoading(false);
            return;
        }

        let data = {
            patientId: props.context.userId,
            doctorId: doctorId,
            typeId: pdTypeId
        };
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REQUEST_DOCTOR_TO_BE_PERSONAL_DOCTOR, data, {});
        setModalLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast("Failed to make the request: " + result.errorMessage);
            return;
        }

        setShowPersonalDoctorPopup(false);
        getRequestToBePersonalDoctorStatus();
    }

    //----   REVOKE REQUEST FOR DOCTOR TO BE PERSONAL DOCTOR   ----
    const revokeRequestToBeDoctor = async () => {
        let data = {
            patientId: props.context.userId,
            doctorId: doctorId,
            approvalCode: reqToBePersonalDocStatus.approvalCode
        }

        let result = await Connection.postRequest(POST_ENDPOINT.REJECT_REQUEST_TO_BE_PERSONAL_DOCTOR, data, {});
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage);
            return;
        }

        getRequestToBePersonalDoctorStatus();
    }

    return (
        < div className="doctor-view-page-container" >

            {
                // Doctor profile info
                <div className="rounded hor-center doctor-view-details">
                    <DoctorDetailsCard context={props.context} doctorId={doctorId} />
                </div>
            }

            {   // Make this your doctor
                reqToBePersonalDocStatus.status === APPROVAL_STATUS.REJECTED &&
                <>
                    <Alert variant="primary" className="hor-center doctor-view-alert">
                        <Alert.Heading>Like what you see?</Alert.Heading>
                        <p>Click <b onClick={() => setShowPersonalDoctorPopup(true)} className="hover">here</b> to make this your personal doctor!</p>
                    </Alert>

                    <Modal show={showPersonalDoctorPopup} onHide={() => setShowPersonalDoctorPopup(false)}>
                        <Modal.Header closeButton>
                            <h4>Make this your doctor.</h4>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                modalLoading &&
                                <Loading />
                            }
                            {
                                !modalLoading &&
                                <Form>
                                    <FormGroup>
                                        <FormLabel>Doctor type:</FormLabel>
                                        <Form.Select onChange={(e) => setPdTypeId(parseInt(e.target.value))} value={pdTypeId}>
                                            <option value={0}></option>
                                            {
                                                patientDoctorTypes.map((pdType, index) => {
                                                    return (
                                                        <option key={index} value={pdType.typeId}>{pdType.typeName}</option>
                                                    );
                                                })
                                            }
                                        </Form.Select>
                                    </FormGroup>
                                </Form>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setShowPersonalDoctorPopup(false)} variant="outline-primary">Cancel</Button>
                            <Button onClick={() => requestDoctorToBePersonalDoctor()} variant="outline-success">Submit</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
            {   // Make this your doctor pending
                reqToBePersonalDocStatus.status === APPROVAL_STATUS.PENDING &&
                <Alert variant="warning" className="hor-center doctor-view-alert">
                    <p>Your request to make this a personal doctor is pending!
                        <br />
                        Click <b onClick={() => revokeRequestToBeDoctor()} className="hover">here</b> To cancel the request.
                    </p>
                </Alert>
            }
            {   // Remove this doctor as a personal doctor
                reqToBePersonalDocStatus.status === APPROVAL_STATUS.APPROVED &&
                <Alert variant="success" className="hor-center doctor-view-alert">
                    <Alert.Heading>This is one of your personal doctors!</Alert.Heading>
                    <p>Click <b onClick={() => revokeRequestToBeDoctor()} className="hover">here</b> to remove them!</p>
                </Alert>
            }


            <hr className="hor-center" style={{ width: "100%", height: "1px" }} />

            <div className="vert-flex space-between calendar-container-header hor-center">
                <h2>Schedule</h2>
                <Button variant="outline-success" onClick={() => setShowNewAppointmentPopup(true)}>New Appointment</Button>
            </div>
            <div className="hor-center calendar-container">
                <AppointmentCalendar
                    bookOpenSlot={onOpenSlotClicked}
                    isPatient={true}
                    patientId={props.context.userId}
                    appointments={appointments}
                    openSlots={appointmentSlots}
                    slotDates={newAppointmentDates}
                    cancel={async (ap) => {
                        setAppointmentBeingCancelled(ap);
                        setShowCancellingAppointment(true);
                    }}
                />
            </div>

            {
                // New appointment popup
                <Modal show={showNewAppointmentPopup} backdrop="static" onHide={() => setShowNewAppointmentPopup(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Appointment</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="Title">
                                <Form.Label>Date:</Form.Label>
                                <Form.Select onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} value={(newAppointment.date !== "") ? newAppointment.date : newAppointmentDates[0].toLocaleDateString()}>
                                    {
                                        newAppointmentDates.map((date, index) => {
                                            return (
                                                <option key={index} value={date.toLocaleDateString()}>{date.toDateString()}</option>
                                            );
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Title">
                                <Form.Label>Slot:</Form.Label>
                                <Form.Select onChange={(e) => setNewAppointment({ ...newAppointment, slotId: parseInt(e.target.value) })} value={newAppointment.slotId}>
                                    {
                                        formSlots.length === 0 &&
                                        <option value={0}>None Available!</option>
                                    }
                                    {
                                        formSlots.map((slot, index) => {
                                            return (
                                                <option key={index} value={slot.id}>{slot.startTime} -- {slot.endTime}</option>
                                            );
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })} type="text" placeholder="Title" value={newAppointment.title} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })} as="textarea" rows={3} value={newAppointment.description} />
                            </Form.Group>

                        </Form>
                        {
                            // loading icon
                            newAppointmentLoading &&
                            <Loading />
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowNewAppointmentPopup(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => addNewAppointment()}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            }

            {
                showCancellingAppointment &&
                <CancelAppointment
                    appointmentId={appointmentBeingCancelled ? appointmentBeingCancelled.appointmentId : 0}
                    appointmentStatus={appointmentBeingCancelled ? appointmentBeingCancelled.status : 0}
                    context={props.context}
                    userId={props.context.userId}
                    close={() => { setShowCancellingAppointment(false); setAppointmentBeingCancelled(undefined); }}
                    refresh={() => getAppointmentsForDoctor()}
                />
            }
        </div >
    );
}

export default DoctorViewPage;