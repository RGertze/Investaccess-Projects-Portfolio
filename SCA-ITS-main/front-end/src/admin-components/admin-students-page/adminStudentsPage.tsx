import { Add, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IParentAll } from "../../interfaces/parent_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import { getStatusBadgeColourFromString, getStudentStatusBadgeColour, REGISTRATION_STAGE_STRING } from "../../utilities/registrationHelpers";
import "./adminStudentsPage.css";


interface INewStudentInput {
    Parent_Id: ISelect,
    Student_Number: string,
    FirstName: string,
    LastName: string,
    Grade: number
}

interface IProps {
    context: IGlobalContext
}

const AdminStudentsPage = (props: IProps) => {

    const [parents, setParents] = useState<IParentAll[]>([]);

    const [loadingAllStudent, setLoadingAllStudents] = useState(false);
    const [students, setStudents] = useState<IStudent[]>([]);

    const [showAddingStudent, setShowAddingStudent] = useState(false);
    const [newStudentInput, setNewStudentInput] = useState<INewStudentInput>({
        Parent_Id: {
            ISelect: "ISelect",
            key: "Parent_Id",
            values: [],
            value: 0
        },
        Student_Number: "",
        FirstName: "",
        LastName: "",
        Grade: 0
    });

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getStudents();
        getParents();
    }, []);

    // ON PARENTS CHANGE
    useEffect(() => {
        mapParentsForInput();
    }, [parents]);

    // MAP PARENTS FOR INPUT
    const mapParentsForInput = () => {
        let parentsShort = parents.map((p) => {
            return {
                value: p.userId,
                name: `${p.firstName} ${p.lastName} `
            }
        });

        setNewStudentInput({
            ...newStudentInput, Parent_Id: {
                ISelect: "ISelect",
                key: "Parent_Id",
                values: parentsShort,
                value: (parentsShort.length > 0) ? parentsShort[0].value : 0
            }
        })
    }

    //----   GET ALL STUDENTS   ----
    const getStudents = async () => {
        setLoadingAllStudents(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_STUDENTS, "");
        setLoadingAllStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        console.log(result.data);

        setStudents(result.data);
    }

    //----   GET ALL PARENTS   ----
    const getParents = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_PARENTS, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setParents(result.data);
    }

    //----   ADD NEW STUDENT   ----
    const addNewStudent = async (data: any): Promise<boolean> => {
        let inputVals: INewStudentInput = data;
        if (!validateNewParentData(inputVals)) {
            return false;
        }

        let newStudentData = {
            parentId: data.parentId,
            firstName: data.firstName,
            lastName: data.lastName,
            dob: data.dob,
            grade: data.grade
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_STUDENT, newStudentData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Student Added!", true, 2000);
        mapParentsForInput();
        setShowAddingStudent(false);
        getStudents();
        return true;
    }

    //----   VALIDATE NEW PARENT DATA   ----
    const validateNewParentData = (data: any): boolean => {
        if (data.parentId === 0) {
            errorToast("Choose a parent");
            return false;
        }
        if (data.studentNumber === "") {
            errorToast("Enter a student number");
            return false;
        }
        if (data.firstName === "") {
            errorToast("Enter a first name");
            return false;
        }
        if (data.lastName === "") {
            errorToast("Enter a last name");
            return false;
        }
        if (data.dob === "") {
            errorToast("Enter a last name");
            return false;
        }
        if (data.grade < 0 || data.grade > 12) {
            errorToast("Enter a grade between 0 and 12!");
            return false;
        }
        return true;
    }

    //----   BULK PROMOTE STUDENTS   ----
    const bulkPromotestudents = async (data: IStudent[]): Promise<boolean> => {

        let dataToSend: any[] = [];

        // increase grade if < 12
        for (let i = 0; i < data.length; i++) {
            if (data[i].grade < 12) {
                dataToSend.push({
                    studentNumber: data[i].studentNumber,
                    grade: data[i].grade + 1
                })
            }
        }

        await bulkEditStudents(dataToSend);
        getStudents();
        return true;
    }

    //----   BULK DEMOTE STUDENTS   ----
    const bulkDemotestudents = async (data: IStudent[]): Promise<boolean> => {

        let dataToSend: any[] = [];

        // increase grade if > 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].grade > 0) {
                dataToSend.push({
                    studentNumber: data[i].studentNumber,
                    grade: data[i].grade - 1
                })
            }
        }

        await bulkEditStudents(dataToSend);
        getStudents();
        return true;
    }

    //----   BULK EDIT STUDENTS   ----
    const bulkEditStudents = async (data: any): Promise<boolean> => {
        setLoadingAllStudents(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENTS_BULK, data, {});
        setLoadingAllStudents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Students updated", true, 1500);
        return true;
    }

    //----   DELETE STUDENT   ----
    const deleteStudent = async (studentNumber: string) => {
        setLoadingAllStudents(true);
        let qry = DELETE_ENDPOINT.DELETE_STUDENT.toString();
        qry = qry.replace("{studentNumber}", studentNumber);
        let result: IResponse = await Connection.delRequest(qry);
        setLoadingAllStudents(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Student successfully removed", true, 1500);
        getStudents();
        return true;
    }

    // VIEW STUDENT
    const viewStudent = (studentNumber: string) => {
        navigate(`/admin/students/${studentNumber}`, { state: studentNumber });
    }

    return (
        <div className="admin-parents-page-container">

            {
                showAddingStudent &&
                <AddEditComponentV2
                    title='Add new Student'
                    cancel={() => setShowAddingStudent(false)}
                    submit={addNewStudent}
                    fields={[
                        {
                            key: "parentId", name: "Parent", type: INPUT_TYPE.SELECT, value: parents.length > 0 ? parents[0].userId : 0,
                            selectValues: parents.map(p => { return { name: `${p.firstName} ${p.lastName}`, value: p.userId }; })
                        },
                        { key: "firstName", name: "First Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "lastName", name: "Last Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "dob", name: "Date of Birth", type: INPUT_TYPE.DATE, value: "" },
                        { key: "grade", name: "Grade", type: INPUT_TYPE.NUMBER, value: "" },
                    ]}
                />
            }

            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    { title: "Date of Birth", field: "dob", filtering: false },
                    {
                        title: "Grade", field: "grade", type: "numeric",
                        lookup: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, },
                    },
                    {
                        title: "Status", field: "registrationStageString",
                        render: (rowData: any) => <Badge bg={getStatusBadgeColourFromString(rowData.registrationStageString)}>
                            {rowData.registrationStageString}
                        </Badge>,
                        lookup: { "approved": "approved", "denied": "denied", "incomplete": "incomplete" },
                    },
                    { title: "Created At", field: "createdAt", filtering: false },
                ]}
                filtering={true}

                isLoading={loadingAllStudent}

                onAdd={async () => setShowAddingStudent(true)}
                onDelete={async (student: IStudent) => deleteStudent(student.studentNumber)}
                onRowClick={async (student: IStudent) => viewStudent(student.studentNumber)}

                data={students.map(s => { return { ...s, registrationStageString: (s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : s.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}

                selection={true}

                customActions={[
                    {
                        icon: forwardRef<SVGSVGElement>((props, ref) => (
                            <Button variant="contained" color="success" startIcon={<ArrowUpward />}>
                                Promote
                            </Button>
                        )),
                        onClick: (event, data) => {
                            bulkPromotestudents(data);
                        },
                        isFreeAction: false,
                        position: "toolbar",
                        tooltip: "Promote students to the next grade"
                    },
                    {
                        icon: forwardRef<SVGSVGElement>((props, ref) => (
                            <Button variant="contained" color="error" startIcon={<ArrowDownward />}>
                                Demote
                            </Button>
                        )),
                        onClick: (event, data) => {
                            bulkDemotestudents(data);
                        },
                        isFreeAction: false,
                        position: "toolbar",
                        tooltip: "Demote students to the previous grade"
                    },
                ]}


            />
        </div>
    );
}

export default AdminStudentsPage;