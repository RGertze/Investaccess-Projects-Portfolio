import MaterialTable, { Column, DetailPanel, MTableFilterRow, MTableToolbar } from "@material-table/core";
import { Add, Edit, Delete, Download, Check, Close, Replay } from "@mui/icons-material";
import { Button } from "@mui/material";
import { forwardRef } from "react";
import { GlobalContext } from "../../contexts/globalContext";
import { confirmChoice } from "../alert-components/toasts";


interface IAction {
    icon: any,
    tooltip: string,
    position: "auto" | "toolbar" | "toolbarOnSelect" | "row",
    isFreeAction: boolean,
    onClick(event, rowData): any
}

interface IProps {
    title: string,
    columns: Column<any>[],
    data: any[],
    filtering: boolean,

    isLoading: boolean,

    selection?: boolean,

    onAdd?(): Promise<void>,
    onEdit?(data: any): Promise<void>,
    onDelete?(data: any): Promise<boolean>,
    onDownload?(data: any): Promise<void>,
    onReload?(data: any): Promise<boolean>,

    onApprove?(data: any): Promise<void>,
    onReject?(data: any): Promise<void>,

    onRowClick?(data: any): Promise<void>,

    customActions?: IAction[],

    detailsPanels?: (DetailPanel<any> | ((rowData: any) => DetailPanel<any>))[]
}

function initActions(props: IProps) {
    const actions: any[] = [];
    props.onAdd && actions.push({
        icon: forwardRef<SVGSVGElement>((props, ref) => (
            <Button variant="outlined" color="success" startIcon={<Add />}>
                Add
            </Button>
        )),
        tooltip: 'Add New',
        isFreeAction: true,
        onClick: (event) => props.onAdd && props.onAdd()
    });
    props.onEdit && actions.push({
        icon: Edit,
        tooltip: 'Edit',
        position: "row",
        onClick: (event, rowData) => props.onEdit && props.onEdit(rowData)
    });
    props.onDelete && actions.push({
        icon: Delete,
        tooltip: 'Delete',
        position: "row",
        onClick: async (event, rowData) => {
            if (props.onDelete) {
                let confirmed = await confirmChoice("You're about to delete this item!", "This action cannot be undone");
                if (confirmed.isConfirmed)
                    props.onDelete(rowData)
            }
        }
    });
    props.onDownload && actions.push({
        icon: Download,
        tooltip: 'Download',
        position: "row",
        onClick: (event, rowData) => props.onDownload && props.onDownload(rowData)
    });
    props.onReload && actions.push({
        icon: Replay,
        tooltip: 'reload',
        position: "row",
        onClick: (event, rowData) => props.onReload && props.onReload(rowData)
    });
    props.onReject && actions.push({
        icon: Close,
        tooltip: 'Reject',
        position: "row",
        onClick: (event, rowData) => props.onReject && props.onReject(rowData)
    });
    props.onApprove && actions.push({
        icon: Check,
        tooltip: 'Approve',
        position: "row",
        onClick: (event, rowData) => props.onApprove && props.onApprove(rowData)
    });

    if (props.customActions)
        actions.push(...props.customActions);

    return actions;
}

const TableV2 = (props: IProps) => {

    const actions: any[] = initActions(props);

    return (
        <GlobalContext.Consumer>
            {
                context => (
                    <>
                        {
                            context.isMobile &&
                            <h2>{props.title}</h2>
                        }
                        <MaterialTable
                            title={context.isMobile ? "" : props.title}
                            columns={props.columns}
                            data={props.data}

                            isLoading={props.isLoading}

                            actions={actions}

                            onRowClick={
                                (props.onRowClick !== undefined) ? (event, data) => props.onRowClick && props.onRowClick(data) : undefined
                            }

                            options={{
                                selection: props.selection ? props.selection : false,
                                filtering: props.filtering,
                                headerStyle: { padding: "10px", fontSize: "17px", fontWeight: "bold", backgroundColor: "#6666ff", color: "white", height: "60px" },
                                columnResizable: true,
                            }}

                            components={{
                                Toolbar: props => (
                                    <div style={{ backgroundColor: "#eeeeee", fontWeight: "bolder" }}>
                                        <MTableToolbar {...props} />
                                    </div>
                                ),
                            }}

                            detailPanel={props.detailsPanels ?? undefined}
                        />
                    </>
                )
            }
        </GlobalContext.Consumer>
    )
}

export default TableV2;