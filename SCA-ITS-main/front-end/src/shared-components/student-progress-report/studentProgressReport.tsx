import { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces"
import { IProgressReportCategory } from "../../interfaces/progress_report_interfaces";
import { errorToast } from "../alert-components/toasts";
import StudentProgReportCategory from "../student-prog-report-category/studentProgReportCategory";
import "./studentProgressReport.css"

interface IProps {
    progressReportId: number,
    progressReportName: string,
    courseReportId: number,
    studentNumber: string,
    numberOfTerms: number,
    context: IGlobalContext,
    hide(): void
}

const StudentProgressReport = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<IProgressReportCategory[]>([]);

    const [currentTerm, setCurrentTerm] = useState(1);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('Term: 1');

    useEffect(() => {
        getProgressReportCategories();
    }, []);

    //----   GET PROGRESS REPORT CATEGORIES   ----
    const getProgressReportCategories = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PROGRESS_REPORT_CATEGORIES + props.progressReportId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCategories(result.data);
    }

    return (
        <Modal style={{ zIndex: "999999" }} show={true} size="lg" onHide={() => props.hide()}>
            <Modal.Header className="student-progress-report-header" closeButton>
                <Modal.Title>
                    {props.progressReportName}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "students")}>
                    {
                        [...Array(props.numberOfTerms).fill(0)].map((_, index) => {
                            return (
                                <Tab key={index} eventKey={`Term: ${index + 1}`} title={`Term: ${index + 1}`}>
                                    {
                                        categories.map((category, catIndex) => {
                                            return (
                                                <StudentProgReportCategory key={catIndex} term={index + 1} courseReportId={props.courseReportId} studentNumber={props.studentNumber} category={category} context={props.context} />
                                            );
                                        })
                                    }
                                </Tab>
                            );
                        })
                    }
                </Tabs>

            </Modal.Body>

        </Modal >
    );
}

export default StudentProgressReport;