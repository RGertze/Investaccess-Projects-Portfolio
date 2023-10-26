import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IPersona, IPersonaCategory, IReport } from "../../interfaces/report-interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import ReportSheetStudent from "../report-sheet-student/reportSheetStudent";
import "./reportSheet.css";

interface IProps {
    context: IGlobalContext
    reports: IReport[],
    terms: number,
    show: boolean,
    hide(): void
}

const ReportSheet = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [personaCategories, setPersonaCategories] = useState<IPersonaCategory[]>([]);
    const [personas, setPersonas] = useState<IPersona[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getPersonaCategories();
        getAllPersonas();
    }, []);

    //----   GET ALL PERSONA   ----
    const getAllPersonas = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PERSONAS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setPersonas(result.data);
    }

    //----   GET PERSONA CATEGORIES   ----
    const getPersonaCategories = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PERSONA_CATEGORIES, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setPersonaCategories(result.data);
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
                            <ReportSheetStudent key={index} context={props.context} personaCategories={personaCategories} personas={personas} report={report} terms={props.terms} />
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

export default ReportSheet;