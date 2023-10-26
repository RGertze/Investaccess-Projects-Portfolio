import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseCategory, ICourseType } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IPrePrimaryProgressReport } from "../../interfaces/progress_report_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminPrePrimaryProgressReports.css";

interface IProps {
    context: IGlobalContext
}

const AdminPrePrimaryProgressReports = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [progressReports, setProgressReports] = useState<IPrePrimaryProgressReport[]>([]);
    const [progressReportToEdit, setProgressReportToEdit] = useState<IPrePrimaryProgressReport>();

    const [showAdding, setShowAdding] = useState(false);

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAll();
    }, []);


    //----   GET ALL   ----
    const getAll = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PRE_PRIMARY_PROGRESS_REPORTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProgressReports(result.data);
    }


    //----   ADD NEW   ----
    const addNew = async (data: any): Promise<boolean> => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_PRE_PRIMARY_PROGRESS_REPORT, {
            year: data.year,
            terms: data.terms
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Added!", true, 2000);
        setShowAdding(false);
        getAll();
        return true;
    }

    //----   EDIT   ----
    const edit = async (data: any): Promise<boolean> => {
        if (progressReportToEdit !== undefined) {
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_EDIT_PRE_PRIMARY_PROGRESS_REPORT, {
                id: progressReportToEdit.id,
                year: data.year,
                terms: data.terms
            }, {});
            if (result.errorMessage && result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                return false;
            }

            successToast("saved!", true, 2000);
            setProgressReportToEdit(undefined);
            getAll();
        }
        return true;
    }

    //----   DELETE   ----
    const deleteOne = async (id: string) => {
        let qry = DELETE_ENDPOINT.ADMIN_DELETE_PRE_PRIMARY_PROGRESS_REPORT.toString();
        qry = qry.replace("{id}", id.toString());
        setLoading(true);
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Successfully removed", true, 1500);
        getAll();
        return true;
    }

    //---   VIEW   --- 
    const viewCourse = (id: string) => {
        navigate(`/admin/progress-reports/pre-primary/${id}`, { state: id });
    }

    return (
        <div className="admin-parents-page-container">
            {
                showAdding &&
                <AddEditComponentV2
                    title='Add New'
                    cancel={() => setShowAdding(false)}
                    submit={addNew}
                    fields={[
                        { key: "year", name: "Year", type: INPUT_TYPE.NUMBER, value: 2023, required: true },
                        { key: "terms", name: "Terms", type: INPUT_TYPE.NUMBER, value: 4, required: true },
                    ]}
                />
            }

            {
                progressReportToEdit &&
                <AddEditComponentV2
                    title='Edit'
                    cancel={() => setProgressReportToEdit(undefined)}
                    submit={edit}
                    fields={[
                        { key: "year", name: "Year", type: INPUT_TYPE.NUMBER, value: progressReportToEdit.year, required: true },
                        { key: "terms", name: "Terms", type: INPUT_TYPE.NUMBER, value: progressReportToEdit.terms, required: true },
                    ]}
                />
            }

            <TableV2
                title="Pre-primary progress reports"
                columns={[
                    { title: "ID", field: "id", filtering: false },
                    { title: "Year", field: "year", filtering: false },
                    { title: "Terms", field: "terms", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onAdd={async () => setShowAdding(true)}
                onEdit={async (pg: IPrePrimaryProgressReport) => setProgressReportToEdit(pg)}
                onDelete={async (pg: IPrePrimaryProgressReport) => deleteOne(pg.id.toString())}
                onRowClick={async (pg: IPrePrimaryProgressReport) => viewCourse(pg.id.toString())}

                data={progressReports}
            />
        </div>
    );
}

export default AdminPrePrimaryProgressReports;