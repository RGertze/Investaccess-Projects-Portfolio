import "./registrationPage.css";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { USER_TYPE } from "../../interfaces/general_enums";
import { IMedicalAidScheme } from "../../interfaces/medical_aid_interfaces";
import { IDoctorSpecialty } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { useNavigate } from "react-router-dom";
import Loading from "../../shared-components/loading-component/loading";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";

interface IState {
    userType: USER_TYPE,
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,

    // patient fields
    idNumber: string,
    memberNumber: string,

    // doctor fields
    nationality: string,
    practiceName: string,
    practiceNumber: string
}

interface IProps {
    context: IGlobalContext
}

let RegistrationPage = (props: IProps) => {

    const [state, setState] = useState<IState>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        userType: USER_TYPE.PATIENT,

        idNumber: "",
        memberNumber: "",

        nationality: "",
        practiceName: "",
        practiceNumber: ""
    });

    const [medicalSchemes, setMedicalSchemes] = useState<IMedicalAidScheme[]>([]);
    const [specialties, setSpecialties] = useState<IDoctorSpecialty[]>([]);
    const [medicalAidSchemeId, setMedicalAidSchemeId] = useState<number>(0);
    const [specialtyId, setSpecialtyId] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // Get medical aid schemes
    useEffect(() => {
        const getMedicalAidSchemes = async () => {
            let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_MEDICAL_AID_SCHEMES, "");
            if (result.errorMessage.length === 0) {
                setMedicalSchemes(result.data);
                if (result.data.length > 0) {
                    setMedicalAidSchemeId(result.data[0].medicalAidSchemeId);
                }
            }
        }
        getMedicalAidSchemes();
    }, []);

    // Get all doctor specialties
    useEffect(() => {
        const getDoctorSpecialties = async () => {
            let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_SPECIALTY_TYPES, "");
            if (result.errorMessage.length === 0) {
                setSpecialties(result.data);
                if (result.data.length > 0) {
                    setSpecialtyId(result.data[0].specialtyId);
                }
            }
        }
        getDoctorSpecialties();
    }, []);


    const validateUser = (): boolean => {
        if (state.email === "") {
            errorToast("Enter an email address!")
            return false;
        }
        if (state.firstName === "") {
            errorToast("Enter a first name!")
            return false;
        }
        if (state.lastName === "") {
            errorToast("Enter a last name!")
            return false;
        }
        if (state.password === "") {
            errorToast("Enter a password!")
            return false;
        }
        if (state.password !== state.confirmPassword) {
            errorToast("Passwords do not match!")
            return false;
        }

        return true;
    }

    const validatePatient = (): boolean => {
        let idNum = (state.idNumber).trim();
        if (idNum === "") {
            errorToast("Enter your Id number!")
            return false;
        }
        if (idNum.length !== 11) {
            errorToast("Id must be 11 digits long with no spaces!")
            return false;
        }
        if (medicalAidSchemeId === 0) {
            errorToast("Choose a medical scheme!")
            return false;
        }
        if (state.memberNumber === "") {
            errorToast("Enter a member number!")
            return false;
        }

        return true;
    }

    const validateDoctor = (): boolean => {
        if (specialtyId === 0) {
            errorToast("Choose a specialty!")
            return false;
        }
        if (state.nationality === "") {
            errorToast("Enter a nationality!")
            return false;
        }
        if (state.practiceName === "") {
            errorToast("Enter a practice name!")
            return false;
        }
        if (state.practiceNumber === "") {
            errorToast("Enter a practice number!")
            return false;
        }

        return true;
    }

    const registerUser = async (): Promise<boolean> => {
        let data = {
            userType: state.userType,
            email: state.email,
            password: state.password,
            firstName: state.firstName,
            lastName: state.lastName
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REGISTER_USER, data, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return false;
        }

        return true;
    }

    const registerPatient = async () => {
        setLoading(true);
        if (validateUser() && validatePatient()) {
            if (await registerUser()) {
                let data = {
                    email: state.email,
                    idNumber: state.idNumber,
                    medicalAidScheme: medicalAidSchemeId,
                    memberNumber: state.memberNumber
                }
                let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REGISTER_PATIENT, data, {});
                setLoading(false);
                if (result.errorMessage.length > 0) {
                    successToast("Account has been created successfully! But your profiles creation has failed: " + result.errorMessage + " .\n Check your email for a confirmation message!", true, 5000)
                }
                props.context.setUsername(state.email);
                navigate("/account-created");
            }
        }
        setLoading(false);
    }

    const registerDoctor = async () => {
        setLoading(true);
        if (validateUser() && validateDoctor()) {
            if (await registerUser()) {
                let data = {
                    email: state.email,
                    nationality: state.nationality,
                    specialty: specialtyId,
                    practiceName: state.practiceName,
                    practiceNumber: state.practiceNumber
                }
                let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REGISTER_DOCTOR, data, {});
                setLoading(false);
                if (result.errorMessage.length > 0) {
                    successToast("Account has been created successfully! But your profiles creation has failed: " + result.errorMessage + " .\n Check your email for a confirmation message!", true, 5000)
                }
                props.context.setUsername(state.email);
                navigate("/account-created");
            }
        }
        setLoading(false);
    }


    return (
        <div className="registration-container">
            <div className=" p-3 mb-5  rounded hor-center register-form-container">
                <div className="vert-flex space-between sign-up-header">
                    <h1 style={{ color: props.context.theme.tertiary }}>Sign up</h1>
                    {
                        state.userType === USER_TYPE.PATIENT &&
                        <h5 style={{ color: props.context.theme.tertiary }} onClick={() => setState({ ...state, userType: USER_TYPE.DOCTOR })}>Are you a Doctor?</h5>
                    }
                    {
                        state.userType === USER_TYPE.DOCTOR &&
                        <h5 style={{ color: props.context.theme.tertiary }} onClick={() => setState({ ...state, userType: USER_TYPE.PATIENT })}>Are you a Patient?</h5>
                    }
                </div>

                <hr className="hor-center" style={{ width: "100%", height: "1px" }} />

                <Form>
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, firstName: e.target.value })} type="text" placeholder="First name" />
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, lastName: e.target.value })} type="text" placeholder="Last name" />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, email: e.target.value })} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, password: e.target.value })} type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, confirmPassword: e.target.value })} type="password" placeholder="Confirm Password" />
                        </Form.Group>
                    </Row>

                    <hr className="hor-center" style={{ width: "100%", height: "1px", color: "#666" }} />

                    {
                        //  Patient Fields

                        state.userType === USER_TYPE.PATIENT &&
                        <>
                            <Form.Group className="mb-3" controlId="formPatientId">
                                <Form.Label>ID Number</Form.Label>
                                <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, idNumber: e.target.value })} type="text" placeholder="Enter Id" />
                            </Form.Group>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formMedicalScheme">
                                    <Form.Label>Medical Scheme</Form.Label>
                                    <Form.Select style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setMedicalAidSchemeId(parseInt(e.target.value))}>
                                        {
                                            medicalSchemes.map((scheme) => {
                                                return (
                                                    <option value={scheme.medicalAidSchemeId}>{scheme.medicalAidSchemeName}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} className="mb-3" controlId="formMemberNumber">
                                    <Form.Label>Member Number</Form.Label>
                                    <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, memberNumber: e.target.value })} type="text" placeholder="Member Number" />
                                </Form.Group>
                            </Row>
                        </>
                    }

                    {
                        //  Doctor Fields
                        state.userType === USER_TYPE.DOCTOR &&
                        <>
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formSpecialty">
                                    <Form.Label>Specialty</Form.Label>
                                    <Form.Select style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setSpecialtyId(parseInt(e.target.value))}>
                                        {
                                            specialties.map((specialty) => {
                                                return (
                                                    <option value={specialty.specialtyId}>{specialty.specialtyName}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} className="mb-3" controlId="formNationality">
                                    <Form.Label>Nationality</Form.Label>
                                    <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, nationality: e.target.value })} type="text" placeholder="Nationality" />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formPracticeName">
                                    <Form.Label>Practice Name</Form.Label>
                                    <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, practiceName: e.target.value })} type="text" placeholder="Practice Name" />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formPracticeNumber">
                                    <Form.Label>Practice Number</Form.Label>
                                    <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setState({ ...state, practiceNumber: e.target.value })} type="text" placeholder="Practice Number" />
                                </Form.Group>
                            </Row>
                        </>
                    }

                    <Button style={{ backgroundColor: props.context.theme.secondary }} type="button" onClick={() => { (state.userType === USER_TYPE.PATIENT) ? registerPatient() : registerDoctor() }}>
                        Submit
                    </Button>
                </Form>

                {
                    loading &&
                    <Loading />
                }
            </div>
        </div>
    );
}


export default RegistrationPage;