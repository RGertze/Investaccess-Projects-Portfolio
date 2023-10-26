
import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { INonScaSibling } from "../../interfaces/student_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../alert-components/toasts";
import TableV2 from "../table-v2/tableV2";

interface IProps {
    studentNumber: string,
    context: IGlobalContext,
    editable?: boolean
}

const NonScaSiblingsComponent = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [siblings, setSiblings] = useState<INonScaSibling[]>([]);
    const [siblingToEdit, setSiblingToEdit] = useState<INonScaSibling>();


    // COMPONENT DID MOUNT
    useEffect(() => {
        getAll();
    }, []);

    //----   GET ALL   ----
    const getAll = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_NON_SCA_SIBLINGS_FOR_STUDENT.toString();
        qry = qry.replace("{studentNumber}", props.studentNumber);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setSiblings(result.data);
    }

    //----   ADD   ----
    const add = async (data: any): Promise<boolean> => {
        if (data.name === "") {
            errorToast("Enter a name");
            return false;
        }
        if (data.age === 0) {
            errorToast("Enter an age");
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_NON_SCA_SIBLING, {
            studentNumber: props.studentNumber,
            name: data.name,
            age: data.age
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Sibling Added!", true, 2000);
        setAdding(false);
        getAll();
        return true;
    }

    //----   EDIT   ----
    const edit = async (data: any): Promise<boolean> => {
        if (data.name === "") {
            errorToast("Enter a name");
            return false;
        }
        if (data.age === 0) {
            errorToast("Enter an age");
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_NON_SCA_SIBLING, {
            id: siblingToEdit?.id,
            name: data.name,
            age: data.age
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Sibling updated!", true, 2000);
        setSiblingToEdit(undefined);
        getAll();
        return true;
    }

    //----   DELETE   ----
    const deleteSibling = async (id: number) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_NON_SCA_SIBLING.toString();
        qry = qry.replace("{id}", id.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Sibling deleted!", true, 2000);
        getAll();
        return true;
    }

    return (
        <div className="">
            <TableV2
                title="Non SCA Siblings"
                columns={[
                    { title: "Name", field: "name", filtering: false },
                    { title: "Age", field: "age", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onAdd={props.editable === undefined || props.editable === true ? async () => setAdding(true) : undefined}
                onEdit={props.editable === undefined || props.editable === true ? async (data: INonScaSibling) => setSiblingToEdit(data) : undefined}
                onDelete={props.editable === undefined || props.editable === true ? async (data: INonScaSibling) => deleteSibling(data.id) : undefined}

                data={siblings}
            />

            {
                adding &&
                <AddEditComponentV2
                    title='Add New Sibling'
                    cancel={() => setAdding(false)}
                    submit={add}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "age", name: "Age", type: INPUT_TYPE.NUMBER, value: 0 },
                    ]}
                />
            }
            {
                siblingToEdit &&
                <AddEditComponentV2
                    title='Edit sibling'
                    cancel={() => setAdding(false)}
                    submit={edit}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: siblingToEdit.name },
                        { key: "age", name: "Age", type: INPUT_TYPE.NUMBER, value: siblingToEdit.age },
                    ]}
                />
            }
        </div>
    );
}

export default NonScaSiblingsComponent;