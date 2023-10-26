import { useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { Check2, X } from "react-bootstrap-icons";
import { Connection } from "../../connection";
import { APPOINTMENT_STATUS } from "../../interfaces/appointment_interfaces";
import { APPROVAL_STATUS } from "../../interfaces/general_enums";
import { IGlobalContext, ISignedGetRequest, UserType } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./appointmentCard.css";

interface IUser {
    name: string,
    email: string,
    profilePicPath: string
}
interface IAppointment {
    title: string,
    description: string,
    date: string,
    time: string,
    status: number
}

interface IProps {
    context: IGlobalContext,

    user: IUser,
    appointment: IAppointment,

    reject?(): Promise<void>,
    approve?(): Promise<void>,
    cancel?(): Promise<void>,
}

const AppointmentCard = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);

    const [showCancelButton, setShowCancelButton] = useState(false);
    const statusColors = ["danger", "warning", "success", "danger"];
    const statusNames = ["rejected", "pending", "approved", "cancelled"];
    const [statusIndex, setstatusIndex] = useState(1);
    const [profilePicUrl, setProfilePicUrl] = useState("");

    // COMPONENT DID MOUNT
    useEffect(() => {

        // set isDoctor
        if (props.context.userType === UserType.DOCTOR) {
            setIsDoctor(true);
        }

        // set showCancelButton
        if ((props.appointment.status === APPROVAL_STATUS.APPROVED
            || (props.appointment.status === APPROVAL_STATUS.PENDING && props.context.userType === UserType.PATIENT))
            && Date.parse(`${props.appointment.date} ${props.appointment.time.substring(0, 5)}`) > Date.now()) {
            setShowCancelButton(true);
        }

        if (props.appointment.status >= 0 && props.appointment.status <= 3) {
            setstatusIndex(props.appointment.status);
        }
        getProfilePicUrl();
    }, []);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        if (props.user.profilePicPath.length > 0) {
            let result = await Connection.getS3GetUrl(props.user.profilePicPath);
            if (result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true);
                return;
            }
            setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
        }
    }

    return (
        <div style={{ backgroundColor: props.context.theme.primary }} className="rounded shadow hor-center appointment-card-container">
            {
                // user details
                <div style={{ backgroundColor: props.context.theme.mutedTertiary, color: props.context.theme.primary }} className="fullsize appointment-card-user vert-flex justify-center">
                    <div>
                        <img className="rounded hor-center" src={(profilePicUrl !== "") ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />
                        <h5 className="wrap-text hor-center">{props.user.name}</h5>
                        <p className="wrap-text hor-center">{props.user.email}</p>
                    </div>
                </div>
            }
            {
                // status and buttons
                <div style={{ backgroundColor: props.context.theme.mutedPrimary, color: props.context.theme.primary }} className="appointment-card-status vert-flex justify-end">
                    {
                        // approve/reject buttons for doctor
                        (isDoctor && props.appointment.status === APPOINTMENT_STATUS.PENDING) &&
                        <>
                            <X onClick={async () => {
                                setLoading(true);
                                if (props.reject) {
                                    await props.reject();
                                }
                                setLoading(false);
                            }} className="icon-sm btn-reject hover appointment-card-button" />
                            <Check2 onClick={async () => {
                                setLoading(true);
                                if (props.approve) {
                                    await props.approve();
                                }
                                setLoading(false);
                            }} className="icon-sm btn-approve hover appointment-card-button" />
                        </>
                    }
                    {
                        showCancelButton &&
                        <Badge onClick={() => props.cancel && props.cancel()} className="appointment-card-badge hover" bg={statusColors[0]}>
                            cancel
                        </Badge>
                    }
                    <Badge className="appointment-card-badge" bg={statusColors[statusIndex]}>
                        {statusNames[statusIndex]}
                    </Badge>
                </div>
            }
            {
                // appointment details
                <div className="appointment-card-details">
                    {
                        loading &&
                        <Loading />
                    }
                    {
                        !loading &&
                        <Table>
                            <tbody>
                                <tr>
                                    <td width="30%">Title:</td>
                                    <td>{props.appointment.title}</td>
                                </tr>
                                <tr>
                                    <td width="30%">Description:</td>
                                    <td>{props.appointment.description}</td>
                                </tr>
                                <tr>
                                    <td width="30%">Date:</td>
                                    <td><b>{props.appointment.date}</b></td>
                                </tr>
                                <tr>
                                    <td width="30%">Time:</td>
                                    <td><b>{props.appointment.time.substring(0, 5)}</b> to <b>{props.appointment.time.substring(5)}</b></td>
                                </tr>
                            </tbody>
                        </Table>
                    }
                </div>
            }
        </div>
    );
}

export default AppointmentCard;