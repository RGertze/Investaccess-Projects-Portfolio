import { useEffect, useState } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IParentProfile } from "../../interfaces/parent_interfaces";
import { REG_REQ_TYPE } from "../../interfaces/registration_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import EditableTable from "../../shared-components/editable-component/editableComponent";
import FinancialStatementTable from "../../shared-components/financial-statement-table/financialStatementTable";
import Loading from "../../shared-components/loading-component/loading";
import OtherParentsComponent from "../../shared-components/other-parents-component/otherParentsComponent";
import { RegistrationDocsAccordian } from "../../shared-components/registration-docs-accordian/registrationDocsAccordian";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import UserPic from "../../shared-components/user-pic-component/userPic";
import ParentStudentsComponent from "../parent-students-component/parentStudentsComponent";
import "./adminParentPage.css";

interface IProps {
    context: IGlobalContext
}

const AdminParentPage = (props: IProps) => {
    const params = useLocation();
    const userId = (params.state as number);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('students');

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<IUser>({
        email: "",
        firstName: "",
        lastName: "",
        profilePicPath: "",
        userId: 0
    });
    const [profile, setProfile] = useState<IParentProfile>({
        userId: 0,
        idNumber: "",
        employer: "",
        occupation: "",
        monthlyIncome: 0,
        workingHours: "",
        specialistSkillsHobbies: "",
        telephoneWork: "",
        telephoneHome: "",
        fax: "",
        cellNumber: "",
        postalAddress: "",
        residentialAddress: "",
        maritalStatus: "",

        registrationStage: 0
    });

    const [editPassword, setEditPassword] = useState(false);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getUserDetails();
        getParentDetails();
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
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_USER + userId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setUser(result.data);
    }

    //----   GET PARENT DETAILS   ----
    const getParentDetails = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PARENT_PROFILE + userId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProfile(result.data);
    }

    //---   UPDATE PARENT PROFILE   ---
    const updateParentProfile = async (data: IParentProfile): Promise<boolean> => {
        data.userId = profile.userId;

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_PROFILE, data, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Profile updated!", true, 2000);
        getParentDetails();

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

                <div className="hor-center admin-parent-details">
                    {
                        <UserPic profilePicPath={user.profilePicPath} />
                    }

                    <div className="profile-details">
                        <Table>
                            <tbody>
                                {
                                    loading &&
                                    <tr>
                                        <td colSpan={2}>
                                            <Loading />
                                        </td>
                                    </tr>
                                }
                                {
                                    !loading &&
                                    <>
                                        <tr>
                                            <td width="40%">Email:</td>
                                            <td>{user.email}</td>
                                        </tr>
                                        <tr>
                                            <td>Firstname:</td>
                                            <td>{user.firstName}</td>
                                        </tr>
                                        <tr>
                                            <td>Lastname:</td>
                                            <td>{user.lastName}</td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </Table>
                    </div>

                    <div className="parent-details-buttons">
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
                </div>
            }

            {
                // TABS
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "students")}>
                    <Tab className="registration-tab" eventKey="registration" title="Registration">
                        <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.PARENT} userIdOrStudentNumber={userId.toString()} />
                    </Tab>
                    <Tab className="profile-tab" eventKey="profile" title="Profile">
                        <EditableTable
                            title={`Profile Details`}
                            id={profile.userId}
                            data={
                                [
                                    { key: "idNumber", name: "ID Number: ", value: profile.idNumber, type: INPUT_TYPE.TEXT },
                                    { key: "employer", name: "Employer: ", value: profile.employer, type: INPUT_TYPE.TEXT },
                                    { key: "occupation", name: "Occupation: ", value: profile.occupation, type: INPUT_TYPE.TEXT },
                                    { key: "monthlyIncome", name: "Annual Budget: ", value: profile.monthlyIncome, type: INPUT_TYPE.NUMBER },
                                    { key: "workingHours", name: "Working Hours: ", value: profile.workingHours, type: INPUT_TYPE.TEXT },
                                    { key: "specialistSkillsHobbies", name: "Specialist Skills/Hobbies: ", value: profile.specialistSkillsHobbies, type: INPUT_TYPE.TEXT },
                                    { key: "telephoneWork", name: "Telephone (Work): ", value: profile.telephoneWork, type: INPUT_TYPE.TEXT },
                                    { key: "telephoneHome", name: "Telephone (Home): ", value: profile.telephoneHome, type: INPUT_TYPE.TEXT },
                                    { key: "fax", name: "Fax: ", value: profile.fax, type: INPUT_TYPE.TEXT },
                                    { key: "cellNumber", name: "Cell Number: ", value: profile.cellNumber, type: INPUT_TYPE.TEXT },
                                    { key: "postalAddress", name: "Postal Address: ", value: profile.postalAddress, type: INPUT_TYPE.TEXT },
                                    { key: "residentialAddress", name: "Residential Address: ", value: profile.residentialAddress, type: INPUT_TYPE.TEXT },
                                    {
                                        key: "maritalStatus", name: "Marital Status: ", value: profile.maritalStatus, type: INPUT_TYPE.SELECT,
                                        selectValues: [
                                            { name: "Married", value: "Married" },
                                            { name: "Widowed", value: "Widowed" },
                                            { name: "Separated", value: "Separated" },
                                            { name: "Divorced", value: "Divorced" },
                                            { name: "Single", value: "Single" },
                                        ]
                                    },
                                ]
                            }
                            loading={loading}
                            onEdit={async (data: any) => updateParentProfile(data)}
                        />
                    </Tab>
                    <Tab className="students-tab" eventKey="students" title="Students">
                        <ParentStudentsComponent context={props.context} parentId={userId} />
                    </Tab>
                    <Tab className="other-parents-tab" eventKey="other-parents" title="Other Parents/Guardians">
                        <OtherParentsComponent context={props.context} parentId={userId} />
                    </Tab>
                    <Tab className="finances-tab" eventKey="finances" title="Finances">
                        <FinancialStatementTable context={props.context} parentId={userId} />
                    </Tab>
                </Tabs>
            }
        </div>
    );
}

export default AdminParentPage;