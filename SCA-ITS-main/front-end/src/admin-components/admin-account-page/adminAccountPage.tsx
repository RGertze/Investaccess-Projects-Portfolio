import { useEffect } from 'react';
import { Button, Tabs } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { IGlobalContext } from '../../interfaces/general_interfaces';
import UserAccountPage from '../../shared-components/user-account-page/userAccountPage';
import "./adminAccountPage.css";

// async component imports


interface IProps {
    context: IGlobalContext
}

const AdminAccountPage = (props: IProps) => {

    return (
        <div className="full-size">
            <UserAccountPage
                context={props.context}
                children={
                    <Tabs>
                    </Tabs>
                }
            />
        </div>
    );
}

export default AdminAccountPage;