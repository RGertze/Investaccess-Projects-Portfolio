
import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IOtherParent } from "../../interfaces/parent_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../alert-components/toasts";
import TableV2 from "../table-v2/tableV2";

interface IProps {
    parentId: number,
    studentNumber: string,
    context: IGlobalContext,
    editable?: boolean
}

const StudentOtherParentsComponent = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [allParents, setAllParents] = useState<IOtherParent[]>([]);
    const [parents, setParents] = useState<IOtherParent[]>([]);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllOtherParents();
        getAllOtherParentsForStudent();
    }, []);

    useEffect(() => {
        // remove parents assigned to student from all parents array
        let newAllParents = allParents.slice();
        newAllParents = newAllParents.filter(elem => parents.find(p => p.id === elem.id) === undefined);
        setAllParents(newAllParents);
    }, [parents]);

    //----   GET ALL OTHER PARENTS   ----
    const getAllOtherParents = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_OTHER_PARENTS_FOR_PARENT.toString();
        qry = qry.replace("{id}", props.parentId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setAllParents(result.data);
    }

    //----   GET ALL OTHER PARENTS FOR STUDENT   ----
    const getAllOtherParentsForStudent = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_STUDENT_OTHER_PARENTS.toString();
        qry = qry.replace("{studentNumber}", props.studentNumber);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setParents(result.data);
    }

    //----   ADD   ----
    const add = async (data: any): Promise<boolean> => {
        if (data.parentId === 0) {
            errorToast("Choose a parent!");
            return false;
        }

        data["studentNumber"] = props.studentNumber;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_STUDENT_OTHER_PARENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Parent/Guardian Added!", true, 2000);
        setAdding(false);
        getAllOtherParentsForStudent();
        return true;
    }

    //----   DELETE   ----
    const deleteParent = async (id: number) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_STUDENT_OTHER_PARENT.toString();
        qry = qry.replace("{studentNumber}", props.studentNumber);
        qry = qry.replace("{parentId}", id.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Parent/Guardian deleted!", true, 2000);
        getAllOtherParents();
        getAllOtherParentsForStudent();
        return true;
    }

    return (
        <div>
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

                onAdd={props.editable === undefined || props.editable === true ? async () => setAdding(true) : undefined}
                onDelete={props.editable === undefined || props.editable === true ? async (data: IOtherParent) => deleteParent(data.id) : undefined}

                data={parents}
            />

            {
                adding &&
                <AddEditComponentV2
                    title='Add Parent/Guardian'
                    cancel={() => setAdding(false)}
                    submit={add}
                    fields={[
                        {
                            key: "parentId", name: "Parent/Guardian: ", value: allParents.length > 0 ? allParents[0].id : 0, type: INPUT_TYPE.SELECT,
                            selectValues: allParents.length > 0 ? allParents.map(p => { return { name: `${p.firstName} ${p.lastName}`, value: p.id } }) : [{ name: "None Available!", value: 0 }]
                        },
                    ]}
                />
            }
        </div>
    );
}

export default StudentOtherParentsComponent;