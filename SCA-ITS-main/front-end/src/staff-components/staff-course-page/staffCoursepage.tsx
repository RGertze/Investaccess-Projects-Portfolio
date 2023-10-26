import { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { ICourse } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import EditableTable from "../../shared-components/editable-component/editableComponent";
import Loading from "../../shared-components/loading-component/loading";
import StaffCourseProgressReportsComponent from "../staff-course-progress-reports-component/staffCourseProgressReportsComponent";
import StaffCourseStudentsComponent from "../staff-course-students-component/staffCourseStudentsComponent";
import "./staffCoursepage.css";

interface IProps {
    context: IGlobalContext
}

const StaffCourseViewPage = (props: IProps) => {
    const params = useLocation();
    const courseId = (params.state as string);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('progress-reports');

    const [loading, setLoading] = useState(false);

    const [course, setCourse] = useState<ICourse>({
        id: "",
        name: "",
        grade: 0,
        isPromotional: 0,

        typeId: 0,
        typeName: "",

        categoryId: 0,
        categoryName: ""
    });

    // COMPONENT DID MOUNT
    useEffect(() => {
        getCourseDetails();
    }, []);

    //----   GET COURSE DETAILS   ----
    const getCourseDetails = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_COURSE + courseId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourse(result.data);
    }

    return (
        <div className="admin-parent-page-container">

            <EditableTable
                title={`Course view`}
                id={course.id}
                data={
                    [
                        { key: "_", name: "Course Id: ", value: course.id, type: INPUT_TYPE.TEXT, disabled: true },
                        { key: "name", name: "Name: ", value: course.name, type: INPUT_TYPE.TEXT },
                        { key: "grade", name: "Grade: ", value: course.grade, type: INPUT_TYPE.NUMBER },
                        { key: "isPromotional", name: "Is Promotional: ", type: INPUT_TYPE.CHECK, value: course.isPromotional === 1, required: false },
                    ]
                }
                loading={loading}
                onEdit={async (data) => { return false; }}
                editable={false}
            />

            {
                // TABS
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "students")}>
                    <Tab className="students-tab" eventKey="students" title="Students">
                        <StaffCourseStudentsComponent context={props.context} courseId={courseId} />
                    </Tab>
                    <Tab className="progress-reports-tab" eventKey="progress-reports" title="Progress Reports">
                        <StaffCourseProgressReportsComponent context={props.context} courseId={courseId} />
                    </Tab>
                </Tabs>
            }
        </div>
    );
}

export default StaffCourseViewPage;