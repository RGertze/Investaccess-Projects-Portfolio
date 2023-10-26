import { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IStudentPrePrimaryProgressReport } from "../../interfaces/progress_report_interfaces";
import { IDevelopmentAssessment, IDevelopmentAssessmentGrade, IDevelopmentCategory, IDevelopmentGroup, IReport, IReportDetails } from "../../interfaces/report-interfaces";
import { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../alert-components/toasts";
import EditableCell from "../editable-cell/editableCell";
import EditableTable from "../editable-component/editableComponent";
import Loading from "../loading-component/loading";
import PrePrimaryAssessmentEdit from "../pre-primary-assessments-view/prePrimaryAssessmentsView";

interface IProps {
    context: IGlobalContext,
    devGroups: IDevelopmentGroup[],
    devCats: IDevelopmentCategory[],
    devAssessments: IDevelopmentAssessment[],
    report: IReport,
    terms: number
}

const PreReportSheetStudent = (props: IProps) => {

    const [loadingProgressReport, setLoadingProgressReport] = useState(false);
    const [loadingReportDetails, setLoadingReportDetails] = useState(false);

    const [reportDetails, setReportDetails] = useState<IReportDetails>({ daysAbsent: 0, dominantHand: 0, personaBriefComments: "", registerTeacher: "", remarks: "" });
    const [progressReport, setProgressReport] = useState<IStudentPrePrimaryProgressReport>({
        id: 0,
        progressReportId: 0,
        terms: 0,
        year: 0,

        studentNumber: "",
        firstName: "",
        lastName: ""
    });

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('details');

    // COMPONENT DID MOUNT
    useEffect(() => {
        getReportDetails();
        getProgressReportByReportId();
    }, []);

    //----   GET REPORT DETAILS   ----
    const getReportDetails = async () => {
        setLoadingReportDetails(true);

        let qry = GET_ENDPOINT.GET_REPORT_DETAILS.toString();
        qry = qry.replace("{reportId}", props.report.reportdId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");

        setLoadingReportDetails(false);

        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        console.log(result.data);

        setReportDetails(result.data);
    }

    //----   GET PROGRESS REPORT BY REPORT ID   ----
    const getProgressReportByReportId = async () => {
        setLoadingProgressReport(true);

        let qry = GET_ENDPOINT.GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORT_BY_REPORT_ID.toString();
        qry = qry.replace("{reportId}", props.report.reportdId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");

        setLoadingProgressReport(false);

        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        console.log(result.data);

        setProgressReport(result.data);
    }


    //----   UPDATE REPORT DETAILS   ----
    const updateReportDetails = async (data: any): Promise<boolean> => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_REPORT_DETAILS, {
            id: props.report.reportdId,
            daysAbsent: data.daysAbsent,
            dominantHand: data.dominantHand,
            personaBriefComments: null,
            remarks: data.remarks,
            registerTeacher: data.registerTeacher,
        }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Details updated", true, 1500);
        getReportDetails();
        return true;
    }


    return (
        <div className="report-sheet-student-container">
            <h2 className="report-sheet-student">{props.report.firstName} {props.report.lastName}</h2>
            <div>
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "details")}>
                    <Tab eventKey={`details`} title={`Details`} className="student-single-report-persona-tab">
                        <EditableTable
                            title={`Report details`}
                            id={props.report.reportdId}
                            data={
                                [
                                    { key: "daysAbsent", name: "Days Absent: ", value: reportDetails.daysAbsent, type: INPUT_TYPE.NUMBER, },
                                    { key: "registerTeacher", name: "Register Teacher: ", value: reportDetails.registerTeacher, type: INPUT_TYPE.TEXT, },
                                    { key: "remarks", name: "Remarks: ", value: reportDetails.remarks, type: INPUT_TYPE.TEXT, },
                                    {
                                        key: "dominantHand",
                                        name: "Dominant Hand: ",
                                        value: reportDetails.dominantHand, type: INPUT_TYPE.SELECT,
                                        selectValues: [
                                            { name: "Right", value: 1 },
                                            { name: "Left", value: 2 },
                                            { name: "Mixed", value: 3 },
                                        ]
                                    },
                                ]
                            }
                            loading={loadingReportDetails}
                            onEdit={updateReportDetails}
                        />
                    </Tab>
                    <Tab eventKey={`assessments`} title={`Assessments`} className="student-report-persona-tab">
                        {
                            loadingProgressReport &&
                            <Loading />
                        }
                        {
                            !loadingProgressReport && progressReport.id !== 0 &&
                            < PrePrimaryAssessmentEdit
                                context={props.context}
                                studentProgressReportId={progressReport.id}
                                devGroups={props.devGroups}
                                devCats={props.devCats}
                                devAssessments={props.devAssessments}
                            />
                        }
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default PreReportSheetStudent;