import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces"
import { IProgressReportAssessment, IProgressReportCategory } from "../../interfaces/progress_report_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminProgReportAssessments.css";

interface IProps {
    context: IGlobalContext,
    categoryId: number
}

const AdminProgReportAssessments = (props: IProps) => {

    const [assessments, setAssessments] = useState<IProgressReportAssessment[]>([]);
    const [addingAssessment, setAddingAssessment] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState<IProgressReportAssessment>();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAssessments();
    }, []);

    //----   GET ASSESSMENTS   ----
    const getAssessments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_ASSESSMENTS_FOR_CATEGORY + props.categoryId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setAssessments(result.data);
    }

    //----   ADD ASSESSMENT   ----
    const addAssessment = async (data: any): Promise<boolean> => {
        if (data.name === "") {
            errorToast("Enter a name!");
            return false;
        }
        if (data.marksAvailable < 0) {
            errorToast("Available marks should be atleast 0");
            return false;
        }

        let newData = {
            categoryId: props.categoryId,
            name: data.name,
            marksAvailable: data.marksAvailable
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_PROGRESS_REPORT_ASSESSMENT, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Assessment Added!", true, 2000);
        setAddingAssessment(false);
        getAssessments();
        return true;
    }



    //----   DELETE ASSESSMENT    ----
    const deleteAssessment = async (id: number) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_PROGRESS_REPORT_ASSESSMENT + id);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        getAssessments();
        return true;
    }

    //----   EDIT ASSESSMENT   ----
    const editAssessment = async (data: any): Promise<boolean> => {
        if (data.Name === "") {
            errorToast("Enter a name!");
            return false;
        }
        if (data.Marks_Available < 0) {
            errorToast("Marks available should be greater than 0");
            return false;
        }

        let newData = {
            id: editingAssessment?.id,
            name: data.Name,
            marksAvailable: data.Marks_Available
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_UPDATE_PROGRESS_REPORT_ASSESSMENT, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Category updated!", true, 2000);

        setEditingAssessment(undefined);
        getAssessments();

        return true;
    }

    return (
        <div className="hor-center rounded report-assessment-container">
            <h2 className="p-2">Assessments</h2>
            <TableV2
                title=""
                columns={[
                    { title: "Name", field: "name", filtering: false },
                    { title: "Marks Available", field: "marksAvailable", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onAdd={async () => setAddingAssessment(true)}
                onDelete={async (data: IProgressReportAssessment) => deleteAssessment(data.id)}
                onEdit={async (data: IProgressReportAssessment) => setEditingAssessment(data)}

                data={assessments}
            />
            {
                editingAssessment &&
                <AddEditComponent title="Editing assessment" submit={editAssessment} cancel={() => setEditingAssessment(undefined)} data={{
                    Name: editingAssessment.name,
                    Marks_Available: editingAssessment.marksAvailable
                }} />
            }
            {
                addingAssessment &&
                <AddEditComponentV2
                    title='Add Assessment'
                    cancel={() => setAddingAssessment(false)}
                    submit={addAssessment}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "marksAvailable", name: "Marks Available", type: INPUT_TYPE.NUMBER, value: 0 },
                    ]}
                />
            }
        </div>
    );
}

export default AdminProgReportAssessments;