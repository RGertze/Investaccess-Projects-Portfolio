import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Download, EyeFill, Pencil, Trash } from 'react-bootstrap-icons';
import { IGlobalContext } from '../../interfaces/general_interfaces';
import Loading from '../loading-component/loading';
import "./tableListComponent.css";


interface IData {
    colValues: string[]
}

interface IProps {
    context: IGlobalContext,
    ids: any[],
    headerValues: string[],
    data: IData[],
    onclick(id: any): void,
    loading: boolean,

    noHover?: boolean,

    onView?(id: any): void,
    onDelete?(id: any): void,
    onEdit?(id: any): void,

    onDownload?(id: any): void
}

const TableList = (props: IProps) => {

    return (
        <div className="hor-center rounded shadow table-list-container">
            <Table striped>
                <thead>
                    <tr>
                        {
                            props.headerValues.map((val, index) => {
                                return (
                                    <th key={index}>{val}</th>
                                );
                            })
                        }
                        {
                            props.onView &&
                            <th></th>
                        }
                        {
                            props.onDownload &&
                            <th></th>
                        }
                        {
                            props.onEdit &&
                            <th></th>
                        }
                        {
                            props.onDelete &&
                            <th></th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        props.loading &&
                        <tr>
                            <td colSpan={props.headerValues.length}>
                                <Loading />
                            </td>
                        </tr>
                    }
                    {
                        !props.loading &&
                        props.data.map((row, i) => {
                            return (
                                <tr onClick={() => props.onclick(props.ids[i])} key={i} className={(props.noHover ? "" : "hover")}>
                                    {
                                        row.colValues.map((col, j) => {
                                            return (
                                                <td key={j}>{col}</td>
                                            );
                                        })
                                    }
                                    {
                                        props.onView &&
                                        <td>
                                            <EyeFill onClick={() => {
                                                props.onView &&
                                                    props.onView(props.ids[i])
                                            }} className="hover file-link icon-sm" />
                                        </td>
                                    }
                                    {
                                        props.onDownload &&
                                        <td>
                                            <Download onClick={() => {
                                                props.onDownload &&
                                                    props.onDownload(props.ids[i])
                                            }} className="hover file-link icon-sm" />
                                        </td>
                                    }
                                    {
                                        props.onEdit &&
                                        <td>
                                            <Pencil onClick={() => {
                                                props.onEdit &&
                                                    props.onEdit(props.ids[i])
                                            }} className="hover file-link icon-sm" />
                                        </td>
                                    }
                                    {
                                        props.onDelete &&
                                        <td>
                                            <Trash onClick={() => {
                                                props.onDelete &&
                                                    props.onDelete(props.ids[i])
                                            }} className="hover btn-reject icon-sm" />
                                        </td>
                                    }
                                </tr>
                            );
                        })
                    }
                    {
                        (!props.loading && props.data.length) === 0 &&
                        <tr>
                            <td colSpan={props.headerValues.length}>
                                <h6>Nothing found</h6>
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default TableList;