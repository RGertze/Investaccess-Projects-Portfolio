import { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IReport, IReportGenerationJob, IReportGroup } from "../../interfaces/report-interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import ReportSheet from "../../shared-components/report-sheet/reportSheet";
import StudentReportEdit from "../../shared-components/student-report-edit-component/studentReportEdit";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminPrimaryReportsList.css";



interface IProps {
    context: IGlobalContext,
    reportGroupId: number,
    reports: IReport[],
    loading: boolean,
    terms: number
}

const AdminPrimaryReportsList = (props: IProps) => {

    const [reportToView, setReportToView] = useState<IReport>();
    const [editingAll, setEditingAll] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
    }, []);

    // VIEW SINGLE REPORT 
    const viewReport = (rep: IReport) => {
        setReportToView(rep);
    }

    return (
        <div className="admin-reports-list-container">
            <div className="vert-flex space-between reports-list-header">
                <div>
                    {
                        // SEARCH STUFF
                    }
                </div>
                <div className="p-3">
                    <Button onClick={() => setEditingAll(true)} variant="success">Edit All</Button>
                </div>
            </div>


            {
                <TableV2
                    title="Primary Students"
                    columns={[
                        { title: "Student Number", field: "studentNumber" },
                        { title: "First Name", field: "firstName" },
                        { title: "Last Name", field: "lastName" },
                        { title: "Grade", field: "grade" },
                    ]}
                    filtering={false}

                    isLoading={false}

                    data={props.reports}

                    onRowClick={async (data: IReport) => setReportToView(data)}
                />
            }

            {
                reportToView &&
                <StudentReportEdit context={props.context} hide={() => setReportToView(undefined)} report={reportToView} />
            }

            {
                editingAll &&
                <ReportSheet context={props.context} hide={() => setEditingAll(false)} reports={props.reports} show={editingAll} terms={props.terms} />
            }
        </div>
    );
}

export default AdminPrimaryReportsList;