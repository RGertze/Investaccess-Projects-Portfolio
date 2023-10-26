import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IAddDoctorEducation, IDoctorEducation } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IReceptionist } from "../../interfaces/receptionist_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import DoctorReceptionistCard from "../doctor-receptionist-card/doctorReceptionistCard";
import "./doctorReceptionistsPage.css";

interface IAddReceptionist {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
}

interface IProps {
    context: IGlobalContext
}

let DoctorReceptionistsPage = (props: IProps) => {

    const [addingReceptionist, setAddingReceptionist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newReceptionist, setNewReceptionist] = useState<IAddReceptionist>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });

    const [allReceptionists, setAllReceptionists] = useState<IReceptionist[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllReceptionists();
    }, []);

    // GET ALL RECEPTIONISTS
    const getAllReceptionists = async () => {
        setLoading(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_RECEPTIONISTS_FOR_DOCTOR + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setAllReceptionists(result.data);
    }

    // ADD RECEPTIONIST
    const addReceptionist = async () => {
        setLoading(true);

        if (!validateReceptionist()) {
            setLoading(false);
            return;
        }

        let data = {
            doctorId: props.context.userId,
            email: newReceptionist.email,
            firstName: newReceptionist.firstName,
            lastName: newReceptionist.lastName,
            password: newReceptionist.password,
        }

        const result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_RECEPTIONIST, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        successToast("Added receptionist!", true, 1500);

        setNewReceptionist({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        });

        setAddingReceptionist(false);
        getAllReceptionists();
    }



    // VALIDATE WORK HISTORY
    const validateReceptionist = (): boolean => {
        if (newReceptionist.email === "") {
            errorToast("Enter an email!", true);
            return false;
        }
        if (newReceptionist.firstName === "") {
            errorToast("Enter a firstname!", true);
            return false;
        }
        if (newReceptionist.lastName === "") {
            errorToast("Enter a lastname!", true);
            return false;
        }
        if (newReceptionist.password === "") {
            errorToast("Enter a password!", true);
            return false;
        }
        if (newReceptionist.password !== newReceptionist.confirmPassword) {
            errorToast("Passwords do not match!", true);
            return false;
        }

        return true;
    }



    return (
        <div className="w-100 hor-center vert-flex doctor-work-history-container">

            <div className="w-50 hor-center">
                <Button onClick={() => setAddingReceptionist(true)} variant="success">Add New</Button>
            </div>

            {
                // Add education
                <Modal show={addingReceptionist} backdrop="static" onHide={() => setAddingReceptionist(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Receptionist</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="Email">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control onChange={(e) => setNewReceptionist({ ...newReceptionist, email: e.target.value })} type="text" placeholder="" value={newReceptionist.email} />
                            </Form.Group>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="Firstname">
                                    <Form.Label>Firstname:</Form.Label>
                                    <Form.Control onChange={(e) => setNewReceptionist({ ...newReceptionist, firstName: e.target.value })} type="text" placeholder="" value={newReceptionist.firstName} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="Lastname">
                                    <Form.Label>Lastname:</Form.Label>
                                    <Form.Control onChange={(e) => setNewReceptionist({ ...newReceptionist, lastName: e.target.value })} type="text" placeholder="" value={newReceptionist.lastName} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="Password">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control onChange={(e) => setNewReceptionist({ ...newReceptionist, password: e.target.value })} type="password" placeholder="" value={newReceptionist.password} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="ConfirmPassword">
                                    <Form.Label>Confirm Password:</Form.Label>
                                    <Form.Control onChange={(e) => setNewReceptionist({ ...newReceptionist, confirmPassword: e.target.value })} type="password" placeholder="" value={newReceptionist.confirmPassword} />
                                </Form.Group>
                            </Row>
                        </Form>
                        {
                            // loading icon
                            (loading && addingReceptionist) &&
                            <Loading />
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddingReceptionist(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => addReceptionist()}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            }

            {
                // Display receptionists
                <div className="doctor-education-table hor-center vert-flex space-evenly flex-wrap">
                    {
                        !loading &&
                        allReceptionists.map(r => {
                            return (
                                <DoctorReceptionistCard receptionist={r} refreshReceptionists={() => getAllReceptionists()} />
                            );
                        })
                    }

                    {
                        (!loading && allReceptionists.length === 0) &&
                        <h5>Nothing to show!</h5>
                    }

                    {
                        loading &&
                        <Loading />
                    }
                </div>
            }

        </div>
    );
}

export default DoctorReceptionistsPage;