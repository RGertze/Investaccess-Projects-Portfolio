import { Add, CheckCircleOutline, DeleteForever, DoNotDisturbOn, Edit, Padding, Pending, Visibility } from "@mui/icons-material";
import { Box, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Check2, X } from "react-bootstrap-icons";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import Loading from "../loading-component/loading";
import TableRowComponent from "../table-row-component/tableRowComponent";
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

export interface IData {
    colValues: IColumnData[]
}

interface IProps {
    title: string,
    context: IGlobalContext,

    titleCol?: string,
    titleBgCol?: string,

    ids: any[],
    headerValues: string[],
    data: IData[],

    filterComponent?: React.ReactNode,

    loading?: boolean,

    onAdd?(): void,
    onView?(id: any): void,
    onEdit?(id: any): void,
    onDelete?(id: any): Promise<void>,

    onApprove?(id: any): Promise<void>,
    onReject?(id: any): Promise<void>
}

const TableComponent = (props: IProps) => {

    return (

        <Box className="rounded table-component" sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>

                <Toolbar sx={{
                    alignItems: "center",
                    borderBottom: "1px solid #bbb",
                    // p: "20px"
                    marginBottom: "20px",

                    backgroundColor: props.titleBgCol ?? ""
                }}>
                    <Typography
                        sx={{
                            width: "100%",
                            textAlign: "start",
                            color: props.titleCol ?? "#666",
                        }}
                        variant="h4"
                        component="div"
                    >
                        {props.title}
                    </Typography>
                    {
                        props.onAdd &&
                        <Add onClick={() => { if (props.onAdd) props.onAdd() }} fontSize="large" className="hor-center hover btn-approve" />
                    }
                </Toolbar>

                <div className="vert-flex justify-end table-component-filter">
                    {
                        props.filterComponent &&
                        props.filterComponent
                    }
                </div>

                <TableContainer>
                    <Table size="small" >
                        <TableHead>
                            <TableRow>
                                {
                                    props.headerValues.map((val, index) => {
                                        return (
                                            <TableCell width={""} key={index} align="center">{val}</TableCell>
                                        );
                                    })
                                }
                                {
                                    props.onView &&
                                    <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}></TableCell>
                                }
                                {
                                    props.onEdit &&
                                    <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}></TableCell>
                                }
                                {
                                    props.onDelete &&
                                    <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}></TableCell>
                                }
                                {
                                    props.onReject &&
                                    <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}></TableCell>
                                }
                                {
                                    props.onApprove &&
                                    <TableCell width={`${props.context.isMobile ? "30px" : "70px"}`}></TableCell>
                                }
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                props.loading &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={props.headerValues.length} align="center">
                                        <Loading color="blue" />
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                (!props.loading && props.data.length === 0) &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={props.headerValues.length} align="center">
                                        <h5>Nothing to show</h5>
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                !props.loading &&
                                props.data.map((row, index) => {
                                    return (
                                        <TableRowComponent
                                            key={index}
                                            context={props.context}
                                            id={props.ids[index]}
                                            row={row}

                                            onApprove={props.onApprove}
                                            onDelete={props.onDelete}
                                            onEdit={props.onEdit}
                                            onReject={props.onReject}
                                            onView={props.onView}
                                        />
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default TableComponent;


