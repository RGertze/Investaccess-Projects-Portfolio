import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { IGlobalContext } from '../interfaces/general_interfaces';
import StaffAccountPage from './staff-account-page/staffAccountPage';
import StaffCourseViewPage from './staff-course-page/staffCoursepage';
import StaffCoursesPage from './staff-courses-page/staffCoursesPage';
import StaffReportGroupView from './staff-report-group-view/staffReportGroupView';
import StaffReportGroupsPage from './staff-report-groups-page/staffReportGroups';
import StaffStudentPage from './staff-student-page/staffStudentPage';
import StaffStudentsPage from './staff-students-page/staffStudentsPage';
// async component imports


interface IProps {
    context: IGlobalContext
}

const StaffBase = (props: IProps) => {

    return (
        <div className="full-size main-content">
            <Routes>
                <Route path="/*" element={<div></div>} />
                <Route path="/courses" element={<StaffCoursesPage context={props.context} />} />
                <Route path="/courses/:id" element={<StaffCourseViewPage context={props.context} />} />
                <Route path="/reports" element={<StaffReportGroupsPage context={props.context} />} />
                <Route path="/reports/:id" element={<StaffReportGroupView context={props.context} />} />
                <Route path="/students" element={<StaffStudentsPage context={props.context} />} />
                <Route path="/students/:id" element={<StaffStudentPage context={props.context} />} />
                <Route path="/account" element={<StaffAccountPage context={props.context} />} />
            </Routes>
        </div>
    );
}

export default StaffBase;