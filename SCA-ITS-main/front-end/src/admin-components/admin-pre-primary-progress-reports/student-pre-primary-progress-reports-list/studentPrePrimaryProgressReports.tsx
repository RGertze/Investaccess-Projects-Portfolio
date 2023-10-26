import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GET_ENDPOINT, Connection } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IStudentPrePrimaryProgressReport } from "../../../interfaces/progress_report_interfaces";
import { errorToast } from "../../../shared-components/alert-components/toasts";
import { PopupComponent } from "../../../shared-components/popup-component/popupComponent";
import PrePrimaryAssessmentEdit from "../../../shared-components/pre-primary-assessments-view/prePrimaryAssessmentsView";
import TableV2 from "../../../shared-components/table-v2/tableV2";

interface IProps {
    context: IGlobalContext,
}

const StudentPrePrimaryProgressReportsList = (props: IProps) => {

    const params = useLocation();
    const progressReportId = (params.state as number);

    const [loading, setLoading] = useState(false);
    const [progressReports, setProgressReports] = useState<IStudentPrePrimaryProgressReport[]>([]);

    const [view, setView] = useState<IStudentPrePrimaryProgressReport>();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAll();
    }, []);


    //----   GET ALL   ----
    const getAll = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORTS_BY_PROGRESS_REPORT.toString();
        qry = qry.replace("{id}", progressReportId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProgressReports(result.data);
    }

    return (
        <div className="admin-parents-page-container">
            <TableV2
                title="Student progress reports"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (pg: IStudentPrePrimaryProgressReport) => setView(pg)}

                data={progressReports}
            />


            {
                view &&
                <PopupComponent
                    size="lg"
                    fullscreen={true}
                    onHide={() => setView(undefined)}
                    component={
                        <PrePrimaryAssessmentEdit context={props.context} studentProgressReportId={view.id} />
                    }
                />
            }

        </div>
    );
}

export default StudentPrePrimaryProgressReportsList;