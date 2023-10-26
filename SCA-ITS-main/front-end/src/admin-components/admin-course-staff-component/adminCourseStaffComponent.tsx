import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseStaff } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IStaff } from "../../interfaces/staff_interfaces";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminCourseStaffComponent.css";


interface ICourseStaffInput {
    Staff_Member: ISelect
}

interface IProps {
    context: IGlobalContext,
    courseId: string
}

const AdminCourseStaffComponent = (props: IProps) => {

    const [staff, setStaff] = useState<IStaff[]>([]);

    const [loadingCourseStaff, setLoadingCourseStaff] = useState(false);
    const [courseStaff, setCourseStaff] = useState<ICourseStaff[]>([]);

    const [showAddingCourseStaff, setShowAddingCourseStaff] = useState(false);
    const [newCourseStaffInput, setNewCourseStaffInput] = useState<ICourseStaffInput>({
        Staff_Member: {
            ISelect: "ISelect",
            key: "Staff_Member",
            values: [],
            value: 0
        }
    });

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllStaff();
        getAllCourseStaff();
    }, []);

    // ON STAFF CHANGE
    useEffect(() => {
        mapStaffForInput();
    }, [staff]);

    // MAP STAFF FOR INPUT
    const mapStaffForInput = () => {
        let staffShort = staff.map((s) => {
            return {
                value: s.userId,
                name: `${s.firstName} ${s.lastName} `
            }
        });

        setNewCourseStaffInput({
            Staff_Member: {
                ISelect: "ISelect",
                key: "Staff_Member",
                values: staffShort,
                value: (staffShort.length > 0) ? staffShort[0].value : 0
            }
        });
    }

    //----   GET ALL STAFF   ----
    const getAllStaff = async () => {
        setLoadingCourseStaff(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_STAFF, "");
        setLoadingCourseStaff(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStaff(result.data);
    }

    //----   GET ALL COURSE STAFF   ----
    const getAllCourseStaff = async () => {
        setLoadingCourseStaff(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_COURSE_STAFF + props.courseId, "");
        setLoadingCourseStaff(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseStaff(result.data);
    }

    //----   ADD NEW COURSE STAFF   ----
    const addNewCourseStaff = async (data: any): Promise<boolean> => {
        let inputVals: ICourseStaffInput = data;
        if (!validateNewCourseData(inputVals)) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_COURSE_STAFF, {
            courseId: props.courseId,
            staffId: inputVals.Staff_Member.value
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Staff Added!", true, 2000);
        setShowAddingCourseStaff(false);
        getAllCourseStaff();
        return true;
    }

    //----   DELETE COURSE STAFF   ----
    const deleteCourseStaff = async (staffId: number) => {
        setLoadingCourseStaff(true);
        let qry = `?courseId=${props.courseId}&staffId=${staffId}`
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_COURSE_STAFF + qry);
        console.log(result);
        setLoadingCourseStaff(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("success", true, 2000);
        getAllCourseStaff();
        return true;
    }

    //----   VALIDATE NEW COURSE DATA   ----
    const validateNewCourseData = (data: ICourseStaffInput): boolean => {
        if (data.Staff_Member.value === 0) {
            errorToast(`Choose a staff member`);
            return false;
        }

        return true;
    }

    // VIEW STAFF
    const viewStaff = (userId: number) => {
        navigate(`/admin/staff/${userId}`, { state: userId });
    }

    return (
        <div className="admin-parents-page-container">
            <Button onClick={() => setShowAddingCourseStaff(true)} variant="success">Add Course Staff</Button>

            {
                showAddingCourseStaff &&
                <AddEditComponent title="Add Course Staff" submit={addNewCourseStaff} cancel={() => setShowAddingCourseStaff(false)} data={newCourseStaffInput} />
            }

            <TableV2
                title="Staff"
                columns={[
                    { title: "First Name", field: "firstName" },
                    { title: "Last Name", field: "lastName" },
                    { title: "Email", field: "email" },
                ]}
                filtering={false}

                isLoading={loadingCourseStaff}

                onDelete={async (staff: ICourseStaff) => deleteCourseStaff(staff.staffId)}
                onRowClick={async (staff: ICourseStaff) => viewStaff(staff.staffId)}

                data={courseStaff}
            />
        </div>
    );
}

export default AdminCourseStaffComponent;