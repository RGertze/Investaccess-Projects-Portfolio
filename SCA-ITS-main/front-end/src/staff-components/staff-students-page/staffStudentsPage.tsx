import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IParentAll } from "../../interfaces/parent_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./staffStudentsPage.css";

interface IProps {
    context: IGlobalContext
}

const StaffStudentsPage = (props: IProps) => {

    const [loadingAllStudent, setLoadingAllStudents] = useState(false);
    const [students, setStudents] = useState<IStudent[]>([]);


    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getStudents();
    }, []);


    //----   GET ALL STUDENTS   ----
    const getStudents = async () => {
        setLoadingAllStudents(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENTS_FOR_STAFF + props.context.userId, "");
        setLoadingAllStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudents(result.data);
    }

    // VIEW STUDENT
    const viewStudent = (studentNumber: string) => {
        navigate(`/staff/students/${studentNumber}`, { state: studentNumber });
    }

    return (
        <div className="admin-parents-page-container">

            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    { title: "Date of Birth", field: "dob", filtering: false },
                    {
                        title: "Grade", field: "grade",
                        lookup: { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", },
                    },
                ]}
                filtering={true}

                isLoading={loadingAllStudent}

                onRowClick={async (student: IStudent) => viewStudent(student.studentNumber)}

                data={students}
            />
        </div>
    );
}

export default StaffStudentsPage;