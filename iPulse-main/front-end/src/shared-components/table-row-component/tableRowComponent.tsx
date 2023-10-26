import { DoNotDisturbOn, Pending, CheckCircleOutline, Visibility, Edit, DeleteForever } from "@mui/icons-material";
import { TableRow, TableCell, Switch } from "@mui/material";
import { useState } from "react";
import { Badge } from "react-bootstrap";
import { X, Check2 } from "react-bootstrap-icons";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import { confirmation } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import { IData, TABLE_DATA_TYPE, TABLE_STATUS } from "../table-component/tableComponent";
import UserPic from "../user-pic-component/userPic";

interface IProps {
    context: IGlobalContext,

    id: any,
    row: IData,

    onView?(id: any): void,
    onEdit?(id: any): void,
    onDelete?(id: any): Promise<void>,

    onApprove?(id: any): Promise<void>,
    onReject?(id: any): Promise<void>
}

const TableRowComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {
                loading &&
                <TableCell colSpan={props.row.colValues.length} align="center">
                    <Loading color="blue" />
                </TableCell>
            }
            {
                !loading &&
                <>
                    {
                        props.row.colValues.map((col, j) => {
                            return (
                                <>
                                    {   // ID VALUES

                                        col.type === TABLE_DATA_TYPE.ID &&
                                        <TableCell width={props.context.isMobile ? "50px" : "100px"} key={j} align="center">{col.value}</TableCell>
                                    }
                                    {   // STRING VALUES

                                        col.type === TABLE_DATA_TYPE.STRING &&
                                        <TableCell width={"fit-content"} key={j} align="center">{col.value}</TableCell>
                                    }
                                    {   // AVATAR VALUES

                                        col.type === TABLE_DATA_TYPE.AVATAR &&
                                        <TableCell width={`${props.context.isMobile ? "50px" : "100px"}`}>
                                            <UserPic profilePicPath={col.value as string} />
                                        </TableCell>
                                    }
                                    {   // SWITCH VALUES

                                        col.type === TABLE_DATA_TYPE.SWITCH &&
                                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}>
                                            <Switch onChange={async (ev) => {
                                                if (col.callback) {
                                                    setLoading(true);
                                                    col.callback(props.id, ev.target.checked);
                                                    setLoading(false);
                                                }
                                            }} checked={col.value as boolean} />
                                        </TableCell>
                                    }
                                    {   // STATUS VALUES

                                        col.type === TABLE_DATA_TYPE.STATUS &&
                                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`} >
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
                                        </TableCell>
                                    }
                                    {   // SUCCESS BADGE 

                                        col.type === TABLE_DATA_TYPE.BADGE_SUCCESS &&
                                        <TableCell width={`${props.context.isMobile ? "50px" : "80px"}`}>
                                            <Badge className={col.callback ? "hover" : ""} onClick={() => { if (col.callback) col.callback(props.id) }} bg="success">{col.value}</Badge>
                                        </TableCell>
                                    }
                                    {   // WARNING BADGE 

                                        col.type === TABLE_DATA_TYPE.BADGE_WARNING &&
                                        <TableCell width={`${props.context.isMobile ? "50px" : "80px"}`}>
                                            <Badge className={col.callback ? "hover" : ""} onClick={() => { if (col.callback) col.callback(props.id) }} bg="warning">{col.value}</Badge>
                                        </TableCell>
                                    }
                                    {   // DANGER BADGE 

                                        col.type === TABLE_DATA_TYPE.BADGE_DANGER &&
                                        <TableCell width={`${props.context.isMobile ? "50px" : "80px"}`}>
                                            <Badge className={col.callback ? "hover" : ""} onClick={() => { if (col.callback) col.callback(props.id) }} bg="danger">{col.value}</Badge>
                                        </TableCell>
                                    }
                                </>
                            );
                        })
                    }


                    {
                        props.onView &&
                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Visibility onClick={() => { if (props.onView) props.onView(props.id) }} className="icon-m hover seen" />
                        </TableCell>
                    }
                    {
                        props.onEdit &&
                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Edit onClick={() => { if (props.onEdit) props.onEdit(props.id) }} className="icon-m hover unseen" />
                        </TableCell>
                    }
                    {
                        props.onDelete &&
                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <DeleteForever onClick={async () => {
                                if (props.onDelete) {

                                    if (!await confirmation("Are you sure?"))
                                        return;

                                    setLoading(true);
                                    await props.onDelete(props.id);
                                    setLoading(false);
                                }
                            }} className="icon-m hover btn-reject" />
                        </TableCell>
                    }
                    {
                        props.onReject &&
                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <X onClick={() => {
                                if (props.onReject) {
                                    setLoading(true);
                                    props.onReject(props.id);
                                    setLoading(false);
                                }
                            }} className="icon-m hor-center hover btn-reject" />
                        </TableCell>
                    }
                    {
                        props.onApprove &&
                        <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}>
                            <Check2 onClick={() => {
                                if (props.onApprove) {
                                    setLoading(true);
                                    props.onApprove(props.id);
                                    setLoading(false);
                                }
                            }} className="icon-m hor-center hover btn-approve" />
                        </TableCell>
                    }
                </>
            }
        </TableRow>
    );
}

export default TableRowComponent;