import "./allDoctorsPage.css";
import { IDoctor, IDoctorAll, IDoctorSearch, IDoctorSpecialty } from "../../interfaces/doctor_interfaces";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import { Connection, GET_ENDPOINT } from "../../connection";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../alert-components/toasts";
import DoctorCard from "../doctor-card/doctorCard";
import Loading from "../loading-component/loading";
import { preProcessFile } from "typescript";
import SignUpPrompt from "../sign-up-prompt/signUpPrompt";

interface IProps {
    context: IGlobalContext
}

let AllDoctorsPage = (props: IProps) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

    const [doctors, setDoctors] = useState<IDoctorAll[]>([]);
    const [searchQuery, setSearchQuery] = useState<IDoctorSearch>({
        specialtyId: 0,
        firstName: "",
        lastName: "",
        city: "",
        email: "",
        nationality: ""
    });

    const [specialties, setSpecialties] = useState<IDoctorSpecialty[]>([]);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getDoctorSpecialties();
        getAllDoctors();
    }, []);

    //----   GET ALL DOCTORS   ----
    const getAllDoctors = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTORS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("error retrieving doctors: " + result.errorMessage, true);
        }
        setDoctors(result.data);
    }

    //----   Navigate to doctor   ----
    const navigateToDoctor = (doctorId) => {
        if (props.context.userType !== UserType.PUBLIC)
            navigate(`/patient/doctor/${doctorId}`, { state: { userId: doctorId } });

        // show popup requiring signup
        setShowSignUpPrompt(true);
    }

    //----   GET DOCTOR SPECIALTIES   ----
    const getDoctorSpecialties = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_SPECIALTY_TYPES, "");
        if (result.errorMessage.length === 0) {
            setSpecialties(result.data);
        }
    }

    //----   SEARCH DOCTORS   ----
    const searchDoctors = async () => {
        setLoading(true);
        let qry = buildSearchQry();
        // get all doctors if qry is empty
        let result: IResponse = await Connection.getRequest((qry.length === 1) ? GET_ENDPOINT.GET_ALL_DOCTORS : GET_ENDPOINT.SEARCH_DOCTORS + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("error retrieving doctors: " + result.errorMessage, true, 3000);
        }
        setDoctors(result.data);
    }

    //----   BUILD SEARCH QUERY    ----
    const buildSearchQry = (): string => {
        let qry = "?";

        if (searchQuery.specialtyId !== 0)
            qry += `specialtyId=${searchQuery.specialtyId}`;
        if (searchQuery.firstName !== "") {
            if (qry.length > 1)
                qry += "&";
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
        if (searchQuery.nationality !== "") {
            if (qry.length > 1)
                qry += "&";
            qry += `nationality=${searchQuery.nationality}`;
        }
        if (searchQuery.city !== "") {
            if (qry.length > 1)
                qry += "&";
            qry += `city=${searchQuery.city}`;
        }

        qry.replaceAll(" ", "+");

        return qry;
    }

    return (
        <div className="all-doctors-container">
            <h2 style={{ color: props.context.theme.tertiary }} className="hor-center">All Doctors</h2>

            <div className="all-doctors-panels">
                <div style={{ backgroundColor: props.context.theme.primary }} className="all-doctors-search rounded">
                    <h5 style={{ color: props.context.theme.tertiary }}>Search Filter</h5>
                    <Form>
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="formFirstName">
                                <Form.Label style={{ color: props.context.theme.tertiary }}>First Name</Form.Label>
                                <Form.Control onChange={(e) => setSearchQuery({ ...searchQuery, firstName: e.target.value })} type="text" placeholder="" value={searchQuery.firstName} />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="formLastName">
                                <Form.Label style={{ color: props.context.theme.tertiary }}>Last Name</Form.Label>
                                <Form.Control onChange={(e) => setSearchQuery({ ...searchQuery, lastName: e.target.value })} type="text" placeholder="" value={searchQuery.lastName} />
                            </Form.Group>
                        </Row>
                        <Form.Group as={Col} className="mb-3" controlId="formSpecialty">
                            <Form.Label style={{ color: props.context.theme.tertiary }}>Specialty</Form.Label>
                            <Form.Select onChange={(e) => setSearchQuery({ ...searchQuery, specialtyId: parseInt(e.target.value) })} >
                                <option value={0}>Any</option>
                                {
                                    specialties.map((sp, index) => {
                                        return (
                                            <option key={index} value={sp.specialtyId}>{sp.specialtyName}</option>
                                        );
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="formEmail">
                            <Form.Label style={{ color: props.context.theme.tertiary }}>Email</Form.Label>
                            <Form.Control onChange={(e) => setSearchQuery({ ...searchQuery, email: e.target.value })} type="email" placeholder="" value={searchQuery.email} />
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="formCity">
                            <Form.Label style={{ color: props.context.theme.tertiary }}>City</Form.Label>
                            <Form.Select onChange={(e) => setSearchQuery({ ...searchQuery, city: e.target.value })} >
                                <option value={""}>Any</option>
                                <option value={"Windhoek"}>Windhoek</option>
                                <option value={"Swakopmund"}>Swakopmund</option>
                                <option value={"Walvis Bay"}>Walvis Bay</option>
                            </Form.Select>
                        </Form.Group>
                        <Button onClick={() => searchDoctors()}>Search</Button>
                    </Form>
                </div>

                <div className="all-doctors rounded">
                    {
                        !loading &&
                        doctors.map((doctor, index) => {
                            return (
                                <DoctorCard key={index} context={props.context} doctor={doctor} viewDoctor={() => navigateToDoctor(doctor.userId)} />
                            );
                        })
                    }
                    {
                        (!loading && doctors.length === 0) &&
                        <h5>Nothing to Show!</h5>
                    }
                    {
                        loading &&
                        <Loading />
                    }
                </div>

                {
                    // SIGN UP PROMPT FOR UNREGISTERED USERS
                    showSignUpPrompt &&
                    <SignUpPrompt hide={() => setShowSignUpPrompt(false)} message={"Only registered users can view a doctor's profile!"} />
                }
            </div>
        </div>
    );
}

export default AllDoctorsPage;