import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IPatientSearch } from "../../interfaces/patient_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import UserCard from "../../shared-components/user-card-component/userCard";
import "./patientsListComponent.css";

export enum PATIENTS_LIST_TYPE {
    ALL,
    MY
}

interface IProps {
    type: PATIENTS_LIST_TYPE,
    refreshTracker: number,
    doctorId: number,
    context: IGlobalContext
}

let PatientsList = (props: IProps) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [patients, setPatients] = useState<IUser[]>([]);

    const [searchQuery, setSearchQuery] = useState<IPatientSearch>({ email: "", firstName: "", lastName: "" });

    // COMPONENT DID MOUNT
    useEffect(() => {
        getPatients();
    }, []);

    // ON REFRESH TRACKER CHANGE
    useEffect(() => {
        if (props.type === PATIENTS_LIST_TYPE.ALL)
            getAllPatients();

        if (props.type === PATIENTS_LIST_TYPE.MY)
            getAllADoctorsPatients();
    }, [props.refreshTracker]);


    // GET PATIENTS
    const getPatients = async () => {
        if (props.type === PATIENTS_LIST_TYPE.ALL)
            getAllPatients();

        if (props.type === PATIENTS_LIST_TYPE.MY)
            getAllADoctorsPatients();
    }

    // GET ALL PATIENTS
    const getAllPatients = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PATIENTS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setPatients(result.data);
    }

    // GET ALL A DOCTOR'S PATIENTS
    const getAllADoctorsPatients = async () => {
        setLoading(true);
        let qry = `?doctorId=${props.doctorId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_A_DOCTORS_PATIENTS + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setPatients(result.data);
    }

    //----   SEARCH PATIENTS   ----
    const searchPatients = async () => {
        setLoading(true);
        let qry = buildSearchQry();

        // get all doctors if qry is empty
        if (qry.length === 1) {
            getPatients();
            return;
        }

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.SEARHC_PATIENTS + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("error retrieving patients: " + result.errorMessage, true, 3000);
        }
        setPatients(result.data);
    }

    //----   BUILD SEARCH QUERY    ----
    const buildSearchQry = (): string => {
        let qry = "?";

        if (searchQuery.firstName !== "") {
            qry += `firstName=${searchQuery.firstName}`;
        }
        if (searchQuery.lastName !== "") {
            if (qry.length > 1)
                qry += "&";
            qry += `lastName=${searchQuery.lastName}`;
        }
        if (searchQuery.email !== "") {
            if (qry.length > 1)
                qry += "&";
            qry += `email=${searchQuery.email}`;
        }

        // query doctor's patients
        if (props.type === PATIENTS_LIST_TYPE.MY) {
            if (qry.length > 1)
                qry += "&";
            qry += `doctorId=${props.doctorId}`;
        }

        qry.replaceAll(" ", "+");

        return qry;
    }

    // VIEW PATIENT
    const viewPatient = (user: IUser) => {
        navigate(`/doctor/patients/view/${user.userId}`, { state: user });
    }

    return (
        <div className="hor-center patients-list-container">

            <div style={{ backgroundColor: props.context.theme.primary, color: props.context.theme.tertiary }} className="patient-search-container hor-center rounded">
                <h5>Search Filter</h5>
                <Form>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control onChange={(e) => setSearchQuery({ ...searchQuery, firstName: e.target.value })} type="text" placeholder="" value={searchQuery.firstName} />
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control onChange={(e) => setSearchQuery({ ...searchQuery, lastName: e.target.value })} type="text" placeholder="" value={searchQuery.lastName} />
                        </Form.Group>
                    </Row>
                    <Form.Group as={Col} className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={(e) => setSearchQuery({ ...searchQuery, email: e.target.value })} type="email" placeholder="" value={searchQuery.email} />
                    </Form.Group>
                    <Button onClick={() => searchPatients()}>Search</Button>
                </Form>
            </div>

            <div className="patients-list rounded">
                {
                    !loading &&
                    patients.map((patient, index) => {
                        return (
                            <UserCard onViewClick={() => viewPatient(patient)} context={props.context} user={patient} />
                        );
                    })
                }
                {
                    (!loading && patients.length === 0) &&
                    <h5>Nothing to show</h5>
                }
                {
                    loading &&
                    <Loading />
                }
            </div>
        </div>
    );
}

export default PatientsList;