import { IStatementItem } from "../../interfaces/finances-interfaces";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import "./statementTableItem.css"

interface IProps {
    context: IGlobalContext,
    item: IStatementItem,
    currentBalance: number
}

const StatementTableItem = (props: IProps) => {
    return (
        <div className="hor-center statement-table-item">
            <p>{props.item.date}</p>
            <span></span>
            <p>{props.item.reference}</p>
            <span></span>
            <p>{props.item.description}</p>
            <span></span>
            <p>{props.item.debitAmount > 0 ? props.item.debitAmount.toFixed(2) : ""}</p>
            <span></span>
            <p>{props.item.creditAmount > 0 ? props.item.creditAmount.toFixed(2) : ""}</p>
            <span></span>
            <p>{props.currentBalance.toFixed(2)}</p>
        </div>
    );
}

export default StatementTableItem;