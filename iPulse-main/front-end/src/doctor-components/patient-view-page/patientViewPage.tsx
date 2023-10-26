import { useEffect, useState } from "react";
import { Button, Card, Tab, Table, Tabs } from "react-bootstrap";
import { Lock } from "react-bootstrap-icons";
import context from "react-bootstrap/esm/AccordionContext";
import { useLocation } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { APPROVAL_STATUS, NOTIFICATIONS_TYPE } from "../../interfaces/general_enums";
import { IGlobalContext, IResponse, ISignedGetRequest, IUser } from "../../interfaces/general_interfaces";
import { IPatientProfile, IPatientProfileForDoctor, IRequestStatus } from "../../interfaces/patient_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import PatientHealthSummaryList from "../../shared-components/patient-health-summary-list/patientHealthSummaryList";
import "./patientViewPage.css";

interface IProps {
    context: IGlobalContext
}

let PatientViewPage = (props: IProps) => {
    const params = useLocation();
    const user: IUser = (params.state as IUser);
    const [profilePicUrl, setProfilePicUrl] = useState("");


    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('profile');

    const [loading, setLoading] = useState(false);

    const [accessStatus, setAccessStatus] = useState<APPROVAL_STATUS>(APPROVAL_STATUS.REJECTED);
    const [patientProfile, setPatientProfile] = useState<IPatientProfileForDoctor>({
        medicalAidSchemeName: "",
        idNumber: "",
        memberNumber: "",
        nationality: "",
        residentialAddress: "",
        postalAddress: "",
        age: 0,
        gender: "",
        bloodType: "",
        secondaryCellphone: ""
    });


    // COMPONENT DID MOUNT
    useEffect(() => {
        getProfilePicUrl();
        getProfileAccessStatus();
    }, []);

    //----   ON APPOINTMENT NOTIFICATION RECEIVED    ----
    useEffect(() => {
        if (props.context.newNotificationRecv) {
            if (props.context.newNotificationRecv.typeId === NOTIFICATIONS_TYPE.PROFILE_ACCESS)
                getProfileAccessStatus();
        }
    }, [props.context.newNotificationRecv]);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        let result = await Connection.getS3GetUrl(user.profilePicPath);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
    }

    // GET PROFILE ACCESS STATUS
    const getProfileAccessStatus = async () => {
        setLoading(true);

        let qry = `?patientId=${user.userId}&doctorId=${props.context.userId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PATIENT_PROFILE_ACCESS_STATUS + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            setAccessStatus(APPROVAL_STATUS.REJECTED);
            return;
        }
        let status = (result.data as IRequestStatus).status;
        console.log(status);
        setAccessStatus(status);

        if (status === APPROVAL_STATUS.APPROVED)
            getPatientProfile();
    }

    // REQUEST PROFILE ACCESS
    const requestProfileAccess = async () => {
        setLoading(true);

        let data = {
            doctorId: props.context.userId,
            patientId: user.userId
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REQUEST_PATIENT_PROFILE_ACCESS, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast("Failed to request access: " + result.errorMessage, true);
            return;
        }

        setAccessStatus(APPROVAL_STATUS.PENDING);
    }

    // GET PROFILE
    const getPatientProfile = async () => {
        setLoading(true);

        let qry = `?patientId=${user.userId}&doctorId=${props.context.userId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PATIENT_PROFILE_FOR_DOCTOR + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setPatientProfile(result.data);
    }


    return (
        <div className="vert-flex w-100 patient-view-page-container">

            <div className="hor-center shadow rounded patient-view-card">
                {   // USER DETAILS
                    <div className="vert-flex patient-view-user-details">
                        <div className="hor-center">
                            {
                                profilePicUrl.length > 0 &&
                                <img className="rounded-circle" src={profilePicUrl} alt="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" />
                            }
                            <h4>{user.firstName} {user.lastName}</h4>
                            <p>{user.email}</p>
                        </div>
                    </div>
                }
                {   // PROFILE DETAILS

                    <div className="patient-view-profile-details">
                        {
                            loading &&
                            <Loading />
                        }
                        {
                            (!loading) &&
                            <>
                                {
                                    // ACCESS NOT APPROVED

                                    accessStatus !== APPROVAL_STATUS.APPROVED &&
                                    <div className="vert-flex profile-access-denied">
                                        <div className="hor-center">
                                            <Lock color="#555" className="lock-med" />
                                            <h6 className="hor-center">You do not have access to this profile!</h6>
                                            {
                                                accessStatus === APPROVAL_STATUS.REJECTED &&
                                                <Button onClick={() => requestProfileAccess()} variant="outline-success">Request Access</Button>
                                            }
                                            {
                                                accessStatus === APPROVAL_STATUS.PENDING &&
                                                <Button variant="outline-warning" disabled>Request is pending</Button>
                                            }
                                        </div>
                                    </div>
                                }

                                {
                                    // ACCESS APPROVED

                                    accessStatus === APPROVAL_STATUS.APPROVED &&
                                    <Tabs className="patient-view-tabs" activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "profile")}>
                                        <Tab className="profile-tab" eventKey="profile" title="Profile">
                                            <div className="flex-vert hor-center rounded profile-details-table">
                                                <Table responsive className="">
                                                    <tbody>
                                                        <tr>
                                                            <td className="col1">Medical Aid Scheme</td>
                                                            <td>{patientProfile.medicalAidSchemeName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Id Number</td>
                                                            <td>{patientProfile.idNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Member Number</td>
                                                            <td>{patientProfile.memberNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Nationality</td>
                                                            <td>{patientProfile.nationality}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Age</td>
                                                            <td>{patientProfile.age}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Gender</td>
                                                            <td>{patientProfile.gender}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Blood Type</td>
                                                            <td>{patientProfile.bloodType}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Residential Address</td>
                                                            <td>{patientProfile.residentialAddress}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Postal Address</td>
                                                            <td>{patientProfile.postalAddress}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col1">Secondary Cell</td>
                                                            <td>{patientProfile.secondaryCellphone}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Tab>
                                        <Tab className="health-summary-tab" eventKey="health-summary" title="Health Summary">
                                            <PatientHealthSummaryList context={props.context} patientId={user.userId} />
                                        </Tab>
                                    </Tabs>
                                }
                            </>
                        }
                    </div>
                }
            </div>

        </div>
    );
}

export default PatientViewPage;