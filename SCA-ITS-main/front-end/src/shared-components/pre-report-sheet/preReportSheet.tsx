import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IDevelopmentAssessment, IDevelopmentCategory, IDevelopmentGroup, IReport } from "../../interfaces/report-interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import PreReportSheetStudent from "../pre-report-sheet-student/preReportSheetStudent";

interface IProps {
    context: IGlobalContext
    reports: IReport[],
    terms: number,
    show: boolean,
    hide(): void
}

const PreReportSheet = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [devGroups, setDevGroups] = useState<IDevelopmentGroup[]>([]);
    const [devCats, setDevCats] = useState<IDevelopmentCategory[]>([]);
    const [devAssessments, setDevAssessments] = useState<IDevelopmentAssessment[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getDevGroups();
        getDevCategories();
        getDevAssessments();
    }, []);

    //----   GET DEVELOPMENT GROUPS   ----
    const getDevGroups = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DEV_GROUPS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevGroups(result.data);
    }

    //----   GET DEVELOPMENT CATEGORIES   ----
    const getDevCategories = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DEV_CATEGORIES, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevCats(result.data);
    }

    //----   GET DEVELOPMENT ASSESSMENTS   ----
    const getDevAssessments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DEV_ASSESSMENTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevAssessments(result.data);
    }

    return (
        <Modal style={{ zIndex: "999999" }} fullscreen show={true} onHide={() => props.hide()}>
            <Modal.Header closeButton className="report-sheet-header">
                <h1 className="no-pad-marg">Bulk Report Edit</h1>
            </Modal.Header>

            <Modal.Body>
                {
                    !loading &&
                    props.reports.map((report, index) => {
                        return (
                            <PreReportSheetStudent key={index} context={props.context} devGroups={devGroups} devCats={devCats} devAssessments={devAssessments} report={report} terms={props.terms} />

                        );
                    })
                }
                {
                    loading &&
                    <Loading />
                }

            </Modal.Body>
        </Modal>
    );
}

export default PreReportSheet;