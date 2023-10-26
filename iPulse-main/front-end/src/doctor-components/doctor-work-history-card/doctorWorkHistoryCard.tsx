import { useState } from "react";
import { Card, Table } from "react-bootstrap";
import { Pencil, Trash3Fill } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT } from "../../connection";
import { IDoctorWorkHistory } from "../../interfaces/doctor_interfaces";
import { IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./doctorWorkHistoryCard.css";

interface IProps {
    workHistory: IDoctorWorkHistory,

    refreshWorkHistory(): Promise<void>
}

let DoctorWorkHistoryCard = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    // DELETE WORK HISTORY
    const deleteWorkHistory = async () => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_WORK_HISTORY + props.workHistory.doctorWorkHistoryId);
        if (result.errorMessage.length > 0) {
            setLoading(false);
            errorToast("failed to delete work history: " + result.errorMessage, true);
            return;
        }
        await props.refreshWorkHistory();
        setLoading(false);
    }

    return (
        <Card className="this-scrollbar work-history-card">
            <Card.Header>
                <div className="col-2-70">
                    <h4>{props.workHistory.companyName}</h4>
                    <div className="col-2-50">
                        <Pencil size={22} color="#4444FF" className="hover hor-center" />
                        <Trash3Fill onClick={() => deleteWorkHistory()} size={22} color="#FF4444" className="hover hor-center" />
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                {
                    loading &&
                    <Loading />
                }
                <Card.Subtitle>
                    <h5>Role</h5>
                    <p>{props.workHistory.role}</p>
                </Card.Subtitle>
                <h5>Duties:</h5>
                <p>{props.workHistory.duties}</p>
                <Table className="hor-center work-history-card-table">
                    <tr>
                        <td><b>Start Date:</b></td>
                        <td>{new Date(props.workHistory.startDate).toDateString()}</td>
                    </tr>
                    <tr>
                        <td ><b>End Date:</b></td>
                        <td>{new Date(props.workHistory.endDate).toDateString()}</td>
                    </tr>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default DoctorWorkHistoryCard;