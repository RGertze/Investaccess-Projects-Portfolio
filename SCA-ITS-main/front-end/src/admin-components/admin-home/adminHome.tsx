import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Connection, GET_ENDPOINT } from '../../connection';
import { IAdminDashboard } from '../../interfaces/admin-interfaces';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { errorToast } from '../../shared-components/alert-components/toasts';
import Loading from '../../shared-components/loading-component/loading';
import { AdminHomeItem, HOME_ITEM_TYPE } from '../admin-home-item/adminHomeItem';
import "./adminHome.css";

interface IProps {
    context: IGlobalContext
}

const AdminHome = (props: IProps) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState<IAdminDashboard>({
        coursesCount: 0,
        noFeesCount: 0,
        outstandingFeesCount: 0,
        parentRegistrationCount: 0,
        parentsCount: 0,
        proofOfDepositsCount: 0,
        staffCount: 0,
        studentCount: 0,
        studentRegistrationCount: 0,
        totalOutstandingFees: 0
    });

    useEffect(() => {
        getDashboardData();
    }, []);

    const getDashboardData = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_DASHBOARD, "");
        setLoading(false);
        if (result.errorMessage !== "") {
            errorToast(result.errorMessage, true, 2000);
            return;
        }
        console.log(result);
        setDashboardData(result.data);
    }

    return (
        <div className="full-size admin-home">
            {
                loading &&
                <div style={{ gridColumn: "1/3" }} className="p-5">
                    <Loading color='blue' />
                </div>
            }
            <div className='admin-home-col'>
                <div className='admin-home-section vert-flex space-evenly p-3 rounded' >
                    <h2 style={{ width: "100%" }}>Registration</h2>
                    <AdminHomeItem onClick={() => navigate("/admin/registration/requests")} width={props.context.isMobile ? 95 : 45} flexDirection={"column"} title={"Students"} value={`${dashboardData.studentRegistrationCount}`} type={HOME_ITEM_TYPE.STUDENTS} />
                    <AdminHomeItem onClick={() => navigate("/admin/registration/requests")} width={props.context.isMobile ? 95 : 45} flexDirection={"column"} title={"Parents"} value={`${dashboardData.parentRegistrationCount}`} type={HOME_ITEM_TYPE.PARENTS} />
                </div>

                <div className='admin-home-section vert-flex space-evenly p-3 rounded' >
                    <h2 style={{ width: "100%" }}>Finances</h2>
                    <AdminHomeItem onClick={() => navigate("/admin/finances/proof-of-deposits")} width={props.context.isMobile ? 95 : 40} flexDirection={"column"} title={"Proof of Deposits"} value={`${dashboardData.proofOfDepositsCount}`} type={HOME_ITEM_TYPE.PROOF_OF_DEPOSITS} />
                    <AdminHomeItem onClick={() => navigate("/admin/finances/balances")} width={props.context.isMobile ? 95 : 55} flexDirection={"column"} title={"Total Outstanding Fees"} value={`N$ ${dashboardData.totalOutstandingFees}`} type={HOME_ITEM_TYPE.TOTAL_OUTSTANDING_FEES} />
                    <AdminHomeItem onClick={() => navigate("/admin/finances/balances")} width={props.context.isMobile ? 95 : 40} flexDirection={"column"} title={"Parents with no Fees"} value={`${dashboardData.noFeesCount}`} type={HOME_ITEM_TYPE.NO_FEES} />
                    <AdminHomeItem onClick={() => navigate("/admin/finances/balances")} width={props.context.isMobile ? 95 : 55} flexDirection={"column"} title={"Parents with Outstanding Fees"} value={`${dashboardData.outstandingFeesCount}`} type={HOME_ITEM_TYPE.OUTSTANDING_PARENT_FEES} />
                </div>
            </div>

            <div className='admin-home-col'>

                <div className='admin-home-section vert-flex space-evenly p-3 rounded' >
                    <AdminHomeItem onClick={() => navigate("/admin/courses")} width={95} flexDirection={"row"} title={"Courses"} value={`${dashboardData.coursesCount}`} type={HOME_ITEM_TYPE.COURSES} />
                    <AdminHomeItem onClick={() => navigate("/admin/students")} width={95} flexDirection={"row"} title={"Students"} value={`${dashboardData.studentCount}`} type={HOME_ITEM_TYPE.STUDENTS} />
                    <AdminHomeItem onClick={() => navigate("/admin/parents")} width={95} flexDirection={"row"} title={"Parents"} value={`${dashboardData.parentsCount}`} type={HOME_ITEM_TYPE.PARENTS} />
                    <AdminHomeItem onClick={() => navigate("/admin/staff")} width={95} flexDirection={"row"} title={"Staff"} value={`${dashboardData.staffCount}`} type={HOME_ITEM_TYPE.STAFF} />
                </div>
            </div>
        </div>
    );
}

export default AdminHome;