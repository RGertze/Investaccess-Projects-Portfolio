import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import FinancialStatementTable from "../../shared-components/financial-statement-table/financialStatementTable";
import ParentProofOfDepositComponent from "../parent-proof-of-deposit-component/proofOfDepositComponent";

interface IProps {
    context: IGlobalContext
}

const ParentFinancesPage = (props: IProps) => {
    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('statement');

    return (
        <div className="parent-financials-page">

            <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "registration")}>
                <Tab className="" eventKey="statement" title="Statement">
                    <FinancialStatementTable context={props.context} parentId={props.context.userId} />
                </Tab>
                <Tab className="" eventKey="deposits" title="Deposits">
                    <ParentProofOfDepositComponent context={props.context} parentId={props.context.userId} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default ParentFinancesPage;