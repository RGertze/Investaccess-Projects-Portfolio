import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { APPROVAL_STATUS } from "../../interfaces/general_enums";
import { IHealthSummaryAll } from "../../interfaces/general_health_interfaces";
import { IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import { IPatientNextOfKin } from "../../interfaces/patient_interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import AddHealthSummary from "../add-health-summary/addHealthSummary";
import TableComponent, { IColumnData, TABLE_DATA_TYPE } from "../table-component/tableComponent";
import ViewHealthSummary from "../view-health-summary/viewHealthSummary";
import "./patientHealthSummaryList.css";


interface IProps {
    context: IGlobalContext,
    patientId: number
}

const PatientHealthSummaryList = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [healthSummaries, setHealthSummaries] = useState<IHealthSummaryAll[]>([]);
    const [adding, setAdding] = useState(false);

    const [summaryToView, setSummaryToView] = useState<IHealthSummaryAll>();

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAllHealthSummaries();
    }, []);

    //----   GET ALL HEALTH SUMMARIES   ----
    const getAllHealthSummaries = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_PATIENT_HEALTH_SUMMARIES.toString();
        qry = qry.replace("{patientId}", props.patientId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        setHealthSummaries(result.data);
    }

    //----   DELETE HEALTH SUMMARY   ----
    const deleteHealthSummary = async (val: IHealthSummaryAll) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_HEALTH_SUMMARY.toString();
        qry = qry.replace("{summaryId}", val.id.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        getAllHealthSummaries();
    }

    //----   ADD SUMMARY   ----
    const addSummary = async (jsonString: string): Promise<boolean> => {

        let dataToSend = {
            patientId: props.patientId,
            doctorId: props.context.userId,
            content: jsonString,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_HEALTH_SUMMARY, dataToSend, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Health summary saved", true, 1500);

        setAdding(false);
        getAllHealthSummaries();
        return true;
    }

    return (
        <div className="health-summary-list-container">
            <TableComponent
                title={"Health Summaries"}
                titleCol={props.context.theme.primary}
                titleBgCol={props.context.theme.tertiary}
                context={props.context}
                ids={[...healthSummaries]}
                headerValues={["", "Email", "Name", "Created", "Last Updated"]}
                data={healthSummaries.map((hs, index) => {
                    let colVals: IColumnData[] = [
                        { type: TABLE_DATA_TYPE.AVATAR, value: hs.profilePicPath },
                        { type: TABLE_DATA_TYPE.STRING, value: hs.email },
                        { type: TABLE_DATA_TYPE.STRING, value: `${hs.firstName} ${hs.lastName}` },
                        { type: TABLE_DATA_TYPE.STRING, value: hs.createdAt },
                        { type: TABLE_DATA_TYPE.STRING, value: hs.updatedAt },
                    ];
                    return {
                        colValues: colVals
                    };
                })}
                onAdd={props.context.userType === UserType.DOCTOR ? () => { setAdding(true) } : undefined}
                loading={loading}
                onView={(summary) => { setSummaryToView(summary) }}
                onDelete={deleteHealthSummary}
            />

            {
                adding &&
                <AddHealthSummary
                    hide={() => setAdding(false)}
                    submit={addSummary}
                />
            }

            {
                summaryToView &&
                <ViewHealthSummary
                    context={props.context}
                    hide={() => setSummaryToView(undefined)}
                    summaryId={summaryToView.id}
                />
            }
        </div>
    );
}

export default PatientHealthSummaryList;