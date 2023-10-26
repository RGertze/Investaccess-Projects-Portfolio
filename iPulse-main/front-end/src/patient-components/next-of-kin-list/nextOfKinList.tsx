import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IPatientNextOfKin } from "../../interfaces/patient_interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./nextOfKinList.css";

interface IAddNextOfKin {
    Full_Name: string,
    Cell_Phone: string,
    Email: string,
    Residential_Address: string,
    Relationship: string,
}

interface IProps {
    context: IGlobalContext
}

const NextOfKinList = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [nextOfKin, setNextOfKin] = useState<IPatientNextOfKin[]>([]);
    const [adding, setAdding] = useState(false);
    const [addNextOfKin, setAddNextOfKin] = useState<IAddNextOfKin>({
        Full_Name: "",
        Cell_Phone: "",
        Email: "",
        Residential_Address: "",
        Relationship: "",
    });
    const [nextOfKinToEdit, setNextOfKinToEdit] = useState<IPatientNextOfKin>();

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getNextOfKin();
    }, []);

    //----   ADD NEXT OF KIN   ----
    const getNextOfKin = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PATIENT_NEXT_OF_KIN + props.context.userId, "");
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        setNextOfKin(result.data);
    }

    //----   DELETE NEXT OF KIN   ----
    const deleteNextOfKin = async (id: number) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_PATEINT_NEXT_OF_KIN + id);
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        getNextOfKin();
    }

    //----   ADD NEXT OF KIN   ----
    const addNewNextOfKin = async (data: any): Promise<boolean> => {
        let newNextOfKin = data as IAddNextOfKin;

        if (!validateNewNextOfKin(newNextOfKin)) {
            return false;
        }

        let dataToSend = {
            patientId: props.context.userId,
            fullName: newNextOfKin.Full_Name,
            cellPhone: newNextOfKin.Cell_Phone,
            email: newNextOfKin.Email,
            residentialAddress: newNextOfKin.Residential_Address,
            relationship: newNextOfKin.Relationship
        }

        console.log(dataToSend);

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_PATIENT_NEXT_OF_KIN, dataToSend, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Added next of kin", true, 1500);
        setAdding(false);
        setAddNextOfKin({
            Full_Name: "",
            Cell_Phone: "",
            Email: "",
            Residential_Address: "",
            Relationship: "",
        });
        getNextOfKin();
        return true;
    }

    //----   VALIDATE NEW NEXT OF KIN   ----
    const validateNewNextOfKin = (data: IAddNextOfKin): boolean => {
        if (!data.Full_Name || data.Full_Name === "") {
            errorToast("Enter full name");
            return false;
        }
        if (!data.Cell_Phone || data.Cell_Phone === "") {
            errorToast("Enter cell number");
            return false;
        }
        if (!data.Email || data.Email === "") {
            errorToast("Enter email");
            return false;
        }
        if (!data.Residential_Address || data.Residential_Address === "") {
            errorToast("Enter address");
            return false;
        }
        if (!data.Relationship || data.Relationship === "") {
            errorToast("Enter relationship");
            return false;
        }

        return true;
    }

    //----   EDIT NEXT OF KIN   ----
    const editNewNextOfKin = async (id: number, data: any): Promise<boolean> => {
        let newNextOfKin = data as IAddNextOfKin;

        if (!validateNewNextOfKin(newNextOfKin)) {
            return false;
        }

        let dataToSend = {
            id: id,
            fullName: newNextOfKin.Full_Name,
            cellPhone: newNextOfKin.Cell_Phone,
            email: newNextOfKin.Email,
            residentialAddress: newNextOfKin.Residential_Address,
            relationship: newNextOfKin.Relationship
        }

        console.log(dataToSend);

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PATIENT_NEXT_OF_KIN, dataToSend, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Edited next of kin", true, 1500);
        setNextOfKinToEdit(undefined);
        getNextOfKin();
        return true;
    }

    return (
        <div className="next-of-kin-list">
            <div className="w-50 hor-center next-of-kin-add-btn">
                <Button onClick={() => setAdding(true)} variant="success">Add New</Button>
            </div>

            {
                adding &&
                <AddEditComponent cancel={() => setAdding(false)} data={addNextOfKin} submit={addNewNextOfKin} title={"Add Next of kin"} />
            }

            <Table responsive striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Cell</th>
                        <th>Address</th>
                        <th>Relationship</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading &&
                        <tr>
                            <td colSpan={7}>
                                <Loading />
                            </td>
                        </tr>
                    }

                    {
                        !loading &&
                        nextOfKin.map((kin, index) => {
                            return (
                                <tr>
                                    <td>{kin.fullName}</td>
                                    <td>{kin.email}</td>
                                    <td>{kin.cellphone}</td>
                                    <td>{kin.residentialAddress}</td>
                                    <td>{kin.relationship}</td>
                                    <td>
                                        <Pencil onClick={() => setNextOfKinToEdit(kin)} className="icon-sm hover hor-center" />
                                    </td>
                                    <td>
                                        <Trash onClick={() => deleteNextOfKin(kin.patientNextOfKinId)} className="icon-sm hover btn-reject hor-center" />
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>

            {
                nextOfKinToEdit &&
                <AddEditComponent
                    title={`Editing ${nextOfKinToEdit.fullName}`}
                    data={{
                        Full_Name: nextOfKinToEdit.fullName,
                        Cell_Phone: nextOfKinToEdit.cellphone,
                        Email: nextOfKinToEdit.email,
                        Residential_Address: nextOfKinToEdit.residentialAddress,
                        Relationship: nextOfKinToEdit.relationship,
                    }}
                    cancel={() => setNextOfKinToEdit(undefined)}
                    submit={async (data: any): Promise<boolean> => editNewNextOfKin(nextOfKinToEdit.patientNextOfKinId, data)}
                />
            }

        </div>
    );
}

export default NextOfKinList;