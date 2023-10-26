import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import { IReport } from "../../interfaces/report-interfaces";
import PreReportSheet from "../../shared-components/pre-report-sheet/preReportSheet";
import StudentPreReportEdit from "../../shared-components/student-pre-report-edit/studentPreReportEdit";
import TableV2 from "../../shared-components/table-v2/tableV2";



interface IProps {
    context: IGlobalContext,
    reportGroupId: number,
    reports: IReport[],
    loading: boolean,
    terms: number
}

const AdminPrePrimaryReportsList = (props: IProps) => {

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
                <div></div>
                <div className="p-3">
                    <Button onClick={() => setEditingAll(true)} variant="success">Edit All</Button>
                </div>
            </div>


            {
                <TableV2
                    title="Pre-Primary Students"
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
                <StudentPreReportEdit context={props.context} hide={() => setReportToView(undefined)} report={reportToView} />
            }

            {
                editingAll &&
                <PreReportSheet context={props.context} hide={() => setEditingAll(false)} reports={props.reports} show={true} terms={props.terms} />
            }
        </div>
    );
}

export default AdminPrePrimaryReportsList;