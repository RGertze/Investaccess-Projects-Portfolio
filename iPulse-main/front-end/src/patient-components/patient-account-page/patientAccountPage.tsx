import { ReactNode, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IMedicalAidScheme } from "../../interfaces/medical_aid_interfaces";
import { IBloodType, IGender, IPatientProfile } from "../../interfaces/patient_interfaces";
import UserAccountPage from "../../shared-components/user-account-page/userAccountPage";
import "./patientAccountPage.css";
import Loading from "../../shared-components/loading-component/loading";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import ProfileAccessComponent from "../profile-access-component/profileAccessComponent";
import NextOfKinList from "../next-of-kin-list/nextOfKinList";
import PatientHealthSummaryList from "../../shared-components/patient-health-summary-list/patientHealthSummaryList";
import context from "react-bootstrap/esm/AccordionContext";

interface IProps {
    context: IGlobalContext,
    children?: ReactNode
}

let PatientAccountPage = (props: IProps) => {
    const [patientProfile, setPatientProfile] = useState<IPatientProfile>({
        medicalAidSchemeName: "",
        idNumber: "",
        memberNumber: "",
        nationality: "",
        residentialAddress: "",
        postalAddress: "",
        age: 0,
        gender: 0,
        bloodType: 0,
        secondaryCellphone: ""
    });

    const [medicalAidSchemeId, setMedicalAidSchemeId] = useState<number>(0);
    const [medicalSchemes, setMedicalSchemes] = useState<IMedicalAidScheme[]>([]);

    const [bloodTypes, setBloodTypes] = useState<IBloodType[]>([]);
    const [genders, setGenders] = useState<IGender[]>([]);

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [tabKey, initTabKey] = useState('profile');

    // Comp did mount
    useEffect(() => {
        const init = async () => {
            await getBloodTypes();
            await getGenders();
            await getUserProfileDetails();
            await getMedicalAidSchemes();
        }
        init();
    }, []);

    // On medical schemes update
    useEffect(() => {
        if (medicalSchemes.length === 0)
            return;

        if (patientProfile.medicalAidSchemeName.length === 0)
            return;

        let medicalScheme = medicalSchemes.find(ms => ms.medicalAidSchemeName.toLowerCase() === patientProfile.medicalAidSchemeName.toLowerCase());

        if (medicalScheme)
            setMedicalAidSchemeId(medicalScheme.medicalAidSchemeId);

    }, [medicalSchemes])

    // On medical scheme id update
    useEffect(() => {
        let msName = medicalSchemes.find(ms => ms.medicalAidSchemeId === medicalAidSchemeId)?.medicalAidSchemeName
        if (msName)
            setPatientProfile({ ...patientProfile, medicalAidSchemeName: msName });
    }, [medicalAidSchemeId]);

    // GET MEDICAL AID SCHEMES
    const getMedicalAidSchemes = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_MEDICAL_AID_SCHEMES, "");
        if (result.errorMessage.length === 0) {
            setMedicalSchemes(result.data);
        }
    }

    // GET GENDERS
    const getGenders = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_GENDERS, "");
        if (result.errorMessage.length === 0) {
            setGenders(result.data);
        }
    }

    // GET BLOOD TYPES
    const getBloodTypes = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_BLOOD_TYPES, "");
        if (result.errorMessage.length === 0) {
            setBloodTypes(result.data);
        }
    }

    // GET PATIENT PROFILE  
    const getUserProfileDetails = async () => {
        setLoading(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_PATIENT_PROFILE + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setLoading(false);
        setPatientProfile(result.data);
    }

    // UPDATE PATIENT PROFILE 
    const updateProfileDetails = async () => {
        setLoading(true);

        if (!validateUserDetails()) {
            setLoading(false);
            return;
        }

        let data = {
            userId: props.context.userId,
            medicalAidSchemeId: medicalAidSchemeId,
            idNumber: patientProfile.idNumber,
            memberNumber: patientProfile.memberNumber,
            nationality: patientProfile.nationality,
            residentialAddress: patientProfile.residentialAddress,
            postalAddress: patientProfile.postalAddress,
            age: patientProfile.age,
            gender: patientProfile.gender,
            bloodType: patientProfile.bloodType,
            secondaryCellphone: patientProfile.secondaryCellphone
        }

        let result = await Connection.postRequest(POST_ENDPOINT.UPDATE_PATIENT_PROFILE, data, {});
        setLoading(false);

        if (result.errorMessage.length > 0) {
            alert(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }

        setEditing(false);
        successToast("Profile updated", true);
        getUserProfileDetails();
    }

    // VALIDATE USER DETAILS 
    const validateUserDetails = (): boolean => {
        if (patientProfile.idNumber === "") {
            errorToast("Enter an Id number!");
            return false;
        }
        if (patientProfile.memberNumber === "") {
            errorToast("Enter a member number!");
            return false;
        }
        if (patientProfile.nationality === "") {
            errorToast("Enter a nationality!");
            return false;
        }
        if (patientProfile.age === 0) {
            errorToast("Enter an age!");
            return false;
        }
        if (patientProfile.gender === 0) {
            errorToast("Enter a gender!");
            return false;
        }
        if (patientProfile.bloodType === 0) {
            errorToast("Enter a blood type!");
            return false;
        }

        return true;
    }

    return (
        <>
            <UserAccountPage context={props.context} children={
                <Tabs activeKey={tabKey} onSelect={(e) => initTabKey(e ? e : "profile")}>
                    <Tab className="patient-profile-tab" eventKey="profile" title="Profile">
                        <Form>
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formPatientId">
                                    <Form.Label>ID Number</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, idNumber: e.target.value })} type="text" value={patientProfile.idNumber} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formNationality">
                                    <Form.Label>Nationality</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, nationality: e.target.value })} type="text" value={patientProfile.nationality} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formMedicalScheme">
                                    <Form.Label>Medical Scheme</Form.Label>
                                    <Form.Select disabled={!editing} onChange={(e) => setMedicalAidSchemeId(parseInt(e.target.value))} value={medicalAidSchemeId}>
                                        <option value={0}></option>
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
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, memberNumber: e.target.value })} type="text" placeholder="Member Number" value={patientProfile.memberNumber} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formAge">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, age: parseInt(e.target.value) })} type="number" value={patientProfile.age} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formGender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, gender: parseInt(e.target.value) })} value={patientProfile.gender}>
                                        <option value={0}></option>
                                        {
                                            genders.map((gender) => {
                                                return (
                                                    <option value={gender.genderId}>{gender.genderName}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formBloodType">
                                    <Form.Label>Blood Type</Form.Label>
                                    <Form.Select disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, bloodType: parseInt(e.target.value) })} value={patientProfile.bloodType}>
                                        <option value={0}></option>
                                        {
                                            bloodTypes.map((bloodType) => {
                                                return (
                                                    <option value={bloodType.bloodTypeId}>{bloodType.bloodTypeName}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formSecondCell">
                                    <Form.Label>Secondary Cellphone</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, secondaryCellphone: e.target.value })} type="text" value={patientProfile.secondaryCellphone} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formResidentialAddress">
                                    <Form.Label>Residential Address</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, residentialAddress: e.target.value })} type="text" value={patientProfile.residentialAddress} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formPostalAddress">
                                    <Form.Label>Postal Address</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setPatientProfile({ ...patientProfile, postalAddress: e.target.value })} type="text" value={patientProfile.postalAddress} />
                                </Form.Group>
                            </Row>

                            {
                                loading &&
                                <Loading />
                            }

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formEdit">
                                    <Button variant={editing ? "outline-primary" : "primary"} className="user-account-form-btn" onClick={() => {
                                        editing ? setEditing(false) : setEditing(true);
                                    }}>{editing ? "Cancel" : "Edit"}</Button>
                                </Form.Group>

                                {
                                    editing &&
                                    <Form.Group as={Col} className="mb-3" controlId="formEdit">
                                        <Button variant="success" className="user-account-form-btn" onClick={() => {
                                            updateProfileDetails();
                                        }}>Submit</Button>
                                    </Form.Group>
                                }
                            </Row>
                        </Form>

                    </Tab>
                    <Tab className="profile-access-tab" eventKey="profile-access" title="Profile Access">
                        <ProfileAccessComponent context={props.context} />
                    </Tab>
                    <Tab className="next-of-kin-tab" eventKey="next-of-Kin" title="Next of Kin">
                        <NextOfKinList context={props.context} />
                    </Tab>
                    <Tab className="health-summary-tab" eventKey="health-summary" title="Health Summary">
                        <PatientHealthSummaryList context={props.context} patientId={props.context.userId} />
                    </Tab>
                </Tabs>
            } />

        </>
    );
}


export default PatientAccountPage;