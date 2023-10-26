import { useEffect, useState } from "react";
import { Accordion, Button, Tab, Table, Tabs } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IReport, IReportGenerationJob, IReportGroup } from "../../interfaces/report-interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import AdminPrePrimaryReportsList from "../admin-pre-primary-reports-list/adminPrePrimaryReportsList";
import AdminPrimaryReportsList from "../admin-primary-reports-list/adminPrimaryReportsList";
import ReportGenerationJobView from "../admin-report-generation-job-view/reportGenerationJobView";
import "./adminReportGroupView.css";

interface IProps {
    context: IGlobalContext
}

const AdminReportGroupView = (props: IProps) => {
    const params = useLocation();
    const reportGroup = (params.state as IReportGroup);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('primary');

    const [loadingReports, setLoadingReports] = useState(false);

    const [reports, setReports] = useState<IReport[]>([]);

    const [accordianKey, setAccordianKey] = useState('');
    const [loadingGenerationJobs, setLoadingGenerationJobs] = useState(false);
    const [addingGenerationJob, setAddingGenerationJob] = useState(false);
    const [generationJobs, setGenerationJobs] = useState<IReportGenerationJob[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getReports();
        getGenerationJobs();
    }, []);

    // ON TAB CHANGE
    useEffect(() => {
        if (tabKey === "primary") {

        }
        if (tabKey === "pre-primary") {

        }
    }, [tabKey]);

    //----   GET ALL REPORTS   ----
    const getReports = async () => {
        setLoadingReports(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT_REPORTS + reportGroup.id, "");
        setLoadingReports(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setReports(result.data);
    }

    //----   GET REPORT GENERATION JOBS   ----
    const getGenerationJobs = async () => {
        setLoadingGenerationJobs(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_REPORT_GENERATION_JOBS + reportGroup.id, "");
        setLoadingGenerationJobs(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setGenerationJobs(result.data);
    }

    //----   ADD REPORT GENERATION JOB   ----
    const addGenerationJobs = async (data: any): Promise<boolean> => {

        if (data.Term < 0 || isNaN(data.Term) || data.Term > reportGroup.terms) {
            errorToast(`Enter a valid term between 1 and ${reportGroup.terms}`);
            return false;
        }
        if (data.School_ReOpens.value === "") {
            errorToast(`Choose a date`);
            return false;
        }

        console.log(data.School_ReOpens)

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_REPORT_GENERATION_JOB, {
            reportGroupId: reportGroup.id,
            term: data.Term,
            schoolReOpens: data.School_ReOpens.value
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        getGenerationJobs();
        setAddingGenerationJob(false);
        return true;
    }

    return (
        <div className="admin-report-group-page-container">

            <h2 className="admin-report-group-page-header">{reportGroup.year} reports:</h2>
            {
                // TABS
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "primary")}>
                    <Tab className="report-group-tab" eventKey="primary" title="Primary">
                        <AdminPrimaryReportsList context={props.context} loading={loadingReports} reports={reports.filter(r => r.grade > 0)} reportGroupId={reportGroup.id} terms={reportGroup.terms} />
                    </Tab>
                    <Tab className="report-group-tab" eventKey="pre-primary" title="Pre-primary">
                        <AdminPrePrimaryReportsList context={props.context} loading={loadingReports} reports={reports.filter(r => r.grade === 0)} reportGroupId={reportGroup.id} terms={reportGroup.terms} />
                    </Tab>
                </Tabs>
            }
            {
                // report generation
                <div className="border rounded shadow hor-center report-generation-jobs-container">
                    <div className="vert-flex space-between p-2">
                        <h3>Report generation</h3>
                        <Button onClick={() => setAddingGenerationJob(true)} variant="success">New</Button>
                    </div>

                    {
                        addingGenerationJob &&
                        <AddEditComponent cancel={() => setAddingGenerationJob(false)}
                            data={{
                                Term: 1,
                                School_ReOpens: {
                                    IDate: "IDate",
                                    key: "School Re-Opens",
                                    value: ""
                                }
                            }}

                            submit={addGenerationJobs}
                            title={"Generate reports"}
                        />
                    }

                    {
                        !loadingGenerationJobs &&
                        <Accordion onSelect={(key) => setAccordianKey((key === undefined || key === null) ? "" : key.toString())}>
                            {
                                generationJobs.map((job, index) => {
                                    return (
                                        <Accordion.Item key={index} eventKey={`${index}`}>
                                            <Accordion.Header>
                                                <div className="vert-flex">
                                                    <h5>Term: {job.term}</h5>
                                                </div>
                                            </Accordion.Header>
                                            {
                                                accordianKey === `${index}` &&
                                                <ReportGenerationJobView context={props.context} job={job} refresh={getGenerationJobs} />
                                            }
                                        </Accordion.Item>
                                    );
                                })
                            }
                        </Accordion>
                    }

                    {
                        loadingGenerationJobs &&
                        <Loading />
                    }
                </div>
            }
        </div>
    );
}

export default AdminReportGroupView;