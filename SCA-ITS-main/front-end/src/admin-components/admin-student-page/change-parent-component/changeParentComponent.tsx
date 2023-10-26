import { Edit } from "@mui/icons-material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IParentAll } from "../../../interfaces/parent_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import EditableTable from "../../../shared-components/editable-component/editableComponent";
import Loading from "../../../shared-components/loading-component/loading";
import loading from "../../../shared-components/loading-component/loading";
import { PopupComponent } from "../../../shared-components/popup-component/popupComponent";
import TableV2 from "../../../shared-components/table-v2/tableV2";

interface IProps {
    context: IGlobalContext,
    student: IStudent
}

export const ChangeParentComponent = (props: IProps) => {
    const [parents, setParents] = useState<IParentAll[]>([]);
    const [parent, setParent] = useState<IParentAll>();

    const [changeParent, setChangingParent] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllParents();
    }, []);

    useEffect(() => {
        if (parents.length > 0) {
            let studentParent = parents.find(p => p.userId === props.student.parentId);
            setParent(studentParent);
        }
    }, [parents]);

    const getAllParents = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_PARENTS, "");
        setLoading(false);
        if (result.errorMessage !== "") {
            errorToast("Failed to retrieve all parents: " + result.errorMessage);
            return;
        }
        setParents(result.data);
    }

    //----   CHANGE PARENT   ----
    const editStudent = async (data: IParentAll): Promise<boolean> => {
        let dataToSend = {
            studentNumber: props.student.studentNumber,
            parentId: data.userId
        }
        setLoading(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, dataToSend, {});
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        setParent(data);
        setChangingParent(false);
        return true;
    }

    return (
        <div className="">
            {
                parent &&
                <EditableTable
                    title={`Parent`}
                    id={parent.userId}
                    data={
                        [
                            { key: "firstName", name: "Current Church: ", value: parent.firstName, type: INPUT_TYPE.TEXT, },
                            { key: "lastName", name: "Current ChurchAddress: ", value: parent.lastName, type: INPUT_TYPE.TEXT, },
                            { key: "email", name: "Pastor: ", value: parent.email, type: INPUT_TYPE.TEXT, },
                        ]
                    }
                    editable={false}
                    loading={loading}
                    onEdit={async (data) => { return true }}
                />
            }
            <Button variant="success" onClick={() => setChangingParent(true)}>Change Parent</Button>

            {
                changeParent &&
                <PopupComponent onHide={() => setChangingParent(false)} size="lg" component={
                    <div>
                        <p>Choose a parent from the list below to assign this student to.</p>
                        <TableV2
                            title="All Parents"
                            columns={[
                                { title: "First Name", field: "firstName", filtering: false },
                                { title: "Last Name", field: "lastName", filtering: false },
                                { title: "Email", field: "email", filtering: false },
                            ]}
                            filtering={true}

                            onRowClick={async (parent: IParentAll) => { editStudent(parent); }}
                            isLoading={false}

                            data={parents.filter(p => p.userId !== props.student.parentId)}
                        />

                        {
                            loading &&
                            <Loading />
                        }
                    </div>
                } />
            }
        </div>
    );
}