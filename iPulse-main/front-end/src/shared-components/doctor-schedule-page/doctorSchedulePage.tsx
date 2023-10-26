import { useEffect, useState } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IAppointmentSlot } from "../../interfaces/appointment_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import AddSlot from "../add-slot-component/addSlot";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./doctorSchedulePage.css";

interface IProps {
    context: IGlobalContext,
    doctorId: number
}

const DoctorSchedulePage = (props: IProps) => {
    const tabs: { name: string, id: number }[] = [
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" },
        { id: 7, name: "Sunday" }
    ]

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('monday');

    const [loading, setLoading] = useState(false);
    const [addingSlot, setAddingSlot] = useState(false);
    const [dayOfSlotBeingAdded, setDayOfSlotBeingAdded] = useState(0);
    const [slots, setSlots] = useState<IAppointmentSlot[]>([]);

    const [newSlot, setNewSlot] = useState<{ startTime: string, endTime: string }>({
        startTime: "",
        endTime: ""
    });

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAllSlots();
    }, []);


    //----   GET ALL SLOTS   ----
    const getAllSlots = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_APPOINTMENT_SLOTS_FOR_DOCTOR + props.doctorId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setSlots(result.data);
    }

    //----   DELETE SLOT   ----
    const deleteSlot = async (id: number) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_APPOINTMENT_SLOT + id);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        successToast("Slot Deleted!", true, 1500);
        getAllSlots();
    }

    //----   ADD SLOT   ----
    const addSlot = async () => {
        setLoading(true);
        if (!validateNewSlot()) {
            setLoading(false);
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_APPOINTMENT_SLOT, {
            doctorId: props.doctorId,
            day: dayOfSlotBeingAdded,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime
        }, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        successToast("Slot Added!", true, 1500);
        setAddingSlot(false);
        setNewSlot({ startTime: "", endTime: "" });
        setDayOfSlotBeingAdded(0);
        getAllSlots();
    }

    //----   VALIDATE NEW SLOT   ----
    const validateNewSlot = (): boolean => {
        if (newSlot.startTime === "") {
            errorToast("Select a start time");
            return false;
        }
        if (newSlot.endTime === "") {
            errorToast("Select an end time");
            return false;
        }
        if (newSlot.startTime >= newSlot.endTime) {
            errorToast("End time should be greater than start time");
            return false;
        }

        return true;
    }

    return (
        <div className="doctor-schedule-container">
            <h2 style={{ color: props.context.theme.tertiary }}>Schedule</h2>
            <p style={{ color: props.context.theme.tertiary }}>Create time slots for patients to book on.</p>

            <Tabs style={{ backgroundColor: props.context.theme.primary }} className="hor-center doctor-schedule-tabs" activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "monday")}>
                {
                    tabs.map((tab, index) => {
                        let tabSlots = slots.filter(slot => slot.day === tab.id);
                        return (
                            <Tab key={index} eventKey={tab.name.toLowerCase()} title={tab.name}>
                                <div style={{ backgroundColor: props.context.theme.primary }} className="schedule-tab hor-center">

                                    <div className="schedule-header vert-flex">
                                        <Button onClick={() => { setDayOfSlotBeingAdded(tab.id); setAddingSlot(true); }} className="schedule-new-btn" variant="outline-success">New Slot</Button>
                                    </div>

                                    <div className="rounded vert-flex schedule-slots-container">
                                        <h5 style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }}>Time Slots</h5>

                                        {
                                            loading &&
                                            <Loading />
                                        }

                                        {
                                            tabSlots.map((slot, index) => {
                                                return (
                                                    <div key={index} className="rounded schedule-slot vert-flex">
                                                        <h6>{slot.startTime} -- {slot.endTime}</h6>
                                                        <X onClick={() => deleteSlot(slot.id)} className="icon-sm  hover" />
                                                    </div>
                                                );
                                            })
                                        }
                                        {
                                            tabSlots.length === 0 &&
                                            <p>Nothing to Show</p>
                                        }
                                    </div>
                                </div>
                            </Tab>
                        );
                    })
                }
            </Tabs>

            {
                // Add new slots
                <AddSlot context={props.context} doctorId={props.doctorId} show={addingSlot} hide={() => setAddingSlot(false)} refresh={getAllSlots} />
            }
        </div>
    );
}

export default DoctorSchedulePage;