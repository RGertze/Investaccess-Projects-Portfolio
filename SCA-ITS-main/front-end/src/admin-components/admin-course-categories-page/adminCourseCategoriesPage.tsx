import { Add } from "@mui/icons-material";
import { List } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourseCategory } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { confirmChoice, errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import { AdminCourseCategoryItem } from "../admin-course-category-item/adminCourseCategoryItem";

interface IProps {
    context: IGlobalContext,
}

export const AdminCourseCategoriesPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ICourseCategory[]>([]);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        getCategories(0, "", "");
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
            parentCategoryId: 0,
            name: data.name,
            description: data.description
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Added!", true, 2000);
        setAdding(false);
        getCategories(0, "", "");
        return true;
    }

    return (
        <div>
            <div className="vert-flex space-between">
                <h1>Course Categories</h1>
                <Add onClick={() => setAdding(true)} sx={{ width: "35px", height: "35px", color: "rgba(0, 0, 0, 0.54);" }} className="hover" />
            </div>
            <List className="rounded border">
                {
                    !loading &&
                    categories.map((cat, index) => {
                        return (
                            <AdminCourseCategoryItem refresh={() => getCategories(0, "", "")} key={index} context={props.context} category={cat} />
                        );
                    })
                }
                {
                    loading &&
                    <Loading />
                }
            </List>
            {
                adding &&
                <AddEditComponentV2
                    title='Add New Top Level Course Category'
                    cancel={() => setAdding(false)}
                    submit={addNew}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "description", name: "Description", type: INPUT_TYPE.TEXT, value: "" },
                    ]}
                />
            }
        </div>
    );
}