import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IAddDoctorEducation, IDoctorEducation } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./doctorEducationPage.css";

interface IProps {
    context: IGlobalContext
}

let DoctorEducationPage = (props: IProps) => {

    const [addingEducation, setAddingEducation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newEducation, setNewEducation] = useState<IAddDoctorEducation>({
        instituteName: "",
        qualificationName: ""
    });

    const [allEducation, setAllEducation] = useState<IDoctorEducation[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllEducation();
    }, []);

    // GET ALL EDUCATION
    const getAllEducation = async () => {
        setLoading(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_EDUCATION + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setAllEducation(result.data);
    }

    // ADD EDUCATION
    const addEducation = async () => {
        setLoading(true);

        if (!validateEducation()) {
            setLoading(false);
            return;
        }

        let data = {
            doctorId: props.context.userId,
            instituteName: newEducation.instituteName,
            qualificationName: newEducation.qualificationName
        }

        const result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_DOCTOR_EDUCATION, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        setNewEducation({
            instituteName: "",
            qualificationName: ""
        });

        setAddingEducation(false);
        getAllEducation();
    }

    // DELETE EDUCATION
    const deleteEducation = async (id: number) => {
        setLoading(true);

        const result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_DOCTOR_EDUCATION + id);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        getAllEducation();
    }

    // VALIDATE WORK HISTORY
    const validateEducation = (): boolean => {
        if (newEducation.instituteName === "") {
            errorToast("Enter an institute name!", true);
            return false;
        }
        if (newEducation.qualificationName === "") {
            errorToast("Enter a qualification name!", true);
            return false;
        }

        return true;
    }

    return (
        <div className="w-100 hor-center vert-flex doctor-work-history-container">

            <div className="w-50 hor-center">
                <Button onClick={() => setAddingEducation(true)} variant="success">Add New</Button>
            </div>

            {
                // Add education
                <Modal show={addingEducation} backdrop="static" onHide={() => setAddingEducation(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Education</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="Institute">
                                <Form.Label>Institute Name:</Form.Label>
                                <Form.Control onChange={(e) => setNewEducation({ ...newEducation, instituteName: e.target.value })} type="text" placeholder="" value={newEducation.instituteName} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="Qualification">
                                <Form.Label>Qualification Name:</Form.Label>
                                <Form.Control onChange={(e) => setNewEducation({ ...newEducation, qualificationName: e.target.value })} type="text" placeholder="" value={newEducation.qualificationName} />
                            </Form.Group>
                        </Form>
                        {
                            // loading icon
                            (loading && addingEducation) &&
                            <Loading />
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddingEducation(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => addEducation()}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            }

            {
                // Display work history cards
                <div className="doctor-education-table hor-center vert-flex space-evenly flex-wrap">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Institute</th>
                                <th>Qualification</th>
                                <th style={{ width: "40px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !loading &&
                                allEducation.map(edu => {
                                    return (
                                        <tr>
                                            <td>{edu.instituteName}</td>
                                            <td>{edu.qualificationName}</td>
                                            <td width="40px"><Trash onClick={() => deleteEducation(edu.id)} className="hor-center hover icon-sm btn-reject" /></td>
                                        </tr>
                                    );
                                })
                            }
                            {
                                loading &&
                                <tr>
                                    <td colSpan={3}><Loading /></td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            }

        </div>
    );
}

export default DoctorEducationPage;