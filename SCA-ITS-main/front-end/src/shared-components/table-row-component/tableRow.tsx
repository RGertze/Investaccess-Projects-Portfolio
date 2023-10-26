import { DoNotDisturbOn, Pending, CheckCircleOutline, Visibility, Edit, DeleteForever } from "@mui/icons-material";
import { useState } from "react";
import { Form, Badge } from "react-bootstrap";
import { Download, X, Check2 } from "react-bootstrap-icons";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import Loading from "../loading-component/loading";
import { TABLE_DATA_TYPE, IColumnData, TABLE_STATUS } from "../table-component/tableComponent";
import UserPic from "../user-pic-component/userPic";

interface IProps {
    context: IGlobalContext,
    key: number,
    id: any,
    colValues: IColumnData[],

    onView?(id: any): void,
    onEdit?(id: any): void,
    onDelete?(id: any): Promise<void>,
    onDownload?(id: any): Promise<void>,

    onApprove?(id: any): Promise<void>,
    onReject?(id: any): Promise<void>
}

const TableRow = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    return (
        <tr key={props.key}>
            {
                loading &&
                <td colSpan={props.colValues.length}><Loading /></td>
            }
            {
                !loading &&
                props.colValues.map((col, j) => {
                    return (
                        <>
                            {   // ID VALUES

                                col.type === TABLE_DATA_TYPE.ID &&
                                <td width={props.context.isMobile ? "50px" : "100px"} key={j} align="center">{col.value}</td>
                            }
                            {   // STRING VALUES

                                col.type === TABLE_DATA_TYPE.STRING &&
                                <td width={"fit-content"} key={j} align="center">{col.value}</td>
                            }
                            {   // AVATAR VALUES

                                col.type === TABLE_DATA_TYPE.AVATAR &&
                                <td width={`${props.context.isMobile ? "50px" : "100px"}`}>
                                    <UserPic profilePicPath={col.value as string} />
                                </td>
                            }
                            {   // SWITCH VALUES

                                col.type === TABLE_DATA_TYPE.SWITCH &&
                                <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                                    <Form.Check type="switch" onChange={async (ev) => {
                                        if (col.callback) {
                                            setLoading(true);
                                            await col.callback(props.id, ev.target.checked);
                                            setLoading(false);
                                        }
                                    }} defaultChecked={col.value as boolean} />
                                </td>
                            }
                            {   // STATUS VALUES

                                col.type === TABLE_DATA_TYPE.STATUS &&
                                <td width={`${props.context.isMobile ? "30px" : "70px"}`} >
                                    {
                                        col.value === TABLE_STATUS.BAD &&
                                        <DoNotDisturbOn className="icon-sm hor-center" color="error" />
                                    }
                                    {
                                        col.value === TABLE_STATUS.WARNING &&
                                        <Pending className="icon-sm hor-center" color="warning" />
                                    }
                                    {
                                        col.value === TABLE_STATUS.GOOD &&
                                        <CheckCircleOutline className="icon-sm hor-center" color="success" />
                                    }
                                </td>
                            }
                            {   // SUCCESS BADGE 

                                col.type === TABLE_DATA_TYPE.BADGE_SUCCESS &&
                                <td width={`${props.context.isMobile ? "50px" : "80px"}`}>
                                    <Badge className={col.callback ? "hover" : ""} onClick={async (ev) => {
                                        if (col.callback) {
                                            setLoading(true);
                                            await col.callback(props.id);
                                            setLoading(false);
                                        }
                                    }} bg="success">{col.value}</Badge>
                                </td>
                            }
                            {   // WARNING BADGE 

                                col.type === TABLE_DATA_TYPE.BADGE_WARNING &&
                                <td width={`${props.context.isMobile ? "50px" : "80px"}`}>
                                    <Badge className={col.callback ? "hover" : ""} onClick={async (ev) => {
                                        if (col.callback) {
                                            setLoading(true);
                                            await col.callback(props.id);
                                            setLoading(false);
                                        }
                                    }} bg="warning">{col.value}</Badge>
                                </td>
                            }
                            {   // DANGER BADGE 

                                col.type === TABLE_DATA_TYPE.BADGE_DANGER &&
                                <td width={`${props.context.isMobile ? "50px" : "80px"}`}>
                                    <Badge className={col.callback ? "hover" : ""} onClick={async (ev) => {
                                        if (col.callback) {
                                            setLoading(true);
                                            await col.callback(props.id);
                                            setLoading(false);
                                        }
                                    }} bg="danger">{col.value}</Badge>
                                </td>
                            }
                        </>
                    );
                })
            }


            {
                !loading &&
                <>
                    {
                        props.onView &&
                        <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Visibility onClick={() => { if (props.onView) props.onView(props.id) }} className="icon-m hover file-link" />
                        </td>
                    }
                    {
                        props.onDownload &&
                        <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Download onClick={() => {
                                props.onDownload &&
                                    props.onDownload(props.id)
                            }} className="hover file-link icon-sm" />
                        </td>
                    }
                    {
                        props.onEdit &&
                        <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Edit onClick={() => { if (props.onEdit) props.onEdit(props.id) }} className="icon-m hover unseen" />
                        </td>
                    }
                    {
                        props.onDelete &&
                        <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <DeleteForever onClick={async () => {
                                if (props.onDelete) {
                                    setLoading(true);
                                    await props.onDelete(props.id);
                                    setLoading(false);
                                }
                            }} className="icon-m hover btn-reject" />
                        </td>
                    }
                    {
                        props.onReject &&
                        <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <X onClick={async () => {
                                if (props.onReject) {
                                    setLoading(true);
                                    await props.onReject(props.id);
                                    setLoading(false);
                                }
                            }} className="icon-m hor-center hover btn-reject" />
                        </td>
                    }
                    {
                        props.onApprove &&
                        <td width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Check2 onClick={async () => {
                                if (props.onApprove) {
                                    setLoading(true);
                                    await props.onApprove(props.id);
                                    setLoading(false);
                                }
                            }} className="icon-m hor-center hover btn-approve" />
                        </td>
                    }
                </>
            }
        </tr>
    );
}

export default TableRow
