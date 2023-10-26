import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUserAll } from "../../interfaces/general_interfaces";
import { confirmation, errorToast, successToast } from "../../shared-components/alert-components/toasts";
import FilterComponent, { FILTER_TYPE } from "../../shared-components/filter-component/filterComponent";
import Loading from "../../shared-components/loading-component/loading";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import "./adminUsersPage.css"


interface IProps {
    context: IGlobalContext
}

const UsersPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IUserAll[]>([]);
    const [usersToList, setUsersToList] = useState<IUserAll[]>([]);

    //----   COMPONENT DID MOUND   ----
    useEffect(() => {
        getAllUsers();
    }, []);

    //----   ON USERS CHANGE   ----
    useEffect(() => {
        if (users.length > 0)
            setUsersToList(users);
    }, [users]);


    //----   GET ALL USERS   ----
    const getAllUsers = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_USERS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setUsers(result.data);
    }

    //----   UPDATE USER ACCOUNT STATUS   ----
    const updateUserAccountStatus = async (data: IUserAll, active: boolean): Promise<boolean> => {
        setLoading(true);

        let dataToSend = {
            userId: data.userId,
            status: active ? 1 : 0
        }

        const result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_USER_ACCOUNT_STATUS, dataToSend, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return false;
        }

        successToast("success", true);
        getAllUsers();
        return true;
    }

    //----   FILTER USERS   ----
    const filterUsers = async (data: any) => {
        let filteredUsers = users.slice();

        console.log(data);

        if (data.Type && data.Type !== 0) {
            filteredUsers = filteredUsers.filter(u => u.userTypeId === data.Type);
        }
        if (data.Email && data.Email !== "") {
            filteredUsers = filteredUsers.filter(u => u.email.toLocaleLowerCase().includes(data.Email));
        }
        if (data.Name && data.Name !== "") {
            filteredUsers = filteredUsers.filter(u => `${u.firstName} ${u.lastName}`.toLocaleLowerCase().includes(data.Name));
        }

        setUsersToList(filteredUsers);
    }

    //----   ON DELETE   ----
    const onDelete = async (data: IUserAll) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_USER.toString();
        qry = qry.replace("{userId}", data.userId.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        getAllUsers();
    }

    return (
        <>
            <div className="full-size">
                <TableComponent
                    title="Users"
                    context={props.context}

                    filterComponent={
                        <FilterComponent filters={
                            [
                                {
                                    type: FILTER_TYPE.STRING,
                                    label: "Email",
                                    defaultValue: "search by email",
                                },
                                {
                                    type: FILTER_TYPE.STRING,
                                    label: "Name",
                                    defaultValue: "search by name",
                                },
                                {
                                    type: FILTER_TYPE.SELECT,
                                    label: "Type",
                                    defaultValue: undefined,
                                    values: [
                                        {
                                            id: 1,
                                            name: "Admin"
                                        },
                                        {
                                            id: 2,
                                            name: "Doctor"
                                        },
                                        {
                                            id: 3,
                                            name: "Patient"
                                        },
                                        {
                                            id: 4,
                                            name: "Receptionist"
                                        },
                                    ]
                                },
                            ]
                        }
                            onSubmit={filterUsers}
                        />
                    }

                    ids={[...users]}
                    headerValues={["", "Email", "Name", "Type", "Active"]}
                    data={
                        usersToList.map((user, index) => {
                            return {
                                colValues: [
                                    { type: TABLE_DATA_TYPE.AVATAR, value: user.profilePicPath },
                                    { type: TABLE_DATA_TYPE.STRING, value: user.email },
                                    { type: TABLE_DATA_TYPE.STRING, value: `${user.firstName} ${user.lastName}` },
                                    { type: TABLE_DATA_TYPE.STRING, value: user.userTypeName },
                                    { type: TABLE_DATA_TYPE.SWITCH, value: user.isActive === 1, callback: updateUserAccountStatus },
                                ]
                            }
                        })
                    }

                    onDelete={onDelete}
                />

                {
                    loading &&
                    <Loading color="blue" />
                }

            </div>


        </>
    );
}

export default UsersPage;