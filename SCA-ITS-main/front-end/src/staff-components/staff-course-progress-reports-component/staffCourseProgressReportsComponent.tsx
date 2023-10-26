import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseStaff } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { ICourseProgressReport, IProgressReport } from "../../interfaces/progress_report_interfaces";
import { IStaff } from "../../interfaces/staff_interfaces";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import MarkSheet from "../../shared-components/mark-sheet/markSheet";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./staffCourseProgressReportsComponent.css";



interface IProps {
    context: IGlobalContext,
    courseId: string
}

const StaffCourseProgressReportsComponent = (props: IProps) => {

    const [progressReports, setProgressReports] = useState<IProgressReport[]>([]);

    const [loading, setLoading] = useState(false);
    const [courseProgressReports, setCourseProgressReports] = useState<ICourseProgressReport[]>([]);

    const [reportToView, setReportToView] = useState<ICourseProgressReport>();

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllCourseProgressReports();
    }, []);


    //----   GET ALL COURSE PROGRESS REPORTS   ----
    const getAllCourseProgressReports = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_COURSE_PROGRESS_REPORTS + props.courseId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseProgressReports(result.data);
    }

    //----   VIEW PROGRESS REPORT   ----
    const view = (val: ICourseProgressReport) => {
        setReportToView(val);
    }

    return (
        <div className="admin-parents-page-container">

            <TableV2
                title="Progress Report Templates"
                columns={[
                    { title: "Name", field: "name" },
                    { title: "Year", field: "year" },
                    { title: "Exam Weight", field: "examWeight" },
                ]}
                filtering={false}

                isLoading={loading}

                onRowClick={async (data: ICourseProgressReport) => view(data)}

                data={courseProgressReports}
            />

            {
                reportToView &&
                <Modal style={{ zIndex: "999999" }} fullscreen onHide={() => setReportToView(undefined)} show={reportToView !== undefined}>
                    <Modal.Header closeButton>
                        <h3>Mark Sheet</h3>
                    </Modal.Header>

                    <Modal.Body>
                        <MarkSheet context={props.context} courseProgressReport={reportToView} />
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
}

export default StaffCourseProgressReportsComponent;