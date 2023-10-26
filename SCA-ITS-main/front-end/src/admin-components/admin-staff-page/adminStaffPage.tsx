import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IParentAll } from "../../interfaces/parent_interfaces";
import { IStaff } from "../../interfaces/staff_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminStaffPage.css";


interface IProps {
    context: IGlobalContext
}

const AdminStaffPage = (props: IProps) => {

    const [loadingAllStaff, setLoadingAllStaff] = useState(false);
    const [staff, setStaff] = useState<IStaff[]>([]);

    const [showAddingStaff, setShowAddingStaff] = useState(false);

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getStaff();
    }, []);

    //----   GET ALL STAFF   ----
    const getStaff = async () => {
        setLoadingAllStaff(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_STAFF, "");
        setLoadingAllStaff(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStaff(result.data);
    }

    //----   ADD NEW STAFF   ----
    const addNewStaff = async (data: any): Promise<boolean> => {
        if (!validateNewStaffData(data)) {
            return false;
        }

        let newStaffData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_STAFF, newStaffData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Staff Added!", true, 2000);
        setShowAddingStaff(false);
        getStaff();
        return true;
    }

    //----   VALIDATE NEW STAFF DATA   ----
    const validateNewStaffData = (data: any): boolean => {
        for (let val of Object.keys(data)) {
            if (typeof data[val] === "string" && data[val] === "") {
                errorToast(`${data[val]} not entered!`);
                return false;
            }
        }

        if (data.confirmPassword !== data.password) {
            errorToast("Passwords do not match");
            return false;
        }

        return true;
    }

    // VIEW STAFF
    const viewStaff = (userId: number) => {
        navigate(`/admin/staff/${userId}`, { state: userId });
    }

    //----   DELETE STAFF   ----
    const deleteStaff = async (staffId: number) => {
        setLoadingAllStaff(true);
        let qry = DELETE_ENDPOINT.ADMIN_DELETE_USER.toString();
        qry = qry.replace("{userId}", staffId.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoadingAllStaff(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Staff successfully removed", true, 1500);
        getStaff();
        return true;
    }

    return (
        <div className="admin-parents-page-container">
            {
                showAddingStaff &&
                <AddEditComponentV2
                    title='Add New Course'
                    cancel={() => setShowAddingStaff(false)}
                    submit={addNewStaff}
                    fields={[
                        { key: "email", name: "Email", type: INPUT_TYPE.EMAIL, value: "", required: true },
                        { key: "firstName", name: "First Name", type: INPUT_TYPE.TEXT, value: "", required: true },
                        { key: "lastName", name: "Last Name", type: INPUT_TYPE.TEXT, value: "", required: true },
                        { key: "password", name: "Password", type: INPUT_TYPE.PASSWORD, value: "", required: true },
                        { key: "confirmPassword", name: "Confirm Password", type: INPUT_TYPE.PASSWORD, value: "", required: true },
                    ]}
                />
            }

            <TableV2
                title="Staff"
                columns={[
                    { title: "First Name", field: "firstName" },
                    { title: "Last Name", field: "lastName" },
                    { title: "Email", field: "email" },
                ]}
                filtering={false}

                isLoading={loadingAllStaff}

                onAdd={async () => setShowAddingStaff(true)}
                onDelete={async (staff: IStaff) => deleteStaff(staff.userId)}
                onRowClick={async (staff: IStaff) => viewStaff(staff.userId)}

                data={staff}
            />
        </div>
    );
}

export default AdminStaffPage;