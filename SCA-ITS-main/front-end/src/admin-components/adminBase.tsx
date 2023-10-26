import { Route, Routes } from 'react-router-dom';
import { IGlobalContext } from '../interfaces/general_interfaces';
import AdminAccountPage from './admin-account-page/adminAccountPage';
import { AdminCourseCategoriesPage } from './admin-course-categories-page/adminCourseCategoriesPage';
import AdminCourseViewPage from './admin-course-page/adminCoursePage';
import AdminCoursesPage from './admin-courses-page/adminCoursesPage';
import AdminFeesForGradesPage from './admin-fees-for-grades-page/adminFeesForGradesPage';
import AdminHome from './admin-home/adminHome';
import { AdminParentBalances } from './admin-parent-balances-page/adminParentBalances';
import AdminParentPage from './admin-parent-page/adminParentPage';
import AdminParentsPage from './admin-parents-page/adminParentsPage';
import AdminPrePrimaryProgressReports from './admin-pre-primary-progress-reports/adminPrePrimaryProgressReports';
import StudentPrePrimaryProgressReportsList from './admin-pre-primary-progress-reports/student-pre-primary-progress-reports-list/studentPrePrimaryProgressReports';
import AdminPrimaryProgressReportPage from './admin-progress-report-page/adminProgressReportPage';
import AdminProofOfDepositComponent from './admin-proof-of-deposits-page/adminProofOfDepositsPage';
import AdminRegistrationDocumentsPage from './admin-registration-documents-page/adminRegistrationDocumentsPage';
import { AdminRegistrationPage } from './admin-registration-page/adminRegistrationPage';
import AdminReportGroupView from './admin-report-group-view/adminReportGroupView';
import AdminReportGroupsPage from './admin-report-groups-page/adminReportGroups';
import AdminStaffPage from './admin-staff-page/adminStaffPage';
import AdminStaffViewPage from './admin-staff-view-page/adminStaffViewPage';
import AdminStudentPage from './admin-student-page/adminStudentPage';
import AdminStudentsPage from './admin-students-page/adminStudentsPage';
import AdminTemplatesPage from './admin-templates-page/adminTemplatesPage';
import SiteAdministration from './site-administration/siteAdministration';

// async component imports


interface IProps {
    context: IGlobalContext
}

const AdminBase = (props: IProps) => {

    return (
        <div className="full-size main-content">

            <Routes>
                <Route path="/home" element={<AdminHome context={props.context} />} />

                <Route path="/parents" element={<AdminParentsPage context={props.context} />} />
                <Route path="/parents/:id" element={<AdminParentPage context={props.context} />} />

                <Route path="/registration/requests" element={<AdminRegistrationPage context={props.context} />} />
                <Route path="/registration/documents" element={<AdminRegistrationDocumentsPage context={props.context} />} />

                <Route path="/finances/proof-of-deposits" element={<AdminProofOfDepositComponent context={props.context} />} />
                <Route path="/finances/school-fees" element={<AdminFeesForGradesPage context={props.context} />} />
                <Route path="/finances/balances" element={<AdminParentBalances context={props.context} />} />

                <Route path="/students" element={<AdminStudentsPage context={props.context} />} />
                <Route path="/students/:id" element={<AdminStudentPage context={props.context} />} />

                <Route path="/staff" element={<AdminStaffPage context={props.context} />} />
                <Route path="/staff/:id" element={<AdminStaffViewPage context={props.context} />} />

                <Route path="/courses/categories" element={<AdminCourseCategoriesPage context={props.context} />} />
                <Route path="/courses" element={<AdminCoursesPage context={props.context} />} />
                <Route path="/courses/:id" element={<AdminCourseViewPage context={props.context} />} />

                <Route path="/progress-reports/primary" element={<AdminTemplatesPage context={props.context} />} />
                <Route path="/progress-reports/primary/:id" element={<AdminPrimaryProgressReportPage context={props.context} />} />
                <Route path="/progress-reports/pre-primary" element={<AdminPrePrimaryProgressReports context={props.context} />} />
                <Route path="/progress-reports/pre-primary/:id" element={<StudentPrePrimaryProgressReportsList context={props.context} />} />

                <Route path="/reports" element={<AdminReportGroupsPage context={props.context} />} />
                <Route path="/reports/:id" element={<AdminReportGroupView context={props.context} />} />

                <Route path="/site-administration" element={<SiteAdministration context={props.context} />} />

                <Route path="/account" element={<AdminAccountPage context={props.context} />} />
            </Routes>

        </div>
    );
}

export default AdminBase;