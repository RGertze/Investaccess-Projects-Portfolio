import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import { getStatusBadgeColourFromString, REGISTRATION_STAGE_STRING } from "../../utilities/registrationHelpers";
import "./adminStaffStudentsComponent.css";


interface IProps {
    context: IGlobalContext,
    staffId: number
}

const AdminStaffStudentsComponent = (props: IProps) => {
    const navigate = useNavigate();

    const [students, setStudents] = useState<IStudent[]>([]);

    const [loadingStudents, setLoadingStudents] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getStaffStudents();
    }, []);


    //----   GET STAFF STUDENTS   ----
    const getStaffStudents = async () => {
        setLoadingStudents(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENTS_FOR_STAFF + props.staffId, "");
        setLoadingStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudents(result.data);
    }

    // VIEW STUDENT
    const viewStudent = (userId: any) => {
        navigate(`/admin/students/${userId}`, { state: userId });
    }

    return (
        <div className="admin-parents-page-container">
            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    {
                        title: "Grade", field: "grade", type: "numeric",
                        lookup: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, },
                    },
                ]}
                filtering={true}

                isLoading={loadingStudents}

                onRowClick={async (data: IStudent) => viewStudent(data.studentNumber)}

                data={students}
            />
        </div>
    );
}

export default AdminStaffStudentsComponent;