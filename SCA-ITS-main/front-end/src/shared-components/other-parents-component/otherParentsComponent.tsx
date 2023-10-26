
import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IOtherParent } from "../../interfaces/parent_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../alert-components/toasts";
import TableV2 from "../table-v2/tableV2";

interface IProps {
    parentId: number,
    context: IGlobalContext,
}

const OtherParentsComponent = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [parents, setParents] = useState<IOtherParent[]>([]);
    const [parentToEdit, setParentToEdit] = useState<IOtherParent>();


    // COMPONENT DID MOUNT
    useEffect(() => {
        getAll();
    }, []);

    //----   GET ALL   ----
    const getAll = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_OTHER_PARENTS_FOR_PARENT.toString();
        qry = qry.replace("{id}", props.parentId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setParents(result.data);
    }

    //----   ADD   ----
    const add = async (data: IOtherParent): Promise<boolean> => {
        data.mainParentId = props.parentId;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_OTHER_PARENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Parent/Guardian Added!", true, 2000);
        setAdding(false);
        getAll();
        return true;
    }

    //----   EDIT   ----
    const edit = async (data: IOtherParent): Promise<boolean> => {
        data.id = parentToEdit ? parentToEdit.id : 0;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_OTHER_PARENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Parent/Guardian Updated!", true, 2000);
        setParentToEdit(undefined);
        getAll();
        return true;
    }

    //----   DELETE   ----
    const deleteParent = async (id: number) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_OTHER_PARENT.toString();
        qry = qry.replace("{id}", id.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Parent/Guardian deleted!", true, 2000);
        getAll();
        return true;
    }

    return (
        <div className="">
            <TableV2
                title="Other Parents/Guardians"
                columns={[
                    { title: "First Name: ", field: "firstName", filtering: false },
                    { title: "Last Name: ", field: "lastName", filtering: false },
                    { title: "ID Number: ", field: "idNumber", filtering: false },
                    { title: "Employer: ", field: "employer", filtering: false },
                    { title: "Occupation: ", field: "occupation", filtering: false },
                    { title: "Annual Budget: ", field: "monthlyIncome", filtering: false },
                    { title: "Working Hours: ", field: "workingHours", filtering: false },
                    { title: "Specialist Skills/Hobbes: ", field: "specialistSkillsHobbies", filtering: false },
                    { title: "Telphone (Work): ", field: "telephoneWork", filtering: false },
                    { title: "Telphone (Home): ", field: "telephoneHome", filtering: false },
                    { title: "Fax: ", field: "fax", filtering: false },
                    { title: "Cell Number: ", field: "cellNumber", filtering: false },
                    { title: "Postal Address: ", field: "postalAddress", filtering: false },
                    { title: "Residential Address: ", field: "residentialAddress", filtering: false },
                    { title: "Marital Status: ", field: "maritalStatus", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onAdd={async () => setAdding(true)}
                onEdit={async (data: IOtherParent) => setParentToEdit(data)}
                onDelete={async (data: IOtherParent) => deleteParent(data.id)}

                data={parents}
            />

            {
                adding &&
                <AddEditComponentV2
                    title='Add Parent/Guardian'
                    cancel={() => setAdding(false)}
                    submit={add}
                    fields={[
                        { key: "firstName", name: "First Name: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "lastName", name: "Last Name: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "idNumber", name: "ID Number: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "employer", name: "Employer: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "occupation", name: "Occupation: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "monthlyIncome", name: "Annual Budget: ", value: 0, type: INPUT_TYPE.NUMBER },
                        { key: "workingHours", name: "Working Hours: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "specialistSkillsHobbies", name: "Specialist Skills/Hobbies: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "telephoneWork", name: "Telephone (Work): ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "telephoneHome", name: "Telephone (Home): ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "fax", name: "Fax: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "cellNumber", name: "Cell Number: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "postalAddress", name: "Postal Address: ", value: "", type: INPUT_TYPE.TEXT },
                        { key: "residentialAddress", name: "Residential Address: ", value: "", type: INPUT_TYPE.TEXT },
                        {
                            key: "maritalStatus", name: "Marital Status: ", value: "Single", type: INPUT_TYPE.SELECT,
                            selectValues: [
                                { name: "Married", value: "Married" },
                                { name: "Widowed", value: "Widowed" },
                                { name: "Separated", value: "Separated" },
                                { name: "Divorced", value: "Divorced" },
                                { name: "Single", value: "Single" },
                            ]
                        },
                    ]}
                />
            }
            {
                parentToEdit &&
                <AddEditComponentV2
                    title='Edit Parent/Guardian'
                    cancel={() => setParentToEdit(undefined)}
                    submit={edit}
                    fields={[
                        { key: "firstName", name: "First Name: ", value: parentToEdit.firstName, type: INPUT_TYPE.TEXT },
                        { key: "lastName", name: "Last Name: ", value: parentToEdit.lastName, type: INPUT_TYPE.TEXT },
                        { key: "idNumber", name: "ID Number: ", value: parentToEdit.idNumber, type: INPUT_TYPE.TEXT },
                        { key: "employer", name: "Employer: ", value: parentToEdit.employer, type: INPUT_TYPE.TEXT },
                        { key: "occupation", name: "Occupation: ", value: parentToEdit.occupation, type: INPUT_TYPE.TEXT },
                        { key: "monthlyIncome", name: "Annual Budget: ", value: parentToEdit.monthlyIncome, type: INPUT_TYPE.NUMBER },
                        { key: "workingHours", name: "Working Hours: ", value: parentToEdit.workingHours, type: INPUT_TYPE.TEXT },
                        { key: "specialistSkillsHobbies", name: "Specialist Skills/Hobbies: ", value: parentToEdit.specialistSkillsHobbies, type: INPUT_TYPE.TEXT },
                        { key: "telephoneWork", name: "Telephone (Work): ", value: parentToEdit.telephoneWork, type: INPUT_TYPE.TEXT },
                        { key: "telephoneHome", name: "Telephone (Home): ", value: parentToEdit.telephoneHome, type: INPUT_TYPE.TEXT },
                        { key: "fax", name: "Fax: ", value: parentToEdit.fax, type: INPUT_TYPE.TEXT },
                        { key: "cellNumber", name: "Cell Number: ", value: parentToEdit.cellNumber, type: INPUT_TYPE.TEXT },
                        { key: "postalAddress", name: "Postal Address: ", value: parentToEdit.postalAddress, type: INPUT_TYPE.TEXT },
                        { key: "residentialAddress", name: "Residential Address: ", value: parentToEdit.residentialAddress, type: INPUT_TYPE.TEXT },
                        {
                            key: "maritalStatus", name: "Marital Status: ", value: parentToEdit.maritalStatus, type: INPUT_TYPE.SELECT,
                            selectValues: [
                                { name: "Married", value: "Married" },
                                { name: "Widowed", value: "Widowed" },
                                { name: "Separated", value: "Separated" },
                                { name: "Divorced", value: "Divorced" },
                                { name: "Single", value: "Single" },
                            ]
                        },
                    ]}
                />
            }
        </div>
    );
}

export default OtherParentsComponent;