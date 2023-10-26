import { CloseOutlined } from "@mui/icons-material"
import { useState } from "react"
import { Alert, Button, Form, Modal, Table } from "react-bootstrap"
import { Check2Circle, X } from "react-bootstrap-icons"
import { Connection, POST_ENDPOINT } from "../../connection"
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces"
import { errorToast } from "../alert-components/toasts"
import Loading from "../loading-component/loading"
import "./addSlot.css";

interface IProps {
    context: IGlobalContext,
    doctorId: number,
    show: boolean,
    hide(): void,
    refresh(): void
}

const AddSlot = (props: IProps) => {
    const dayStrs = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayColors = ["#999900", "#777078", "#008000", "#ffa500", "#00bfff", "#800080", "#ff0000"];

    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState<{ day: number, time: string, response: IResponse }[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    const [slots, setSlots] = useState<{ startTime: string, endTime: string }[]>([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [days, setDays] = useState<{
        mon: boolean,
        tue: boolean,
        wed: boolean,
        thu: boolean,
        fri: boolean,
        sat: boolean,
        sun: boolean,
    }>({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
    });


    //----   ADD NEW SLOT TO BE ADDED   ----
    const addSlot = () => {

        // check for empty values
        if (startTime === "") {
            errorToast("Choose a start time");
            return;
        }
        if (endTime === "") {
            errorToast("Choose an end time");
            return;
        }

        // allow max of 32 slots to be added at once
        if (slots.length >= 32) {
            errorToast("Maximum of 32 slots can be added at once!");
            return;
        }

        // check for conflicts in current slots
        let conflictingSlots = slots.filter(s => (startTime >= s.startTime && startTime < s.endTime) || (endTime > s.startTime && endTime <= s.endTime));
        if (conflictingSlots.length > 0) {
            errorToast("There is a conflict with one of the slots already added!");
            return;
        }

        // add slot
        let copyOfSlots = slots.slice();
        copyOfSlots.push({ startTime: startTime, endTime: endTime });
        setSlots(copyOfSlots);
        setStartTime("");
        setEndTime("");
    }

    //----   DELETE SLOT TO BE ADDED   ----
    const deleteSlot = (startTime: string, endTime: string) => {
        let copyOfSlots = slots.filter(s => s.startTime !== startTime && s.endTime !== endTime);
        setSlots(copyOfSlots);
    }

    //----   SUBMIT SLOTS   ----
    const submitSlots = async () => {

        // check if no slots selected
        if (slots.length === 0) {
            errorToast("No slots chosen");
            return;
        }

        setLoading(true);

        // get day keys
        let dayKeys = Object.keys(days);

        // construct array of objects to send
        let data: any[] = [];
        dayKeys.forEach((key, index) => {

            // check if day is checked
            if (days[key]) {

                // create slots for day
                slots.forEach(slot => {
                    data.push({
                        doctorId: props.doctorId,
                        day: index + 1,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    });
                });
            }
        });

        // check if days were selected
        if (data.length === 0) {
            errorToast("No days were selected");
            setLoading(false);
            return;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_APPOINTMENT_SLOT_MULTIPLE, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        // get responses 
        let responses: IResponse[] = result.data;

        // set responses for data
        setResponses(responses.map((res, index) => {
            return {
                day: data[index].day,
                time: `${data[index].startTime} -- ${data[index].endTime}`,
                response: res
            };
        }));
        setSlots([]);
        props.refresh();

        setCurrentPage(1);
    }

    return (
        <Modal show={props.show} onHide={() => props.hide()}>
            <Modal.Header style={{ backgroundColor: "#dbdcff", color: "#555555" }} closeButton>
                <h3 className="no-pad-marg">Add slots</h3>
            </Modal.Header>

            <Modal.Body>

                {
                    currentPage === 0 &&
                    <>
                        {
                            // input
                            <div className="vert-flex space-evenly add-slot-input">
                                <Form.Group className="mb-3" controlId="Start">
                                    <Form.Label>Start Time:</Form.Label>
                                    <Form.Control onChange={(e) => setStartTime(e.target.value)} type="time" value={startTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="End">
                                    <Form.Label>End Time:</Form.Label>
                                    <Form.Control onChange={(e) => setEndTime(e.target.value)} type="time" value={endTime} />
                                </Form.Group>
                                <Button onClick={() => addSlot()} variant="success">Add</Button>
                            </div>
                        }

                        {
                            // slots container
                            <div className="border rounded vert-flex slots-container">
                                {
                                    slots.map((slot, index) => {
                                        return (
                                            <div key={index} className="rounded schedule-slot vert-flex">
                                                <h6>{slot.startTime} -- {slot.endTime}</h6>
                                                <X onClick={() => deleteSlot(slot.startTime, slot.endTime)} className="icon-sm  hover" />
                                            </div>
                                        );
                                    })
                                }
                                {
                                    slots.length === 0 &&
                                    <h5 className="nothing">Nothing to show!</h5>
                                }
                            </div>
                        }

                        {
                            // day check boxes
                            <div className="vert-flex rounded space-evenly add-slot-days">
                                <Form.Group className="mb-3" controlId="M">
                                    <Form.Label className="add-slot-label">Mon</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, mon: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="T">
                                    <Form.Label className="add-slot-label">Tue</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, tue: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="W">
                                    <Form.Label className="add-slot-label">Wed</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, wed: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="TT">
                                    <Form.Label className="add-slot-label">Thu</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, thu: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="F">
                                    <Form.Label className="add-slot-label">Fri</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, fri: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="S">
                                    <Form.Label className="add-slot-label">Sat</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, sat: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="SS">
                                    <Form.Label className="add-slot-label">Sun</Form.Label>
                                    <Form.Check onChange={(e) => setDays({ ...days, sun: e.target.checked })} type="checkbox" value={endTime} />
                                </Form.Group>
                            </div>
                        }
                        {
                            // buttons
                            <div className="vert-flex add-slot-buttons">
                                <Button onClick={() => props.hide()} variant="outline-primary">Cancel</Button>
                                <Button className="add-slot-btn" onClick={() => submitSlots()} variant="success">
                                    {
                                        !loading &&
                                        "Submit"
                                    }
                                    {
                                        loading &&
                                        <Loading color="white" small={true} />
                                    }
                                </Button>
                            </div>
                        }
                    </>
                }

                {
                    currentPage === 1 &&
                    <>
                        {
                            responses.map((res, index) => {
                                return (
                                    <div className="add-slot-results">
                                        <p style={{ color: dayColors[res.day - 1] }}>{dayStrs[res.day - 1]}</p>
                                        <p>{res.time}</p>
                                        <div>
                                            {
                                                res.response.errorMessage === "" &&
                                                <Check2Circle className="hor-center icon-sm btn-approve" />
                                            }
                                            {
                                                res.response.errorMessage !== "" &&
                                                <CloseOutlined className="hor-center icon-sm btn-reject" />
                                            }
                                        </div>
                                        {
                                            res.response.errorMessage !== "" &&
                                            <div style={{ gridColumn: "1/4" }}>
                                                <Alert variant="danger">
                                                    {res.response.errorMessage}
                                                </Alert>
                                            </div>
                                        }
                                    </div>
                                );
                            })
                        }
                        {
                            // buttons
                            <div className="vert-flex add-slot-buttons">
                                <Button onClick={() => setCurrentPage(0)} variant="outline-primary">Back</Button>
                                <Button className="add-slot-btn" onClick={() => {
                                    setResponses([]);
                                    setCurrentPage(0);
                                    props.hide();
                                }} variant="success">
                                    Done
                                </Button>
                            </div>
                        }
                    </>
                }

            </Modal.Body>
        </Modal>
    )
}

export default AddSlot;