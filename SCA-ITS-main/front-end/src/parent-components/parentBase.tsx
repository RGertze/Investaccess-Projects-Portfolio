import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { IGlobalContext, UserType } from '../interfaces/general_interfaces';
import ParentAccountPage from './parent-account-page/parentAccountPage';
import ParentFinancesPage from './parent-finances-page/parentFinancesPage';
import { ParentRegistrationForm } from './parent-registration-form/parentRegistrationForm';
import ParentStudentViewPage from './parent-student-view-page/parentStudentViewPage';
import ParentStudentsPage from './parent-students-page/parentStudentsPage';

// async component imports


interface IProps {
    context: IGlobalContext
}

const ParentBase = (props: IProps) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (!props.context.userRegistrationComplete && props.context.userId !== 0 && props.context.userType === UserType.PARENT) {
            navigate("/parent/complete-registration");
        }
    }, [props.context.userRegistrationComplete, props.context.userId]);

    return (
        <div className="full-size main-content">
            <Routes>
                <Route path="/*" element={<div></div>} />
                <Route path="/complete-registration" element={<ParentRegistrationForm context={props.context} parentId={props.context.userId} />} />
                <Route path="/finances" element={<ParentFinancesPage context={props.context} />} />
                <Route path="/students/*" element={<ParentStudentsPage context={props.context} />} />
                <Route path="/students/:id" element={<ParentStudentViewPage context={props.context} />} />
                <Route path="/account" element={<ParentAccountPage context={props.context} />} />
            </Routes>
        </div>
    );
}

export default ParentBase;