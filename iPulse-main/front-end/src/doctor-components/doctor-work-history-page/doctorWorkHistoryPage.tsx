import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IDoctorWorkHistory } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import DoctorWorkHistoryCard from "../doctor-work-history-card/doctorWorkHistoryCard";
import "./doctorWorkHistoryPage.css";

interface IProps {
    context: IGlobalContext
}

let DoctorWorkHistoryPage = (props: IProps) => {

    const [addingWorkHistory, setAddingWorkHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newWorkHistory, setNewWorkHistory] = useState<IDoctorWorkHistory>({
        doctorId: props.context.userId,
        companyName: "",
        startDate: "",
        endDate: "",
        role: "",
        duties: ""
    });

    const [allWorkHistory, setAllWorkHistory] = useState<IDoctorWorkHistory[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllWorkHistory();
    }, []);

    // GET ALL WORK HISTORY
    const getAllWorkHistory = async () => {
        setLoading(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_WORK_HISTORY + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setAllWorkHistory(result.data);
    }

    // ADD WORK HISTORY
    const addWorkHistory = async () => {
        setLoading(true);

        if (!validateWorkHistory()) {
            setLoading(false);
            return;
        }

        const result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_DOCTOR_WORK_HISTORY, newWorkHistory, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        setNewWorkHistory({
            doctorId: props.context.userId,
            companyName: "",
            startDate: "",
            endDate: "",
            role: "",
            duties: ""
        });

        successToast("success", true);

        setAddingWorkHistory(false);
    }

    // VALIDATE WORK HISTORY
    const validateWorkHistory = (): boolean => {
        if (newWorkHistory.companyName === "") {
            errorToast("Enter a company name!");
            return false;
        }
        if (newWorkHistory.startDate === "") {
            errorToast("Enter a start date!");
            return false;
        }
        if (newWorkHistory.endDate === "") {
            errorToast("Enter an end date!");
            return false;
        }
        if (newWorkHistory.role === "") {
            errorToast("Enter an end date!");
            return false;
        }
        if (newWorkHistory.duties === "") {
            errorToast("Enter an end date!");
            return false;
        }
        return true;
    }

    return (
        <div className="w-100 hor-center vert-flex doctor-work-history-container">

            <div className="w-50 hor-center">
                <Button onClick={() => setAddingWorkHistory(true)} variant="success">Add New</Button>
            </div>

            {
                // Add work history form
                <Modal show={addingWorkHistory} backdrop="static" onHide={() => setAddingWorkHistory(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Work History</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="Company">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control onChange={(e) => setNewWorkHistory({ ...newWorkHistory, companyName: e.target.value })} type="text" placeholder="" value={newWorkHistory.companyName} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="Start">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control onChange={(e) => setNewWorkHistory({ ...newWorkHistory, startDate: e.target.value })} type="date" value={newWorkHistory.startDate} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="End">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control onChange={(e) => setNewWorkHistory({ ...newWorkHistory, endDate: e.target.value })} type="date" value={newWorkHistory.endDate} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="Role">
                                <Form.Label>Role</Form.Label>
                                <Form.Control onChange={(e) => setNewWorkHistory({ ...newWorkHistory, role: e.target.value })} type="text" value={newWorkHistory.role} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="Duties">
                                <Form.Label>Duties</Form.Label>
                                <Form.Control onChange={(e) => {
                                    if (e.target.value.length <= 800) {
                                        setNewWorkHistory({ ...newWorkHistory, duties: e.target.value });
                                    }
                                }} as="textarea" rows={3} value={newWorkHistory.duties} />
                            </Form.Group>
                        </Form>
                        {
                            // loading icon
                            (loading && addingWorkHistory) &&
                            <Loading />
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddingWorkHistory(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => addWorkHistory()}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            }

            {
                // Display work history cards
                <div className="w-100 hor-center vert-flex space-evenly flex-wrap">
                    {
                        allWorkHistory.map(wh => {
                            return (
                                <DoctorWorkHistoryCard workHistory={wh} refreshWorkHistory={getAllWorkHistory} />
                            );
                        })
                    }
                </div>
            }

        </div>
    );
}

export default DoctorWorkHistoryPage;