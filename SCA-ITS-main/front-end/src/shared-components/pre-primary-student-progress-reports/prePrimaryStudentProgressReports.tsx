import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IPrePrimaryProgressReport, IStudentPrePrimaryProgressReport } from "../../interfaces/progress_report_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";
import { PopupComponent } from "../popup-component/popupComponent";
import PrePrimaryAssessmentEdit from "../pre-primary-assessments-view/prePrimaryAssessmentsView";
// import "./prePrimaryProgressReports.css";


interface IProps {
    context: IGlobalContext,
    studentNumber: string
}

const StudentPrePrimaryProgressReports = (props: IProps) => {

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
        let qry = GET_ENDPOINT.GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORTS.toString();
        qry = qry.replace("{studentNumber}", props.studentNumber);
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
                title="Progress reports"
                columns={[
                    { title: "ID", field: "id", filtering: false },
                    { title: "Year", field: "year", filtering: false },
                    { title: "Terms", field: "terms", filtering: false },
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

export default StudentPrePrimaryProgressReports;