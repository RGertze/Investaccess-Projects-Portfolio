import { useEffect, useState } from "react";
import { Accordion, Button, Table } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IProgressReport, IProgressReportCategory } from "../../interfaces/progress_report_interfaces";
import { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import EditableTable from "../../shared-components/editable-component/editableComponent";
import Loading from "../../shared-components/loading-component/loading";
import TableV2 from "../../shared-components/table-v2/tableV2";
import AdminProgReportCategories from "../admin-prog-report-category/adminProgReportCategories";
import "./adminProgressReportPage.css";

interface IProps {
    context: IGlobalContext
}

const AdminProgressReportPage = (props: IProps) => {
    const params = useLocation();
    const id = (params.state as number);

    const [loading, setLoading] = useState(false);
    const [progReport, setProgReport] = useState<IProgressReport>({
        examWeight: 0,
        id: 0,
        name: "",
        examMarksAvailable: 0
    });



    // COMPONENT DID MOUNT
    useEffect(() => {
        getProgressReport();
    }, []);


    //----   GET PROGRESS REPORT   ----
    const getProgressReport = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PROGRESS_REPORT + id, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProgReport(result.data);
    }

    //----   EDIT PROGRESS REPORT   ----
    const editProgressReport = async (data: any): Promise<boolean> => {
        let newData = {
            id: progReport.id,
            name: data.name,
            examMarksAvailable: data.examMarksAvailable,
            examWeight: data.examWeight,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_UPDATE_PROGRESS_REPORT_TEMPLATE, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Progress Report updated!", true, 2000);
        getProgressReport();
        return true;
    }

    return (
        <div className="admin-template-page-container">

            {
                // PROGRESS REPORT DETAILS
                <EditableTable
                    title={`Progress Report View`}
                    id={progReport.id}
                    data={
                        [
                            { key: "name", name: "Name: ", value: progReport.name, type: INPUT_TYPE.TEXT, },
                            { key: "examMarksAvailable", name: "Exam Marks Available: ", value: progReport.examMarksAvailable, type: INPUT_TYPE.NUMBER, },
                            { key: "examWeight", name: "Exam Weight: ", value: progReport.examWeight, type: INPUT_TYPE.NUMBER, },
                        ]
                    }
                    loading={loading}
                    onEdit={editProgressReport}
                />
            }

            <AdminProgReportCategories context={props.context} progressReportId={id} />

        </div>
    );
}

export default AdminProgressReportPage;