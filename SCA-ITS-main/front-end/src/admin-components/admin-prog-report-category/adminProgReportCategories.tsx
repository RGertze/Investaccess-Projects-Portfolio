import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { Pencil, Plus, Trash } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces"
import { IProgressReportAssessment, IProgressReportCategory } from "../../interfaces/progress_report_interfaces";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import TableV2 from "../../shared-components/table-v2/tableV2";
import AdminProgReportAssessments from "../admin-prog-report-assessment/adminProgReportAssessments";
import "./adminProgReportCategories.css";

interface INewCategory {
    Name: string,
    Weight: number
}

interface IProps {
    context: IGlobalContext,
    progressReportId: number
}

const AdminProgReportCategories = (props: IProps) => {


    const [editing, setEditing] = useState(false);
    const [newCategory, setNewCategory] = useState<INewCategory>({
        Name: "",
        Weight: 0
    });
    const [categories, setCategories] = useState<IProgressReportCategory[]>([]);
    const [addingCategory, setAddingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState<IProgressReportCategory>();
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getProgressReportCategories();
    }, []);

    //----   GET PROGRESS REPORT CATEGORIES   ----
    const getProgressReportCategories = async () => {
        setLoadingCategories(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PROGRESS_REPORT_CATEGORIES + props.progressReportId, "");
        setLoadingCategories(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCategories(result.data);
    }

    //----   ADD CATEGORY   ----
    const addNewCategory = async (data: any): Promise<boolean> => {
        let inputVals: INewCategory = data;
        if (!validateNewCategory(inputVals)) {
            return false;
        }

        let newData = {
            progressReportId: props.progressReportId,
            name: inputVals.Name,
            weight: inputVals.Weight,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_PROGRESS_REPORT_CATEGORY, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Category Added!", true, 2000);
        setNewCategory({
            Name: "",
            Weight: 0
        });
        setAddingCategory(false);
        getProgressReportCategories();
        return true;
    }

    //----   VALIDATE NEW CATEGORY   ----
    const validateNewCategory = (data: INewCategory): boolean => {
        if (data.Name === "") {
            errorToast(`Enter a name!`);
            return false;
        }
        if (data.Weight < 0 || data.Weight > 100) {
            errorToast(`Weight should be between 0 and 100!`, true);
            return false;
        }

        return true;
    }

    //----   EDIT CATEGORY   ----
    const editCategory = async (data: any): Promise<boolean> => {
        if (data.Name === "") {
            errorToast("Enter a name!");
            return false;
        }
        if (data.Weight < 0 || data.Weight > 100) {
            errorToast("Weight should be between 0 and 100");
            return false;
        }

        let newData = {
            id: data.id,
            name: data.Name,
            weight: data.Weight
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_UPDATE_PROGRESS_REPORT_CATEGORY, newData, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Category updated!", true, 2000);

        setEditingCategory(undefined);
        getProgressReportCategories();

        return true;
    }

    //----   DELETE CATEGORY    ----
    const deleteCategory = async (id: number) => {
        setLoading(true);
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_PROGRESS_REPORT_CATEGORY + id);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        getProgressReportCategories();
        return true;
    }


    return (
        <div>
            <h2 style={{ textAlign: "left" }} className="p-2">Categories</h2>
            <TableV2
                title=""
                columns={[
                    { title: "Name", field: "name", filtering: false },
                    { title: "Weight", field: "weight", filtering: false },
                ]}
                filtering={true}

                isLoading={loadingCategories}

                onAdd={async () => setAddingCategory(true)}
                onDelete={async (data: IProgressReportCategory) => deleteCategory(data.id)}
                onEdit={async (data: IProgressReportCategory) => setEditingCategory(data)}

                data={categories}

                detailsPanels={[
                    {
                        tooltip: "Show details",
                        render: (rowData: any) => {
                            return (
                                <AdminProgReportAssessments context={props.context} categoryId={rowData.rowData.id} />
                            );
                        }
                    }
                ]}
            />
            {
                addingCategory &&
                <AddEditComponent title="Add new category" submit={addNewCategory} cancel={() => setAddingCategory(false)} data={newCategory} />
            }
            {
                editingCategory &&
                <AddEditComponent title="Editing category" submit={editCategory} cancel={() => setEditingCategory(undefined)} data={{
                    Name: editingCategory.name,
                    Weight: editingCategory.weight
                }} />
            }
        </div>
    );
}

export default AdminProgReportCategories;