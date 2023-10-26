import { useEffect, useState } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IStaff } from "../../interfaces/staff_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import EditableTable from "../../shared-components/editable-component/editableComponent";
import Loading from "../../shared-components/loading-component/loading";
import AdminStaffStudentsComponent from "../admin-staff-students-component/adminStaffStudentsComponent";
import StaffCoursesComponent from "../staff-courses-component/staffCoursesComponent";
import "./adminStaffViewPage.css";

interface IProps {
    context: IGlobalContext
}

const AdminStaffViewPage = (props: IProps) => {
    const params = useLocation();
    const userId = (params.state as number);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('courses');

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<IStaff>({
        email: "",
        firstName: "",
        lastName: "",
        userId: 0
    });

    const [editPassword, setEditPassword] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getUserDetails();
    }, []);

    // ON TAB CHANGE
    useEffect(() => {
        if (tabKey === "students") {

        }
        if (tabKey === "finances") {

        }
    }, [tabKey]);

    //----   GET USER DETAILS   ----
    const getUserDetails = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STAFF + userId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setUser(result.data);
    }

    //----   EDIT STAFF   ----
    const editStaff = async (data: any): Promise<boolean> => {
        let dataToSend = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        }
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_USER, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Staff updated", true, 1500);
        getUserDetails();
        return true;
    }

    //----   UPDATE PASSWORD   ----
    const updatePassword = async (data: any): Promise<boolean> => {
        if (data.password === "") {
            errorToast("enter a password");
            return false;
        }
        if (data.password !== data.confirmPassword) {
            errorToast("passwords do not match");
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_EDIT_PASSWORD, {
            userId: userId,
            password: data.password
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Password Updated!", true, 2000);
        setEditPassword(false);
        return true;
    }

    return (
        <div className="admin-parent-page-container">

            {
                // USER DETAILS
                <EditableTable
                    title={`Staff View`}
                    id={user.userId}
                    data={
                        [
                            { key: "email", name: "Email: ", value: user.email, disabled: true, type: INPUT_TYPE.TEXT, },
                            { key: "firstName", name: "First Name: ", value: user.firstName, type: INPUT_TYPE.TEXT, },
                            { key: "lastName", name: "Last Name: ", value: user.lastName, type: INPUT_TYPE.TEXT, },
                        ]
                    }
                    loading={loading}
                    onEdit={editStaff}
                />
            }

            <div className="w-100">
                <Button className="hor-center" onClick={() => setEditPassword(true)} variant="success">Update Password</Button>
            </div>

            {
                editPassword &&
                <AddEditComponentV2
                    title='Update Password'
                    cancel={() => setEditPassword(false)}
                    submit={updatePassword}
                    fields={[
                        { key: "password", name: "New Password", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "confirmPassword", name: "Confirm Password", type: INPUT_TYPE.TEXT, value: "" },
                    ]}
                />
            }

            {
                // TABS
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "courses")}>
                    <Tab className="courses-tab" eventKey="courses" title="Courses">
                        <StaffCoursesComponent context={props.context} staffId={userId} />
                    </Tab>
                    <Tab className="students-tab" eventKey="students" title="Students">
                        <AdminStaffStudentsComponent context={props.context} staffId={userId} />
                    </Tab>
                </Tabs>
            }
        </div>
    );
}

export default AdminStaffViewPage;