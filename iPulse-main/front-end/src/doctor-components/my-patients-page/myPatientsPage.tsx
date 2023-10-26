import { useEffect, useState } from "react";
import { Check2, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IRequestToBePersonalDoctor } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse, ISignedGetRequest } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import PatientsList, { PATIENTS_LIST_TYPE } from "../patients-list-component/patientsListComponent";
import "./myPatientsPage.css";

interface IProps {
    context: IGlobalContext
}

let MyPatientsPage = (props: IProps) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingReqsToBePersonalDoc, setLoadingReqsToBePersonalDoc] = useState(false);

    const [patientsListRefreshTracker, setPatientsListRefreshTracker] = useState(1);

    const [requestsToBePersonalDoctor, setRequestsToBePersonalDoctor] = useState<IRequestToBePersonalDoctor[]>([]);
    const [reqToBeDoctorProfileUrls, setReqToBeDoctorProfileUrls] = useState<string[]>([]);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getReqsToBeDoc();
    }, []);

    // ON REQS TO BE PERSONAL DOCTOR CHANGE
    useEffect(() => {
        getProfilePicUrls();
    }, [requestsToBePersonalDoctor]);


    //----   GET REQUESTS TO BE PERSONAL DOCTOR   ----
    const getReqsToBeDoc = async () => {
        setLoadingReqsToBePersonalDoc(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REQUESTS_TO_BE_PERSONAL_DOCTOR + props.context.userId, "");
        setLoadingReqsToBePersonalDoc(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }

        console.log(result.data);

        // create array of empty strings for profile pic urls
        let arr = Array<string>(result.data.length).fill("");
        setReqToBeDoctorProfileUrls(arr);

        setRequestsToBePersonalDoctor(result.data);
    }

    //----   GET PROFILE PICS URLS   ----
    const getProfilePicUrls = async () => {
        for (let i = 0; i < requestsToBePersonalDoctor.length; i++) {
            getProfilePicUrl(requestsToBePersonalDoctor[i].profilePicPath, i);
        }
    }

    //----   GET PROFILE PIC URL   ----
    const getProfilePicUrl = async (filePath: string, index) => {
        let data = {
            filePath: filePath
        }

        // get signed get url
        let result = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, data, {});
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }

        let urls = reqToBeDoctorProfileUrls.slice();
        urls[index] = (result.data as ISignedGetRequest).signedUrl;

        setReqToBeDoctorProfileUrls(urls);
    }

    //----   APPROVE REQUEST TO BE DOCTOR   ----
    const approveRequestToBeDoctor = async (approvalCode: string, patientId: number) => {
        let data = {
            patientId: patientId,
            doctorId: props.context.userId,
            approvalCode: approvalCode
        }

        let result = await Connection.postRequest(POST_ENDPOINT.APPROVE_REQUEST_TO_BE_PERSONAL_DOCTOR, data, {});
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }

        setPatientsListRefreshTracker(-patientsListRefreshTracker);
        getReqsToBeDoc();
    }

    //----   REJECT REQUEST TO BE DOCTOR   ----
    const rejectRequestToBeDoctor = async (approvalCode: string, patientId: number) => {
        let data = {
            patientId: patientId,
            doctorId: props.context.userId,
            approvalCode: approvalCode
        }

        let result = await Connection.postRequest(POST_ENDPOINT.REJECT_REQUEST_TO_BE_PERSONAL_DOCTOR, data, {});
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }

        getReqsToBeDoc();
    }

    return (
        <div className=" my-patients-page-container">
            <h4 style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }} className="hor-center rounded vert-flex justify-center my-patients-title">My Patients</h4>

            <PatientsList context={props.context} refreshTracker={patientsListRefreshTracker} doctorId={props.context.userId} type={PATIENTS_LIST_TYPE.MY} />

            {
                // patient requests to be their doctor
                <div className="hor-center rounded shadow-sm patient-requests-container">
                    <h4 style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }} className="vert-flex rounded justify-center">Patient requests</h4>
                    <p>These patients would like to make you their personal doctor!</p>

                    <div className="patient-requests vert-flex space-evenly">
                        {
                            requestsToBePersonalDoctor.map((req, index) => {
                                return (
                                    <div key={index} className="vert-flex shadow rounded patient-view-user-details">
                                        <div className="hor-center">
                                            {
                                                <img className="rounded" src={reqToBeDoctorProfileUrls[index].length > 0 ? reqToBeDoctorProfileUrls[index] : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />
                                            }
                                            <h6>{req.firstName} {req.lastName}</h6>
                                            <p>{req.email}</p>
                                            <div className="w-75 vert-flex hor-center space-evenly">
                                                <X onClick={() => rejectRequestToBeDoctor(req.approvalCode, req.patientId)} className="hover icon-sm btn-reject" />
                                                <Check2 onClick={() => approveRequestToBeDoctor(req.approvalCode, req.patientId)} className="hover icon-sm btn-approve" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            requestsToBePersonalDoctor.length === 0 &&
                            <h5>Nothing to show</h5>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default MyPatientsPage;