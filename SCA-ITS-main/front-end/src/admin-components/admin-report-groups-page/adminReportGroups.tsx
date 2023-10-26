import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IReportGroup } from "../../interfaces/report-interfaces";
import AddEditComponent, { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminReportGroups.css";



interface IProps {
    context: IGlobalContext
}

const AdminReportGroupsPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [reportGroups, setReportGroups] = useState<IReportGroup[]>([]);

    const [addingReportGroup, setAddingReportGroup] = useState(false);

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getReportGroups();
    }, []);


    //----   GET ALL REPORT GROUPS   ----
    const getReportGroups = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_REPORT_GROUPS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setReportGroups(result.data);
    }

    //----   ADD REPORT GROUP   ----
    const addReportGroup = async (data: any): Promise<boolean> => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_REPORT_GROUP, {
            year: data.Year,
            terms: data.Terms
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Report Group Added!", true, 2000);
        setAddingReportGroup(false);
        getReportGroups();
        return true;
    }

    //----   DELETE REPORT GROUP   ----
    const deleteReportGroup = async (id: IReportGroup): Promise<boolean> => {
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.ADMIN_DELETE_REPORT_GROUP + id.id);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Report Group Deleted!", true, 2000);
        getReportGroups();
        return true;
    }

    // VIEW REPORT GROUP
    const viewReportGroup = (id: IReportGroup) => {
        navigate(`/admin/reports/${id.id}`, { state: id });
    }

    return (
        <div className="admin-parents-page-container">
            {
                addingReportGroup &&
                <AddEditComponent title="Add report group" submit={addReportGroup} cancel={() => setAddingReportGroup(false)} data={{
                    Year: 2022,
                    Terms: 4
                }} />
            }

            <TableV2
                title="Report Groups"
                columns={[
                    { title: "Year", field: "year" },
                    { title: "Terms", field: "terms" },
                ]}
                filtering={false}

                isLoading={loading}

                onAdd={async () => setAddingReportGroup(true)}
                onDelete={async (data: IReportGroup) => deleteReportGroup(data)}
                onRowClick={async (data: IReportGroup) => viewReportGroup(data)}

                data={reportGroups}
            />
        </div>
    );
}

export default AdminReportGroupsPage;