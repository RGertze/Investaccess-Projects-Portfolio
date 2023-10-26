import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IDoctorSpecialty } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import "./specialtiesPage.css"


interface IProps {
    context: IGlobalContext
}

const SpecialtiesPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState<IDoctorSpecialty[]>([]);

    const [specialtyToAddEdit, setSpecialtyToAddEdit] = useState<IDoctorSpecialty>();

    //----   COMPONENT DID MOUND   ----
    useEffect(() => {
        getAllSpecialties();
    }, []);


    //----   GET ALL SPECIALTIES   ----
    const getAllSpecialties = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_SPECIALTY_TYPES, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setSpecialties(result.data);
    }

    //----   SUBMIT   ----
    const submit = async (data: any): Promise<boolean> => {
        if (!specialtyToAddEdit) return false;

        if (specialtyToAddEdit?.specialtyId === 0) return addSpecialty(data.Name);

        return editSpecialty(data.Name);
    }


    //----   ADD SPECIALTY   ----
    const addSpecialty = async (data: string): Promise<boolean> => {

        if (data === "") {
            errorToast("Enter a name");
            return false;
        }

        let dataToSend = {
            name: data
        }

        const result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_DOCTOR_SPECIALTY, dataToSend, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return false;
        }

        setSpecialtyToAddEdit(undefined);

        successToast("success", true);
        getAllSpecialties();
        return true;
    }

    //----   EDIT SPECIALTY   ----
    const editSpecialty = async (data: string): Promise<boolean> => {
        setLoading(true);

        if (data === "") {
            errorToast("Enter a name");
            return false;
        }

        let dataToSend = {
            id: specialtyToAddEdit?.specialtyId,
            name: data
        }

        const result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_DOCTOR_SPECIALTY, dataToSend, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return false;
        }

        setSpecialtyToAddEdit(undefined);

        successToast("success", true);
        getAllSpecialties();
        return true;
    }

    //----   ON EDIT   ----
    const onEdit = (data: IDoctorSpecialty) => {
        setSpecialtyToAddEdit(data);
    }

    //----   ON DELETE   ----
    const onDelete = async (data: IDoctorSpecialty) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_DOCTOR_SPECIALTY + data.specialtyId);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        getAllSpecialties();
    }

    return (
        <>
            <div className="full-size">
                <TableComponent
                    title="Specialties"
                    context={props.context}

                    ids={[...specialties]}
                    headerValues={["Nr", "Name"]}
                    data={
                        specialties.map((specialty, index) => {
                            return {
                                colValues: [
                                    { type: TABLE_DATA_TYPE.ID, value: specialty.specialtyId },
                                    { type: TABLE_DATA_TYPE.STRING, value: specialty.specialtyName },
                                ]
                            }
                        })
                    }

                    onAdd={() => setSpecialtyToAddEdit({ specialtyId: 0, specialtyName: "" })}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />

                {
                    loading &&
                    <Loading color="blue" />
                }

                {
                    specialtyToAddEdit &&
                    <AddEditComponent
                        title={(specialtyToAddEdit.specialtyId !== 0) ? "Editing specialty" : "Add new specialty"}
                        data={{
                            Name: specialtyToAddEdit.specialtyName
                        }}
                        submit={submit}
                        cancel={() => setSpecialtyToAddEdit(undefined)}
                    />
                }

            </div>


        </>
    );
}

export default SpecialtiesPage;