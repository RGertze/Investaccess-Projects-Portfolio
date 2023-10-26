
import { useEffect, useState } from "react";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IStudentProgressReport } from "../../interfaces/progress_report_interfaces";
import { errorToast } from "../alert-components/toasts";
import StudentProgressReport from "../student-progress-report/studentProgressReport";
import TableList from "../table-list-component/tableListComponent";
import TableV2 from "../table-v2/tableV2";
import "./studentProgressReportsList.css";

interface IProps {
    studentNumber: string,
    context: IGlobalContext,

    isStaff: boolean
}

const StudentProgressReportsList = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [progressReports, setProgressReports] = useState<IStudentProgressReport[]>([]);

    const [progressReportToShow, setProgressReportToShow] = useState<IStudentProgressReport>();

    // COMPONENT DID MOUNT
    useEffect(() => {
        props.isStaff ? getStudentProgressReportsForStaff() : getStudentProgressReports();
    }, []);

    //----   GET STUDENT PROGRESS REPORTS   ----
    const getStudentProgressReports = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT_PROGRESS_REPORTS + props.studentNumber, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProgressReports(result.data);
    }

    //----   GET STUDENT PROGRESS REPORTS FOR STAFF   ----
    const getStudentProgressReportsForStaff = async () => {
        setLoading(true);
        let qry = `/${props.context.userId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT_PROGRESS_REPORTS + props.studentNumber + qry, "");
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
                title="Progress Reports"
                columns={[
                    { title: "Course", field: "courseId", filtering: false },
                    { title: "Name", field: "progressReporName", filtering: false },
                    { title: "Number of Terms", field: "numberOfTerms", filtering: false },
                    { title: "Year", field: "year", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (data: IStudentProgressReport) => setProgressReportToShow(data)}

                data={progressReports}
            />

            {
                progressReportToShow !== undefined &&
                <StudentProgressReport
                    hide={() => setProgressReportToShow(undefined)}
                    courseReportId={progressReportToShow.courseProgressReportId}
                    studentNumber={props.studentNumber}
                    context={props.context}
                    progressReportId={progressReportToShow.progressReportId}
                    progressReportName={progressReportToShow.progressReporName}
                    numberOfTerms={progressReportToShow.numberOfTerms}
                />
            }
        </div>
    );
}

export default StudentProgressReportsList;