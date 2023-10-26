import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import { UsersPage } from "./users-page/usersPage";
import "./siteAdministration.css";

interface IProps {
    context: IGlobalContext
}

const SiteAdministration = (props: IProps) => {

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('users');


    return (
        <div className="site-admin-container">
            <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "users")}>
                <Tab eventKey="users" title="Users">
                    <UsersPage context={props.context} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default SiteAdministration;