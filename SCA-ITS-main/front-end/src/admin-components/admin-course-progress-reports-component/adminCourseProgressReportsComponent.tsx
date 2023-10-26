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
import "./adminCourseProgressReportsComponent.css";


interface IProgRepInput {
    Progress_Report: ISelect,
    Number_Of_Terms: number,
    Year: number
}

interface IProps {
    context: IGlobalContext,
    courseId: string
}

const AdminCourseProgressReportsComponent = (props: IProps) => {

    const [progressReports, setProgressReports] = useState<IProgressReport[]>([]);

    const [loading, setLoading] = useState(false);
    const [courseProgressReports, setCourseProgressReports] = useState<ICourseProgressReport[]>([]);

    const [showAdding, setShowAdding] = useState(false);
    const [newCourseProgRepInput, setNewCourseProgRepInput] = useState<IProgRepInput>({
        Progress_Report: {
            ISelect: "ISelect",
            key: "Progress_Report",
            values: [],
            value: 0
        },
        Number_Of_Terms: 4,
        Year: 2022
    });

    const [reportToView, setReportToView] = useState<ICourseProgressReport>();

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllProgressReports();
        getAllCourseProgressReports();
    }, []);

    // ON PROGRESS REPORTS CHANGE
    useEffect(() => {
        progressReports.length > 0 &&
            mapProgressReportsForInput();
    }, [progressReports]);

    // MAP STAFF FOR INPUT
    const mapProgressReportsForInput = () => {
        let progRepsShort = progressReports.map((pr) => {
            return {
                value: pr.id,
                name: `${pr.name}`
            }
        });

        setNewCourseProgRepInput({
            Progress_Report: {
                ISelect: "ISelect",
                key: "Progress_Report",
                values: progRepsShort,
                value: (progRepsShort.length > 0) ? progRepsShort[0].value : 0
            },
            Number_Of_Terms: 4,
            Year: 2022
        });
    }

    //----   GET ALL PROGRESS REPORTS   ----
    const getAllProgressReports = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PROGRESS_REPORTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProgressReports(result.data);
    }

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

    //----   ADD NEW COURSE PROGRESS REPORT   ----
    const addNewCourseProgressReport = async (data: any): Promise<boolean> => {
        let inputVals: IProgRepInput = data;
        if (!validateNewData(inputVals)) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_COURSE_PROGRESS_REPORT, {
            courseId: props.courseId,
            progressReportId: inputVals.Progress_Report.value,
            numberOfTerms: inputVals.Number_Of_Terms,
            year: inputVals.Year
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Progress report Added!", true, 2000);
        setShowAdding(false);
        getAllCourseProgressReports();
        return true;
    }

    //----   DELETE COURSE PROGRESS REPORT   ----
    const deleteCourseProgressReport = async (courseProgRep: ICourseProgressReport) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_COURSE_PROGRESS_REPORT + courseProgRep.id);
        console.log(result);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Progress report deleted!", true, 2000);

        getAllCourseProgressReports();
        return true;
    }

    //----   VALIDATE NEW DATA   ----
    const validateNewData = (data: IProgRepInput): boolean => {
        if (data.Progress_Report.value === 0) {
            errorToast(`Choose a progress report`);
            return false;
        }
        if (data.Number_Of_Terms < 1) {
            errorToast(`Number of terms must be greater than 0`);
            return false;
        }
        if (data.Year < 2022) {
            errorToast(`Enter a valid year`);
            return false;
        }

        return true;
    }

    //----   VIEW PROGRESS REPORT   ----
    const view = (val: ICourseProgressReport) => {
        setReportToView(val);
    }

    return (
        <div className="admin-parents-page-container">
            {
                showAdding &&
                <AddEditComponent title="Add Course progress report" submit={addNewCourseProgressReport} cancel={() => setShowAdding(false)} data={newCourseProgRepInput} />
            }

            <TableV2
                title="Progress Report Templates"
                columns={[
                    { title: "Name", field: "name" },
                    { title: "Year", field: "year" },
                    { title: "Exam Weight", field: "examWeight" },
                ]}
                filtering={false}

                isLoading={loading}

                onAdd={async () => setShowAdding(true)}
                onDelete={async (data: ICourseProgressReport) => deleteCourseProgressReport(data)}
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

export default AdminCourseProgressReportsComponent;