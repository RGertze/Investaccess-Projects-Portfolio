import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IProgressReport } from "../../interfaces/progress_report_interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminTemplatesPage.css";


interface INewProgressReport {
    Name: string,
    Exam_Marks_Available: number,
    Exam_Weight: number
}

interface IProps {
    context: IGlobalContext
}

const AdminTemplatesPage = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [progReports, setProgReports] = useState<IProgressReport[]>([]);

    const [showAddingProgReport, setShowAddingProgReport] = useState(false);
    const [editing, setEditing] = useState(false);
    const [progressReportBeingEdited, setProgressReportBeingEdited] = useState(0);
    const [newProgressReport, setNewProgressReport] = useState<INewProgressReport>({
        Name: "",
        Exam_Marks_Available: 0,
        Exam_Weight: 0
    });

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllProgReports();
    }, []);

    //----   GET ALL PROGRESS REPORTS   ----
    const getAllProgReports = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PROGRESS_REPORTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProgReports(result.data);
    }

    //----   DELETE PROGRESS REPORT   ----
    const deleteProgressReport = async (id: number) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_PROGRESS_REPORT_TEMPLATE + id);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        getAllProgReports();
        return true;
    }

    const submit = async (data: any): Promise<boolean> => {
        if (editing)
            return editProgReport(data);

        return addNewProgReport(data);
    }

    //----   ADD NEW PROGRESS REPORT   ----
    const addNewProgReport = async (data: any): Promise<boolean> => {
        let inputVals: INewProgressReport = data;
        if (!validateNewProgReport(inputVals)) {
            return false;
        }

        let newData = {
            name: inputVals.Name,
            examMarksAvailable: inputVals.Exam_Marks_Available,
            examWeight: inputVals.Exam_Weight,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_PROGRESS_REPORT, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Progress Report Added!", true, 2000);
        setNewProgressReport({
            Name: "",
            Exam_Marks_Available: 0,
            Exam_Weight: 0
        });
        setShowAddingProgReport(false);
        getAllProgReports();
        return true;
    }

    //----   EDIT PROGRESS REPORT   ----
    const editProgReport = async (data: any): Promise<boolean> => {
        let inputVals: INewProgressReport = data;
        if (!validateNewProgReport(inputVals)) {
            return false;
        }

        let newData = {
            id: progressReportBeingEdited,
            name: inputVals.Name,
            examMarksAvailable: inputVals.Exam_Marks_Available,
            examWeight: inputVals.Exam_Weight,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_UPDATE_PROGRESS_REPORT_TEMPLATE, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Progress Report updated!", true, 2000);

        setNewProgressReport({
            Name: "",
            Exam_Marks_Available: 0,
            Exam_Weight: 0
        });
        setShowAddingProgReport(false);

        setEditing(false);
        setProgressReportBeingEdited(0);

        getAllProgReports();
        return true;
    }

    //----   VALIDATE NEW PROGRESS REPORT   ----
    const validateNewProgReport = (data: INewProgressReport): boolean => {
        if (data.Name === "") {
            errorToast(`Enter a name!`);
            return false;
        }
        if (data.Exam_Marks_Available < 0) {
            errorToast(`Exam marks should be atleast 0`, true);
            return false;
        }
        if (data.Exam_Weight < 0 || data.Exam_Weight > 100) {
            errorToast(`Exam weight should be between 0 and 100!`, true);
            return false;
        }

        return true;
    }

    //----   SET PROGRESS REPORT TO EDIT   ----
    const setProgressReportToEdit = async (id: number) => {
        // find progress report to edit
        let progRep = progReports.find(p => p.id === id);

        if (progRep) {

            // set appropriate values

            setNewProgressReport({
                Name: progRep.name,
                Exam_Marks_Available: progRep.examMarksAvailable,
                Exam_Weight: progRep.examWeight,
            });

            setProgressReportBeingEdited(id);
            setEditing(true);
            setShowAddingProgReport(true);
        }
    }

    // VIEW TEMPLATE
    const view = (id: number) => {
        navigate(`/admin/progress-reports/primary/${id}`, { state: id });
    }

    return (
        <div className="admin-parents-page-container">
            {
                showAddingProgReport &&
                <AddEditComponent title={editing ? "Editing progress report" : "Add new progress report"} submit={submit} cancel={() => setShowAddingProgReport(false)} data={newProgressReport} />
            }

            <TableV2
                title="Progress Report Templates"
                columns={[
                    { title: "Name", field: "name" },
                    { title: "Exam Weight", field: "examWeight" },
                ]}
                filtering={false}

                isLoading={loading}

                onAdd={async () => setShowAddingProgReport(true)}
                onEdit={async (data: IProgressReport) => setProgressReportToEdit(data.id)}
                onDelete={async (data: IProgressReport) => deleteProgressReport(data.id)}
                onRowClick={async (data: IProgressReport) => view(data.id)}

                data={progReports}
            />
        </div>
    );
}

export default AdminTemplatesPage;