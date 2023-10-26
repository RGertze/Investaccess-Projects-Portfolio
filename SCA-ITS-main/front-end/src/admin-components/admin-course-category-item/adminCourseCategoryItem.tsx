import { Add, Delete, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { convert } from "html-to-text";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourseCategory } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { confirmChoice, errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./adminCourseCategoryItem.css";

const MySwal = withReactContent(Swal);

interface IProps {
    context: IGlobalContext,
    category: ICourseCategory,

    refresh(): Promise<any>
}

export const AdminCourseCategoryItem = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [categories, setCategories] = useState<ICourseCategory[]>([]);
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getCategories(props.category.id, "", "");
    }, []);

    //----   GET CATEGORIES   ----
    const getCategories = async (categoryId: number, name: string, desc: string) => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_COURSE_CATEGORIES.toString() + "?";
        if (categoryId >= 0)
            qry = qry + `parentCategoryId=${categoryId}&`;
        if (name !== "")
            qry = qry + `name=${name}&`;
        if (desc !== "")
            qry = qry + `description=${desc}`;

        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCategories(result.data);
    }

    //----   ADD NEW COURSE CATEGORY   ----
    const addNew = async (data: any): Promise<boolean> => {

        if (data.name === "") {
            errorToast("Enter a name");
            return false;
        }
        if (data.description === "") {
            errorToast("Enter a description");
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_COURSE_CATEGORY, {
            parentCategoryId: props.category.id,
            name: data.name,
            description: data.description
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Added!", true, 2000);
        setAdding(false);
        getCategories(props.category.id, "", "");
        setExpanded(true);
        return true;
    }

    //----   EDIT COURSE CATEGORY   ----
    const edit = async (data: any): Promise<boolean> => {

        if (data.name === "") {
            errorToast("Enter a name");
            return false;
        }
        if (data.description === "") {
            errorToast("Enter a description");
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_EDIT_COURSE_CATEGORY, {
            id: props.category.id,
            name: data.name,
            description: data.description
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Success!", true, 2000);
        setEditing(false);
        props.refresh();
        return true;
    }

    //----   DELETE TOP LEVEL COURSE CATEGORY   ----
    const deleteTopLevelCategory = async (data: ICourseCategory): Promise<boolean> => {

        let confirmation = await confirmChoice("Are you sure you want to delete this item?", "All content in this category will be deleted. This action cannot be undone!");
        if (!confirmation.isConfirmed) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(DELETE_ENDPOINT.ADMIN_DELETE_COURSE_CATEGORY, {
            moodleId: data.id,
            newParentId: 0,
            deleteRecursively: 1
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Deleted!", true, 2000);
        setAdding(false);
        props.refresh();
        return true;
    }

    //----   DELETE CHILD COURSE CATEGORY   ----
    const deleteChildCategory = async (data: ICourseCategory): Promise<boolean> => {

        let confirmation = await MySwal.fire({
            title: "Confirm",
            text: "Delete all content? Not deleting it will move it up to the parent category.",
            input: "checkbox",
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonText: "Confirm",
            cancelButtonText: "cancel",
            showConfirmButton: true,
            showCancelButton: true,
        });

        if (!confirmation.isConfirmed) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(DELETE_ENDPOINT.ADMIN_DELETE_COURSE_CATEGORY, {
            moodleId: data.id,
            newParentId: confirmation.value ? 0 : data.parentCategoryId,
            deleteRecursively: confirmation.value ? 1 : 0
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Deleted!", true, 2000);
        setAdding(false);
        props.refresh();
        return true;
    }

    return (
        <div className="course-category-item">
            <ListItem className="border rounded">
                <ListItemIcon style={{ minWidth: props.context.isMobile ? "0px" : "" }} className="course-category-item-icon">
                    <Add onClick={() => setAdding(true)} className="hover" />
                </ListItemIcon>
                <ListItemIcon style={{ minWidth: props.context.isMobile ? "0px" : "" }} className="course-category-item-icon">
                    <Delete onClick={() => {
                        if (props.category.parentCategoryId === 0)
                            deleteTopLevelCategory(props.category);
                        else
                            deleteChildCategory(props.category);
                    }} className="hover" />
                </ListItemIcon>
                <ListItemIcon style={{ minWidth: props.context.isMobile ? "0px" : "" }} className="course-category-item-icon">
                    <Edit onClick={() => setEditing(true)} className="hover" />
                </ListItemIcon>
                <ListItemText className="course-category-item-text" primary={props.category.name} secondary={convert(props.category.description)} secondaryTypographyProps={{ variant: 'caption', style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }} />
                <ListItemText className="course-category-item-text" primary={`Parent category:`} secondary={props.category.parentCategoryName} secondaryTypographyProps={{ variant: 'caption', style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }} />

                {
                    categories.length > 0 &&
                    <ListItemIcon onClick={() => setExpanded(!expanded)} style={{ minWidth: props.context.isMobile ? "0px" : "" }} className="course-category-item-icon">
                        {expanded ? <ExpandLess className="hover hor-center" /> : <ExpandMore className="hover hor-center" />}
                    </ListItemIcon>
                }
            </ListItem>
            <Collapse sx={{ paddingLeft: props.context.isMobile ? "20px" : "40px" }} in={expanded} unmountOnExit>
                <List >
                    {
                        !loading &&
                        categories.map((cat, index) => {
                            return (
                                <AdminCourseCategoryItem refresh={() => getCategories(props.category.id, "", "")} key={index} context={props.context} category={cat} />
                            );
                        })
                    }
                    {
                        loading &&
                        <Loading />
                    }
                </List>
            </Collapse>
            {
                adding &&
                <AddEditComponentV2
                    title={`Add New Sub Category For ${props.category.name}`}
                    cancel={() => setAdding(false)}
                    submit={addNew}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "description", name: "Description", type: INPUT_TYPE.TEXT, value: "" },
                    ]}
                />
            }
            {
                editing &&
                <AddEditComponentV2
                    title={`Editing ${props.category.name}`}
                    cancel={() => setEditing(false)}
                    submit={edit}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: props.category.name },
                        { key: "description", name: "Description", type: INPUT_TYPE.TEXT, value: convert(props.category.description) },
                    ]}
                />
            }
        </div>
    );
}