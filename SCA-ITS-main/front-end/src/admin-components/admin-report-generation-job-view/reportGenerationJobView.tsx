
import { useEffect, useState } from "react";
import useInterval from "../../hooks/useInterval";
import { Trash, Trash2 } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { getReportGenerationStatusColour, IGeneratedReport, IReport, IReportGenerationJob, IReportGroup, REPORT_GENERATION_STATUS } from "../../interfaces/report-interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import DownloadDocumentComponent from "../../shared-components/file-downloader-component/downloadDocComponent";
import "./reportGenerationJobView.css";
import TableV2 from "../../shared-components/table-v2/tableV2";
import FileViewerComponent from "../../shared-components/file-viewer-component/fileViewerComponent";
import { Badge, Button } from "react-bootstrap";
import { PopupComponent } from "../../shared-components/popup-component/popupComponent";
import { AlertComponent } from "../../shared-components/alert-component/alertComponent";



interface IProps {
    context: IGlobalContext,
    job: IReportGenerationJob,
    refresh(): void
}

const ReportGenerationJobView = (props: IProps) => {

    const [fileToView, setFileToView] = useState<IGeneratedReport>();
    const [loading, setLoading] = useState(false);
    const [generatedReports, setGeneratedReports] = useState<IGeneratedReport[]>([]);
    const [reportToDownload, setReportToDownload] = useState<IGeneratedReport>();
    const [failedReportToView, setFailedReportToView] = useState<IGeneratedReport>();

    const [polling, setPolling] = useState(true);

    // COMPONENT DID MOUNT
    useEffect(() => {
        loadInitialGeneratedReports();
    }, []);

    // SETUP POLLING
    useInterval(async () => {
        console.log("polling");
        if (checkForPendingReports())
            getAllGeneratedReports();
    }, polling && generatedReports.length > 0 ? 3000 : null);

    //----   CHECK FOR PENDING REPORTS   ----
    const checkForPendingReports = (): boolean => {
        for (let i = generatedReports.length - 1; i >= 0; i--) {
            if (generatedReports[i].status === REPORT_GENERATION_STATUS.PENDING || generatedReports[i].status === REPORT_GENERATION_STATUS.RUNNING)
                return true;
        }
        setPolling(false);
        return false;
    }

    //----   LOAD INITIAL GENERATED REPORTS   ----
    const loadInitialGeneratedReports = async () => {
        setLoading(true);
        await getAllGeneratedReports();
        setLoading(false);
    }


    //----   GET ALL REPORT GENERATED REPORTS   ----
    const getAllGeneratedReports = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_GENERATED_REPORT_FILES + props.job.id, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setGeneratedReports(result.data);
    }

    //----   RERUN FILE   ----
    const rerunFile = async (data: IGeneratedReport) => {
        setLoading(true);
        let qry = GET_ENDPOINT.RERUN_SINGLE_GENERATED_REPORT_FILE.toString();
        qry = qry.replace("{id}", data.id.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Success", true, 1500);

        getAllGeneratedReports();
        setPolling(true);
        return true;
    }

    //----   RERUN ALL   ----
    const rerunAll = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.RERUN_ALL_GENERATED_REPORT_FILES.toString();
        qry = qry.replace("{id}", props.job.id.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Success", true, 1500);

        getAllGeneratedReports();
        return true;
    }

    //----   DELETE   ----
    const deleteJob = async () => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_REPORT_GENERATION_JOB + props.job.id);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        props.refresh();
    }

    return (
        <div className="admin-parents-page-container">
            <div className="rounded border vert-flex space-evenly hor-center w-25 padding-5" style={{ marginBottom: "20px" }}>
                <Trash onClick={() => deleteJob()} className="icon-sm btn-reject hover" />
            </div>
            {
                fileToView &&
                <FileViewerComponent context={props.context} fileName={`${fileToView.firstName}-${fileToView.lastName}`} filePath={fileToView.filePath} hide={() => setFileToView(undefined)} />
            }
            <div className="w100 vert-flex space-between p-2" style={{ marginBottom: "20px" }}>
                <div></div>
                <Button onClick={rerunAll} variant="success">Re-run All</Button>
            </div>
            <TableV2
                title={"Generated Reports"}
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    {
                        title: "Grade", field: "grade", type: "numeric",
                        lookup: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, },
                    },
                    {
                        title: "Status", field: "status",
                        render: (rowData: any) => <Badge bg={getReportGenerationStatusColour(rowData.status)}>
                            {
                                rowData.status === REPORT_GENERATION_STATUS.PENDING && "pending"
                            }
                            {
                                rowData.status === REPORT_GENERATION_STATUS.RUNNING && "running"
                            }
                            {
                                rowData.status === REPORT_GENERATION_STATUS.SUCCESSFUL && "complete"
                            }
                            {
                                rowData.status === REPORT_GENERATION_STATUS.FAILED && "failed"
                            }
                        </Badge>,
                        lookup: { 0: "pending", 1: "running", 2: "failed", 3: "complete" },
                    },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (report: IGeneratedReport) => {
                    if (report.status === REPORT_GENERATION_STATUS.PENDING || report.status === REPORT_GENERATION_STATUS.RUNNING) {
                        errorToast("Report has not been generated yet");
                        return;
                    }
                    if (report.status === REPORT_GENERATION_STATUS.FAILED) {
                        setFailedReportToView(report);
                        return;
                    }
                    setFileToView(report);
                }}
                onDownload={async (report: IGeneratedReport) => {
                    if (report.status === REPORT_GENERATION_STATUS.PENDING || report.status === REPORT_GENERATION_STATUS.RUNNING) {
                        errorToast("Report has not been generated yet");
                        return;
                    }
                    if (report.status === REPORT_GENERATION_STATUS.FAILED) {
                        errorToast("Report generation has failed");
                        return;
                    }
                    setReportToDownload(report);
                }}
                onReload={rerunFile}

                data={generatedReports}
            />

            {
                reportToDownload &&
                <DownloadDocumentComponent extension="pdf" context={props.context} fileName={`${reportToDownload.firstName}-${reportToDownload.lastName}`} filePath={reportToDownload.filePath} hide={() => setReportToDownload(undefined)} show={reportToDownload !== undefined} />
            }
            {
                failedReportToView &&
                <PopupComponent
                    onHide={() => setFailedReportToView(undefined)}
                    size="lg"
                    component={
                        <AlertComponent
                            title="Failed to generate this report!"
                            type="danger"
                            dismissible={false}
                            content={failedReportToView.failureMessage}
                        />
                    }
                />
            }
        </div>
    );
}

export default ReportGenerationJobView;