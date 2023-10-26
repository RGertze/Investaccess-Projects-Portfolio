import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseStaff, ICourseStudent } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./staffCourseStudentsComponent.css";


interface IProps {
    context: IGlobalContext,
    courseId: string
}

const StaffCourseStudentsComponent = (props: IProps) => {

    const [loadingCourseStudents, setLoadingCourseStudents] = useState(false);
    const [courseStudents, setCourseStudents] = useState<ICourseStudent[]>([]);

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllCourseStudents();
    }, []);


    //----   GET ALL COURSE STUDENTS   ----
    const getAllCourseStudents = async () => {
        setLoadingCourseStudents(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_COURSE_STUDENTS + props.courseId, "");
        setLoadingCourseStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseStudents(result.data);
    }

    // VIEW STUDENT
    const viewStudent = (userId: any) => {
        navigate(`/staff/students/${userId}`, { state: userId });
    }

    return (
        <div className="admin-parents-page-container">
            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                ]}
                filtering={true}

                isLoading={loadingCourseStudents}

                onRowClick={async (data: IStudent) => viewStudent(data.studentNumber)}

                data={courseStudents}
            />
        </div>
    );
}

export default StaffCourseStudentsComponent;