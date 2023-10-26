import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IReportGroup } from "../../interfaces/report-interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";


interface IProps {
    context: IGlobalContext
}

const StaffReportGroupsPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [reportGroups, setReportGroups] = useState<IReportGroup[]>([]);

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

    // VIEW REPORT GROUP
    const viewReportGroup = (id: IReportGroup) => {
        navigate(`/staff/reports/${id.id}`, { state: id });
    }

    return (
        <div className="staff-reports-page-container">
            {
                <TableV2
                    title="Report Groups"
                    columns={[
                        { title: "ID", field: "id" },
                        { title: "Year", field: "year" },
                        { title: "Terms", field: "terms" },
                    ]}
                    filtering={false}

                    isLoading={loading}

                    onRowClick={async (data: IReportGroup) => viewReportGroup(data)}

                    data={reportGroups}
                />
            }
        </div>
    );
}

export default StaffReportGroupsPage;