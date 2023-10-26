
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IRequiredRegistrationDocument } from "../../interfaces/registration_interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";

interface IProps {
    context: IGlobalContext
}

const AdminRegistrationDocumentsPage = (props: IProps) => {

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('parents');

    const [loading, setLoading] = useState(false);

    const [parentRequiredDocs, setParentRequiredDocs] = useState<IRequiredRegistrationDocument[]>([]);
    const [studentRequiredDocs, setStudentRequiredDocs] = useState<IRequiredRegistrationDocument[]>([]);

    const [requiredDocTypeToAdd, setRequiredDocTypeToAdd] = useState(0);
    const [docToEdit, setDocToEdit] = useState<IRequiredRegistrationDocument>();

    useEffect(() => {
        getParentRequiredDocuments();
        getStudentRequiredDocuments();
    }, []);

    //--- GET PARENT REQUIRED DOCUMENTS ---
    const getParentRequiredDocuments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REQUIRED_REGISTRATION_DOCS_FOR_PARENTS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            console.log(result.errorMessage);
            return;
        }

        setParentRequiredDocs(result.data);
    }

    //--- GET STUDENT REQUIRED DOCUMENTS ---
    const getStudentRequiredDocuments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REQUIRED_REGISTRATION_DOCS_FOR_STUDENTS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            console.log(result.errorMessage);
            return;
        }

        setStudentRequiredDocs(result.data);
    }

    //----   ADD REQUIRED DOCUMENT   ----
    const addRequiredDocument = async (userTypeId: number, data: any): Promise<boolean> => {
        if (data.Name === "") {
            errorToast("Enter a name");
            return false;
        }
        if (data.Description === "") {
            errorToast("Enter a description");
            return false;
        }

        let dataToSend = {
            userTypeId: userTypeId,
            name: data.Name,
            description: data.Description,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_REQUIRED_REGISTRATION_DOC, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Required Document Added!", true, 2000);
        setRequiredDocTypeToAdd(0);
        getParentRequiredDocuments();
        getStudentRequiredDocuments();
        return true;
    }

    //----   EDIT REQUIRED DOCUMENT   ----
    const editRequiredDocument = async (id: number, data: any): Promise<boolean> => {
        if (data.Name === "") {
            errorToast("Enter a name");
            return false;
        }
        if (data.Description === "") {
            errorToast("Enter a description");
            return false;
        }

        let dataToSend = {
            id: id,
            name: data.Name,
            description: data.Description,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_REQUIRED_REGISTRATION_DOC, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Required Document Saved!", true, 2000);
        setDocToEdit(undefined);
        getParentRequiredDocuments();
        getStudentRequiredDocuments();
        return true;
    }

    //----   DELETE REQUIRED DOC   ----
    const deleteRequiredDoc = async (id: number): Promise<boolean> => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.ADMIN_DELETE_REQUIRED_REGISTRATION_DOC.toString();
        qry = qry.replace("{id}", id.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Successfully removed", true, 1500);
        getParentRequiredDocuments();
        getStudentRequiredDocuments();
        return true;
    }

    return (
        <div className="admin-reg-page-container">
            {
                requiredDocTypeToAdd !== 0 &&
                <AddEditComponent title="Add new required document" submit={async (data: any) => await addRequiredDocument(requiredDocTypeToAdd, data)} cancel={() => setRequiredDocTypeToAdd(0)} data={{ Name: "", Description: "" }} />
            }
            {
                docToEdit &&
                <AddEditComponent title="Edit required document" submit={async (data: any) => await editRequiredDocument(docToEdit.id, data)} cancel={() => setDocToEdit(undefined)} data={{ Name: docToEdit.name, Description: docToEdit.description }} />
            }
            <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "primary")}>
                <Tab eventKey={"parents"} title={"Parents"}>
                    {
                        <TableV2
                            title="Required registration documents for parents"
                            columns={[
                                { title: "ID", field: "id" },
                                { title: "Name", field: "name" },
                                { title: "Description", field: "description" },
                            ]}
                            filtering={false}

                            isLoading={loading}

                            onAdd={async () => setRequiredDocTypeToAdd(2)}
                            onEdit={async (data: IRequiredRegistrationDocument) => setDocToEdit(data)}
                            onDelete={async (data: any) => await deleteRequiredDoc(data.id)}

                            data={parentRequiredDocs}
                        />
                    }
                </Tab>
                <Tab eventKey={"students"} title={"Students"}>
                    {
                        <TableV2
                            title="Required registration documents for students"
                            columns={[
                                { title: "ID", field: "id" },
                                { title: "Name", field: "name" },
                                { title: "Description", field: "description" },
                            ]}
                            filtering={false}

                            isLoading={loading}

                            onAdd={async () => setRequiredDocTypeToAdd(4)}
                            onEdit={async (data: IRequiredRegistrationDocument) => setDocToEdit(data)}
                            onDelete={async (data: any) => await deleteRequiredDoc(data.id)}

                            data={studentRequiredDocs}
                        />
                    }
                </Tab>
            </Tabs>
        </div>
    );
}

export default AdminRegistrationDocumentsPage;