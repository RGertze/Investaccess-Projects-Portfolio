import { useEffect, useState } from "react";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IDoctorWithProfileAccess } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IProfileAccessRequest } from "../../interfaces/patient_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import DoctorCard from "../../shared-components/doctor-card/doctorCard";
import Loading from "../../shared-components/loading-component/loading";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import "./profileAccessComponent.css";

interface IProps {
    context: IGlobalContext
}

const ProfileAccessComponent = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<IDoctorWithProfileAccess[]>([]);
    const [doctorBeingRevoked, setDoctorBeingRevoked] = useState(0);

    const [loadingAccessRequests, setLoadingAccessRequests] = useState(false);
    const [requests, setRequests] = useState<IProfileAccessRequest[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        getDoctorsWithProfileAccess();
        getProfileAccessRequests();
    }, []);

    //----   GET DOCTORS WITH PROFILE ACCESS   ----
    const getDoctorsWithProfileAccess = async () => {
        setLoading(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_DOCTORS_WITH_PROFILE_ACCESS + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 1500);
            return;
        }
        setDoctors(result.data);
    }

    //----   REVOKE DOCTOR PROFILE ACCESS   ----
    const revokeDoctorProfileAccess = async (doctor: IDoctorWithProfileAccess) => {
        setDoctorBeingRevoked(doctor.userId);
        let data = {
            doctorId: doctor.userId,
            patientId: props.context.userId,
            approvalCode: doctor.approvalCode
        }
        let result = await Connection.postRequest(POST_ENDPOINT.REVOKE_PATIENT_PROFILE_ACCESS, data, {});
        setDoctorBeingRevoked(0);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 1500);
            return;
        }
        successToast("Doctor access revoked", true, 2000);
        getDoctorsWithProfileAccess();
    }

    //----   GET PROFILE ACCESS REQUESTS   ----
    const getProfileAccessRequests = async () => {
        setLoadingAccessRequests(true);
        const result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PATIENT_PROFILE_ACCESS_REQUESTS + props.context.userId, "");
        setLoadingAccessRequests(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("error profile access requests doctors: " + result.errorMessage, true);
            return;
        }
        setRequests(result.data);
    }

    //----   APPROVE PROFILE ACCESS   ----
    const approveProfileAccess = async (request: IProfileAccessRequest) => {
        setLoadingAccessRequests(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.APPROVE_PATIENT_PROFILE_ACCESS, {
            doctorId: request.doctorId,
            patientId: request.patientId,
            approvalCode: request.approvalCode,
        }, {});
        setLoadingAccessRequests(false);
        if (result.errorMessage.length > 0) {
            errorToast("Failed to approve request: " + result.errorMessage, true);
            return;
        }
        getProfileAccessRequests();
        getDoctorsWithProfileAccess();
    }

    //----   REJECT PROFILE ACCESS   ----
    const rejectProfileAccess = async (request: IProfileAccessRequest) => {
        setLoadingAccessRequests(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REJECT_PATIENT_PROFILE_ACCESS, {
            doctorId: request.doctorId,
            patientId: request.patientId,
            approvalCode: request.approvalCode,
        }, {});
        setLoadingAccessRequests(false);
        if (result.errorMessage.length > 0) {
            errorToast("Failed to reject request: " + result.errorMessage, true);
            return;
        }
        getProfileAccessRequests();
    }


    //----   Navigate to doctor   ----
    const navigateToDoctor = (doctorId) => {
        navigate(`/patient/doctor/${doctorId}`, { state: { userId: doctorId } });
    }

    return (
        <div className="full-size profile-access-component">

            <TableComponent
                title={"Profile Access Requests"}
                context={props.context}
                ids={[...requests]}
                headerValues={["", "Email", "Name"]}
                data={requests.map((request, index) => {
                    return {
                        colValues: [
                            { type: TABLE_DATA_TYPE.AVATAR, value: request.profilePicPath },
                            { type: TABLE_DATA_TYPE.STRING, value: request.email },
                            { type: TABLE_DATA_TYPE.STRING, value: `${request.firstName} ${request.lastName}` },
                        ]
                    };
                })}
                loading={loadingAccessRequests}
                onView={(doc: IProfileAccessRequest) => navigateToDoctor(doc.doctorId)}
                onApprove={approveProfileAccess}
                onReject={rejectProfileAccess}
            />

            <br />

            <TableComponent
                title={"Doctors with profile access"}
                context={props.context}
                ids={[...doctors]}
                headerValues={["", "Email", "Name"]}
                data={doctors.map((doc, index) => {
                    return {
                        colValues: [
                            { type: TABLE_DATA_TYPE.AVATAR, value: doc.profilePicPath },
                            { type: TABLE_DATA_TYPE.STRING, value: doc.email },
                            { type: TABLE_DATA_TYPE.STRING, value: `${doc.firstName} ${doc.lastName}` },
                        ]
                    };
                })}
                loading={loading}
                onView={(doc: IDoctorWithProfileAccess) => navigateToDoctor(doc.userId)}
                onDelete={revokeDoctorProfileAccess}
            />
        </div>
    );
}

export default ProfileAccessComponent;