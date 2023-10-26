import { Add, Download } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BaseUrl, Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IFinancialStatement, STATEMENT_TYPE } from "../../interfaces/finances-interfaces";
import { IFile, IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../alert-components/toasts";
import { BankingDetails } from "../banking-details/bankingDetails";
import DownloadDocumentComponent from "../file-downloader-component/downloadDocComponent";
import Loading from "../loading-component/loading";
import StatementTableItem from "../statement-table-item/statementTableItem";
import "./financialStatementTable.css"

interface IProps {
    context: IGlobalContext,
    parentId: number
}

const FinancialStatementTable = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [statement, setStatement] = useState<IFinancialStatement>({ currentBalance: 0, items: [] });
    let currentBalance = 0;

    const [addingStatementItem, setAddingStatementItem] = useState(false);

    const [downloadData, setDownloadData] = useState<IFile>();

    useEffect(() => {
        currentBalance = 0;
        getStatement();
    }, []);

    //----   GET STATEMENT   ----
    const getStatement = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_PARENT_FINANCIAL_STATEMENT.toString();
        qry = qry.replace("{parentId}", props.parentId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStatement(result.data);
    }

    //----   GET STATEMENT PDF   ----
    const getStatementPdf = async () => {
        let qry = GET_ENDPOINT.GET_PARENT_FINANCIAL_STATEMENT_AS_PDF.toString();
        qry = qry.replace("{parentId}", props.parentId.toString());
        let downloadUrl = BaseUrl + qry;
        setDownloadData({ filePath: downloadUrl, fileName: "SCA-financial-statement" });
    }

    //----   ADD STATEMENT ITEM   ----
    const addStatementItem = async (data: any): Promise<boolean> => {
        if (!data.itemType || data.itemType === 0) {
            errorToast("Choose a type");
            return false;
        }
        if (!data.description || data.description === "") {
            errorToast("enter a description");
            return false;
        }


        let dataToSend = {
            parentId: props.parentId,
            creditAmount: data.creditAmount,
            debitAmount: data.debitAmount,
            description: data.description,
            itemType: data.itemType
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_STATEMENT_ITEM, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Item Added!", true, 2000);
        setAddingStatementItem(false);
        getStatement();
        return true;
    }

    return (
        <div className="hor-center border rounded financial-statement-table">

            <div className={`${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>
                <BankingDetails />
            </div>

            {
                addingStatementItem &&
                <AddEditComponentV2
                    title={"Add Statement Item"}
                    cancel={() => setAddingStatementItem(false)}
                    submit={addStatementItem}
                    fields={[
                        {
                            key: "itemType", name: "Type", type: INPUT_TYPE.SELECT, value: STATEMENT_TYPE.FEE,
                            selectValues: [
                                { name: "Fee", value: STATEMENT_TYPE.FEE },
                                { name: "Discount", value: STATEMENT_TYPE.DISCOUNT },
                                { name: "Refund", value: STATEMENT_TYPE.REFUND },
                                { name: "Registration", value: STATEMENT_TYPE.REGISTRATION },
                                { name: "Tuition", value: STATEMENT_TYPE.TUITION },
                            ]
                        },
                        {
                            key: "description", name: "Description", type: INPUT_TYPE.TEXT, value: "",
                        },
                        {
                            key: "debitAmount", name: "Debit Amount", type: INPUT_TYPE.NUMBER, value: 0.0, numberStep: 0.01
                        },
                        {
                            key: "creditAmount", name: "Credit Amount", type: INPUT_TYPE.NUMBER, value: 0.0, numberStep: 0.01
                        },
                    ]}
                />
            }

            <div className="vert-flex statement-export-button">
                <Button onClick={getStatementPdf} variant="success">Export as PDF <Download /></Button>
            </div>

            {
                downloadData &&
                <DownloadDocumentComponent context={props.context} fileName={downloadData.fileName} filePath={downloadData.filePath} hide={() => setDownloadData(undefined)} show={true} directDownload={true} extension={"pdf"} />
            }

            <div className="vert-flex space-between p-3">
                <h2 className="w50">Financial Statement:</h2>
                {
                    props.context.userType === UserType.ADMIN &&
                    <Add onClick={() => setAddingStatementItem(true)} fontSize="large" className="btn-approve hover" />
                }
            </div>
            <div className="overflow-w-100">
                <div className="statement-table-header">
                    <p>Date</p>
                    <span></span>
                    <p>Reference</p>
                    <span></span>
                    <p>Description</p>
                    <span></span>
                    <p>Debit</p>
                    <span></span>
                    <p>Credit</p>
                    <span></span>
                    <p>Balance</p>
                </div>

                {
                    !loading &&
                    statement.items.map((item, index) => {
                        if (item.creditAmount > 0)
                            currentBalance += item.creditAmount;
                        if (item.debitAmount > 0)
                            currentBalance -= item.debitAmount;

                        return (
                            <StatementTableItem key={index} currentBalance={currentBalance} context={props.context} item={item} />
                        );
                    })
                }
                <div className="statement-table-item">
                    <p style={{ gridColumn: "1/6", textAlign: "center" }}>{statement.currentBalance >= 0 ? "Amount owed to you =>" : "Amount owed to the school =>"}</p>
                    <span style={{ gridColumn: "6" }}></span>
                    <p style={{ gridColumn: "7/12", textAlign: "center" }}>
                        N$
                        {statement.currentBalance < 0 ? (-statement.currentBalance).toFixed(2) : ""}
                        {statement.currentBalance < 0 ? "" : statement.currentBalance.toFixed(2)}
                    </p>
                </div>
            </div>
            {
                loading &&
                <div style={{ width: "100%", height: "100%" }}>
                    <Loading />
                </div>
            }


        </div>
    );
}

export default FinancialStatementTable;