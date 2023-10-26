import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Check2, X } from "react-bootstrap-icons";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { NOTIFICATIONS_TYPE } from "../../interfaces/general_enums";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IProfileAccessRequest } from "../../interfaces/patient_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./dashboardRequestCard.css";

export enum REQUEST_CARD_TYPE {
    PROFILE_ACCESS_REQUESTS
}

interface IProps {
    context: IGlobalContext,
    type: REQUEST_CARD_TYPE,
    header: string,
}

let DashboardRequestCard = (props: IProps) => {
    const [loadingData, setLoadingData] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    // RETRIEVED DATA
    const [data, setData] = useState<any[]>([]);

    // VALUES TO SHOW IN TABLE
    const [displayData, setDisplayData] = useState<string[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getData();
    }, []);

    //----   ON APPOINTMENT NOTIFICATION RECEIVED    ----
    useEffect(() => {
        if (props.type !== REQUEST_CARD_TYPE.PROFILE_ACCESS_REQUESTS)
            return;

        if (props.context.newNotificationRecv) {
            if (props.context.newNotificationRecv.typeId === NOTIFICATIONS_TYPE.PROFILE_ACCESS)
                getData();
        }
    }, [props.context.newNotificationRecv]);

    // GET DATA
    const getData = async () => {
        setLoadingData(true);

        switch (props.type) {
            case REQUEST_CARD_TYPE.PROFILE_ACCESS_REQUESTS:
                let pars = await getProfileAccessRequests();
                setData(pars);
                setDisplayData(pars.map(p => p.email));
                break;
            default:
                break;
        }

        setLoadingData(false);
    }

    // APPROVE
    const approve = async (index: number) => {
        setLoadingAction(true);
        switch (props.type) {
            case REQUEST_CARD_TYPE.PROFILE_ACCESS_REQUESTS:
                await approveProfileAccess(index);
                break;
            default:
                break;
        }
        setLoadingAction(false);
    }

    // REJECT
    const reject = async (index: number) => {
        setLoadingAction(true);
        switch (props.type) {
            case REQUEST_CARD_TYPE.PROFILE_ACCESS_REQUESTS:
                await rejectProfileAccess(index);
                break;
            default:
                break;
        }
        setLoadingAction(false);
    }

    //----   GET PROFILE ACCESS REQUESTS   ----
    const getProfileAccessRequests = async (): Promise<IProfileAccessRequest[]> => {
        const result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PATIENT_PROFILE_ACCESS_REQUESTS + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("error profile access requests doctors: " + result.errorMessage, true);
            return [];
        }
        return result.data;
    }

    //----   APPROVE PROFILE ACCESS   ----
    const approveProfileAccess = async (index: number) => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.APPROVE_PATIENT_PROFILE_ACCESS, data[index], {});
        if (result.errorMessage.length > 0) {
            errorToast("Failed to approve request: " + result.errorMessage, true);
            return;
        }
        getData();
    }

    //----   REJECT PROFILE ACCESS   ----
    const rejectProfileAccess = async (index: number) => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REJECT_PATIENT_PROFILE_ACCESS, data[index], {});
        if (result.errorMessage.length > 0) {
            errorToast("Failed to reject request: " + result.errorMessage, true);
            return;
        }
        getData();
    }

    return (
        <div className="rounded shadow-sm dash-request-card">
            <Table>
                <thead>
                    <tr>
                        <td colSpan={3}>
                            <h4>{props.header}</h4>
                        </td>
                    </tr>
                </thead>

                {
                    !loadingData &&
                    <tbody>
                        {
                            displayData.map((val, index) => {
                                return (
                                    <tr>
                                        {
                                            !loadingAction &&
                                            <>
                                                <td width="70%" className="hover dash-request-value">{val}</td>
                                                <td><X onClick={() => reject(index)} className="btn-reject icon-sm hover" /></td>
                                                <td><Check2 onClick={() => approve(index)} className="btn-approve icon-sm hover" /></td>
                                            </>
                                        }
                                        {
                                            loadingAction &&
                                            <td width="100%"><Loading /></td>
                                        }
                                    </tr>
                                );
                            })
                        }
                        {
                            displayData.length === 0 &&
                            // <tr>
                            //     <td width="100%">Nothing to show!</td>
                            // </tr>
                            <p style={{ marginTop: "10px" }}>Nothing to show!</p>
                        }
                    </tbody>
                }
                {
                    loadingData &&
                    <Loading />
                }
            </Table>
        </div>
    );
}

export default DashboardRequestCard;