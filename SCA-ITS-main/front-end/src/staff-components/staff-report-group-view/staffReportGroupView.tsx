import { useEffect, useState } from "react";
import { Accordion, Tab, Table, Tabs } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import AdminPrePrimaryReportsList from "../../admin-components/admin-pre-primary-reports-list/adminPrePrimaryReportsList";
import AdminPrimaryReportsList from "../../admin-components/admin-primary-reports-list/adminPrimaryReportsList";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IReport, IReportGroup } from "../../interfaces/report-interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";

interface IProps {
    context: IGlobalContext
}

const StaffReportGroupView = (props: IProps) => {
    const params = useLocation();
    const reportGroup = (params.state as IReportGroup);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('primary');

    const [loadingReports, setLoadingReports] = useState(false);

    const [reports, setReports] = useState<IReport[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getReports();
    }, []);

    // ON TAB CHANGE
    useEffect(() => {
        if (tabKey === "primary") {

        }
        if (tabKey === "pre-primary") {

        }
    }, [tabKey]);

    //----   GET ALL REPORTS FOR STAFF   ----
    const getReports = async () => {
        setLoadingReports(true);
        let qry = GET_ENDPOINT.GET_STUDENT_REPORTS.toString() + reportGroup.id;
        qry += `?staffId=${props.context.userId}`
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoadingReports(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setReports(result.data);
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
        </div>
    );
}

export default StaffReportGroupView;