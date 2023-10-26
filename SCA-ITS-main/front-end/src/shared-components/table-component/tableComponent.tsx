import { CheckCircleOutline, DeleteForever, DoNotDisturbOn, Edit, Pending, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Badge, Form, Table } from "react-bootstrap";
import { Check2, Download, PlusCircle, X } from "react-bootstrap-icons";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import Loading from "../loading-component/loading";
import TableRow from "../table-row-component/tableRow";
import UserPic from "../user-pic-component/userPic";
import "./tableComponent.css";

export enum TABLE_STATUS {
    BAD = 0,
    WARNING = 1,
    GOOD = 2
}

export enum TABLE_DATA_TYPE {
    ID,
    STRING,
    SWITCH,
    AVATAR,
    STATUS,
    BADGE_SUCCESS,
    BADGE_WARNING,
    BADGE_DANGER,
}

export interface IColumnData {
    type: TABLE_DATA_TYPE,
    value: string | number | boolean,
    callback?: any,
    elem?: React.ReactNode
}

interface IData {
    colValues: IColumnData[]
}

interface IProps {
    title: string,
    context: IGlobalContext,

    titleCol?: string,
    titleBgCol?: string,

    width?: number,

    ids: any[],
    headerValues: string[],
    data: IData[],

    filterComponent?: React.ReactNode,

    loading?: boolean,

    onAdd?(): void,
    onView?(id: any): void,
    onEdit?(id: any): void,
    onDelete?(id: any): Promise<void>,
    onDownload?(id: any): Promise<void>,

    onApprove?(id: any): Promise<void>,
    onReject?(id: any): Promise<void>
}

const TableComponent = (props: IProps) => {

    const [colSpan, setColSpan] = useState(0);

    useEffect(() => {
        let initColSpan = props.headerValues.length;
        props.onView && initColSpan++;
        props.onEdit && initColSpan++;
        props.onDelete && initColSpan++;
        props.onDownload && initColSpan++;
        props.onReject && initColSpan++;
        props.onApprove && initColSpan++;
        setColSpan(initColSpan);
    }, []);

    return (

        <div className="rounded hor-center border table-component" style={{ width: props.width ? `${props.width}%` : "97%", overflow: "hidden" }}>

            <div className="vert-flex space-between" style={{
                borderBottom: "1px solid #bbb",
                padding: "10px",
                marginBottom: "20px",

                // backgroundColor: props.titleBgCol ?? "#82B7DC",
                backgroundColor: props.titleBgCol ?? "#1C4E80",
                color: props.titleCol ?? "white",

            }}>
                <h4 className="no-pad-marg">{props.title}</h4>
                {
                    props.onAdd &&
                    <PlusCircle onClick={() => { if (props.onAdd) props.onAdd() }} color="white" className="icon-sm hover" />
                }
            </div>

            <div className="vert-flex justify-end table-component-filter">
                {
                    props.filterComponent &&
                    props.filterComponent
                }
            </div>

            <Table striped bordered={true} size="small" >
                <thead>
                    <tr>
                        {
                            props.headerValues.map((val, index) => {
                                return (
                                    <th key={index} align="center">{val}</th>
                                );
                            })
                        }
                        {
                            props.onView &&
                            <td width={`${props.context.isMobile ? "30px" : "70px"}`}></td>
                        }
                        {
                            props.onEdit &&
                            <td width={`${props.context.isMobile ? "30px" : "70px"}`}></td>
                        }
                        {
                            props.onDelete &&
                            <td width={`${props.context.isMobile ? "30px" : "70px"}`}></td>
                        }
                        {
                            props.onDownload &&
                            <td width={`${props.context.isMobile ? "30px" : "70px"}`}></td>
                        }
                        {
                            props.onReject &&
                            <td width={`${props.context.isMobile ? "30px" : "70px"}`}></td>
                        }
                        {
                            props.onApprove &&
                            <td width={`${props.context.isMobile ? "30px" : "70px"}`}></td>
                        }
                    </tr>
                </thead>

                <tbody>
                    {
                        props.loading &&
                        <tr>
                            <td colSpan={props.headerValues.length} align="center">
                                <Loading color="blue" />
                            </td>
                        </tr>
                    }
                    {
                        (!props.loading && props.data.length === 0) &&
                        <tr>
                            <td colSpan={colSpan} align="center">
                                <h5>Nothing to show</h5>
                            </td>
                        </tr>
                    }
                    {
                        !props.loading &&
                        props.data.map((row, index) => {
                            return (
                                <TableRow context={props.context} id={props.ids[index]} key={index} colValues={row.colValues}
                                    onView={props.onView}
                                    onDownload={props.onDownload}
                                    onEdit={props.onEdit}
                                    onDelete={props.onDelete}
                                    onApprove={props.onApprove}
                                    onReject={props.onReject}
                                />
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default TableComponent;


