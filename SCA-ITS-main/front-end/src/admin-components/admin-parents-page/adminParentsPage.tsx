import { useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IParentAll } from "../../interfaces/parent_interfaces";
import { PARENT_REGISTRATION_STAGE, STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { REPORT_GENERATION_STATUS, IGeneratedReport } from "../../interfaces/report-interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import loading from "../../shared-components/loading-component/loading";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import { getParentStatusBadgeColour, getStatusBadgeColourFromString, REGISTRATION_STAGE_STRING } from "../../utilities/registrationHelpers";
import "./adminParentsPage.css";


interface INewParentInput {
    Email: string,
    Password: string,
    Confirm_Password: string,
    FirstName: string,
    LastName: string,

    Address: string,
    CellNumber: string,
    IdNumber: string,
}

interface IProps {
    context: IGlobalContext
}

const AdminParentsPage = (props: IProps) => {
    const [loadingAllParents, setLoadingAllParents] = useState(false);
    const [allParents, setAllParents] = useState<IParentAll[]>([]);

    const [showAddingParent, setShowAddingParent] = useState(false);
    const [newParentInput, setNewParentInput] = useState<INewParentInput>({
        Email: "",
        Password: "",
        Confirm_Password: "",
        FirstName: "",
        LastName: "",

        Address: "",
        CellNumber: "",
        IdNumber: ""
    });

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllParents();
    }, []);

    //----   GET ALL PARENTS   ----
    const getAllParents = async () => {
        setLoadingAllParents(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_PARENTS, "");
        setLoadingAllParents(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setAllParents(result.data);
    }

    //----   ADD NEW PARENT   ----
    const addNewParent = async (data: any): Promise<boolean> => {
        let inputVals: INewParentInput = data;
        if (!validateNewParentData(inputVals)) {
            return false;
        }

        let newParentData = {
            email: inputVals.Email,
            password: inputVals.Password,
            firstName: inputVals.FirstName,
            lastName: inputVals.LastName,

            address: inputVals.Address,
            cellNumber: inputVals.CellNumber,
            idNumber: inputVals.IdNumber
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_PARENT, newParentData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Parent Added!", true, 2000);
        setNewParentInput({
            Email: "",
            Password: "",
            Confirm_Password: "",
            FirstName: "",
            LastName: "",

            Address: "",
            CellNumber: "",
            IdNumber: ""
        });
        setShowAddingParent(false);
        getAllParents();
        return true;
    }

    //----   VALIDATE NEW PARENT DATA   ----
    const validateNewParentData = (data: INewParentInput): boolean => {
        for (let val of Object.values(data)) {
            if (val === "" || !val) {
                errorToast(`${(val as string).replace("_", " ")} not entered!`);
                return false;
            }
        }
        if (data.Password !== data.Confirm_Password) {
            errorToast("Passwords do not match");
            return false;
        }
        return true;
    }

    //----   DELETE PARENT   ----
    const deleteParent = async (parentId: number) => {
        let qry = DELETE_ENDPOINT.ADMIN_DELETE_USER.toString();
        qry = qry.replace("{userId}", parentId.toString());
        setLoadingAllParents(true);
        let result: IResponse = await Connection.delRequest(qry);
        setLoadingAllParents(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Parent successfully removed", true, 1500);
        getAllParents();
        return true;
    }

    // VIEW PARENT
    const viewParent = (userId: number) => {
        navigate(`/admin/parents/${userId}`, { state: userId });
    }

    return (
        <div className="admin-parents-page-container">

            {
                showAddingParent &&
                <AddEditComponent title="Add new Parent" submit={addNewParent} cancel={() => setShowAddingParent(false)} data={newParentInput} />
            }

            <TableV2
                title="Parents"
                columns={[
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    { title: "Email", field: "email", filtering: false },
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

                isLoading={loadingAllParents}

                onAdd={async () => setShowAddingParent(true)}
                onDelete={async (parent: IParentAll) => deleteParent(parent.userId)}
                onRowClick={async (parent: IParentAll) => viewParent(parent.userId)}

                data={allParents.map(p => { return { ...p, registrationStageString: (p.registrationStage === PARENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : p.registrationStage === PARENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}
            />
        </div>
    );
}

export default AdminParentsPage;