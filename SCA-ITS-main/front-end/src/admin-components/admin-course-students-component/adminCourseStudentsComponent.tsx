import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseStaff, ICourseStudent } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { IStaff } from "../../interfaces/staff_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminCourseStudentsComponent.css";


interface ICourseStudentInput {
    Student: ISelect
}

interface IProps {
    context: IGlobalContext,
    courseId: string,
    grade: number
}

const AdminCourseStudentsComponent = (props: IProps) => {

    const [students, setStudents] = useState<IStudent[]>([]);

    const [loadingCourseStudents, setLoadingCourseStudents] = useState(false);
    const [courseStudents, setCourseStudents] = useState<ICourseStudent[]>([]);

    const [showAddingCourseStudent, setShowAddingCourseStudent] = useState(false);
    const [newCourseStudentInput, setNewCourseStudentInput] = useState<ICourseStudentInput>({
        Student: {
            ISelect: "ISelect",
            key: "Student",
            values: [],
            value: ""
        }
    });

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllCourseStudents();
        getAllStudents();
    }, []);

    useEffect(() => {
        getAllStudents();
    }, [props.grade]);

    // ON STUDENTS CHANGE
    useEffect(() => {
        mapStudentsForInput();
    }, [students]);

    // MAP STUDENTS FOR INPUT
    const mapStudentsForInput = () => {
        let filteredStudents = students.filter(s => s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED);

        let studentsShort = filteredStudents.map((s) => {
            return {
                value: s.studentNumber,
                name: `${s.firstName} ${s.lastName} `
            }
        });

        // remove students already in course 
        studentsShort = studentsShort.filter(s => courseStudents.findIndex(cs => cs.studentNumber == s.value) === -1);

        setNewCourseStudentInput({
            Student: {
                ISelect: "ISelect",
                key: "Student",
                values: studentsShort,
                value: (studentsShort.length > 0) ? studentsShort[0].value : ""
            }
        });
    }

    //----   GET ALL STUDENTS   ----
    const getAllStudents = async () => {
        console.log(props.grade);
        setLoadingCourseStudents(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_STUDENTS + `?grade=${props.grade}`, "");
        setLoadingCourseStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudents(result.data);
    }

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

    //----   ADD NEW COURSE STUDENT   ----
    const addNewCourseStudent = async (data: any): Promise<boolean> => {
        let inputVals: ICourseStudentInput = data;
        if (!validateNewCourseStudentData(inputVals)) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_COURSE_STUDENT, {
            courseId: props.courseId,
            studentNumber: inputVals.Student.value
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Student Added!", true, 2000);
        setShowAddingCourseStudent(false);
        getAllCourseStudents();
        getAllStudents();
        return true;
    }

    //----   DELETE COURSE STUDENT   ----
    const deleteCourseStudent = async (studentNumber: string) => {
        setLoadingCourseStudents(true);
        let qry = `?courseId=${props.courseId}&studentNumber=${studentNumber}`
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_COURSE_STUDENTS + qry);
        setLoadingCourseStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        getAllCourseStudents();
        getAllStudents();
        return true;
    }

    //----   VALIDATE NEW COURSE DATA   ----
    const validateNewCourseStudentData = (data: ICourseStudentInput): boolean => {
        if (data.Student.value === "") {
            errorToast(`Choose a student`);
            return false;
        }

        return true;
    }

    // VIEW STUDENT
    const viewStudent = (userId: any) => {
        navigate(`/admin/students/${userId}`, { state: userId });
    }

    return (
        <div className="admin-parents-page-container">
            {
                showAddingCourseStudent &&
                <AddEditComponent title="Add Student to Course" submit={addNewCourseStudent} cancel={() => setShowAddingCourseStudent(false)} data={newCourseStudentInput} />
            }

            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                ]}
                filtering={true}

                isLoading={loadingCourseStudents}

                onAdd={async () => setShowAddingCourseStudent(true)}
                onDelete={async (data: ICourseStudent) => deleteCourseStudent(data.studentNumber)}
                onRowClick={async (data: IStudent) => viewStudent(data.studentNumber)}

                data={courseStudents}
            />
        </div>
    );
}

export default AdminCourseStudentsComponent;