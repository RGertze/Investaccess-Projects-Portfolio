import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./staffCoursesPage.css";


interface IProps {
    context: IGlobalContext
}

const StaffCoursesPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<ICourse[]>([]);

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getCourses();
    }, []);

    //----   GET COURSES FOR STAFF   ----
    const getCourses = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_COURSES_FOR_STAFF + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourses(result.data);
    }


    // VIEW COURSE
    const viewCourse = (courseId: string) => {
        navigate(`/staff/courses/${courseId}`, { state: courseId });
    }

    return (
        <div className="admin-parents-page-container">
            <TableV2
                title="Courses"
                columns={[
                    { title: "Course ID", field: "id", filtering: false },
                    { title: "Name", field: "name", filtering: false },
                    {
                        title: "Grade", field: "grade",
                        lookup: { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", },
                    },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (course: ICourse) => viewCourse(course.id)}

                data={courses}
            />
        </div>
    );
}

export default StaffCoursesPage;