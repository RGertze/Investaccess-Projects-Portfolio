import { useEffect, useState } from 'react';
import { Connection, GET_ENDPOINT } from '../../connection';
import { ICourse } from '../../interfaces/course-interfaces';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { errorToast } from '../../shared-components/alert-components/toasts';
import TableList from '../../shared-components/table-list-component/tableListComponent';
import TableV2 from '../../shared-components/table-v2/tableV2';


interface IProps {
    context: IGlobalContext,
    staffId: number
}

const StaffCoursesComponent = (props: IProps) => {

    const [courses, setCourses] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState(false);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAllStaffCourses();
    }, []);

    //----   GET ALL STAFF COURSES   ----
    const getAllStaffCourses = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_COURSES_FOR_STAFF + props.staffId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setCourses(result.data);
    }

    return (
        <div className="">
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

                data={courses}
            />
        </div>
    );
}

export default StaffCoursesComponent;