import { useEffect, useState } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseCategory, ICourseStaff, ICourseType } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IStaff } from "../../interfaces/staff_interfaces";
import { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import EditableTable from "../../shared-components/editable-component/editableComponent";
import Loading from "../../shared-components/loading-component/loading";
import TableList from "../../shared-components/table-list-component/tableListComponent";
import AdminCourseProgressReportsComponent from "../admin-course-progress-reports-component/adminCourseProgressReportsComponent";
import AdminCourseStaffComponent from "../admin-course-staff-component/adminCourseStaffComponent";
import AdminCourseStudentsComponent from "../admin-course-students-component/adminCourseStudentsComponent";
import "./adminCoursePage.css";

interface IProps {
    context: IGlobalContext
}

const AdminCourseViewPage = (props: IProps) => {
    const params = useLocation();
    const courseId = (params.state as string);
    const [courseCategories, setCourseCategories] = useState<ICourseCategory[]>([]);
    const [courseCategoriesForInput, setCourseCategoriesForInput] = useState<{ id: number, name: string }[]>([]);
    const [courseTypes, setCourseTypes] = useState<ICourseType[]>([]);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('staff');

    const [loading, setLoading] = useState(false);

    const [course, setCourse] = useState<ICourse>({
        id: "",
        name: "",
        grade: 0,
        isPromotional: 0,

        typeId: 0,
        typeName: "",

        categoryId: 0,
        categoryName: ""
    });

    // COMPONENT DID MOUNT
    useEffect(() => {
        getCourseCategories();
        getCourseTypes();
        getCourseDetails();
    }, []);

    // ON TAB CHANGE
    useEffect(() => {
        if (tabKey === "staff") {

        }
        if (tabKey === "students") {

        }
    }, [tabKey]);

    // ON COURSE CATEGORIES CHANGE
    useEffect(() => {
        setupCategoryPathsWithParents();
    }, [courseTypes]);

    const setupCategoryPathsWithParents = async () => {

        // create map of categories
        let catMap = {};
        courseCategories.forEach(cat => {
            catMap[cat.id.toString()] = cat;
        });

        // create names
        let newCatsForInput: { id: number, name: string }[] = [];
        for (let i = 0; i < courseCategories.length; i++) {
            const cat = courseCategories[i];
            newCatsForInput.push({ id: cat.id, name: await buildCategoryPath(catMap, cat) });
        }

        // sort
        newCatsForInput.sort();

        console.log(newCatsForInput);
        setCourseCategoriesForInput(newCatsForInput);
    }

    /**
     * Recursively build the path for a category
     * @param categoryMap map of all categories with which to check for parents
     * @param currentCategory the category whose path needs to be built
     * @param currentPath the path that has been built so far
     * @returns a string containing the full path for a category
     */
    const buildCategoryPath = async (categoryMap: {}, currentCategory: ICourseCategory): Promise<string> => {
        if (currentCategory.parentCategoryId === 0)
            return currentCategory.name;

        let parentCat: ICourseCategory = categoryMap[currentCategory.parentCategoryId.toString()];
        if (parentCat === undefined)
            return "";

        let newPath = `${await buildCategoryPath(categoryMap, parentCat)} / ${currentCategory.name}`;
        return newPath;
    }

    //----   GET ALL COURSE CATEGORIES   ----
    const getCourseCategories = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_COURSE_CATEGORIES, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseCategories(result.data);
    }

    //----   GET ALL COURSE TYPES   ----
    const getCourseTypes = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_COURSE_TYPES, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseTypes(result.data);
    }

    //----   GET COURSE DETAILS   ----
    const getCourseDetails = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_COURSE + courseId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourse(result.data);
    }

    //----   EDIT COURSE   ----
    const editCourse = async (data: any): Promise<boolean> => {
        let dataToSend = {
            courseId: courseId,
            categoryId: data.categoryId,
            name: data.name,
            grade: data.grade,
            typeId: course.typeId,
            isPromotional: data.isPromotional ? 1 : 0
        }
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_EDIT_COURSE, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Course updated", true, 1500);
        getCourseDetails();
        return true;
    }

    return (
        <div className="admin-parent-page-container">

            {
                // USER DETAILS

                <EditableTable
                    title={`Course view`}
                    id={course.id}
                    data={
                        [
                            { key: "_", name: "Course Id: ", value: course.id, type: INPUT_TYPE.TEXT, disabled: true },
                            { key: "name", name: "Name: ", value: course.name, type: INPUT_TYPE.TEXT },
                            { key: "grade", name: "Grade: ", value: course.grade, type: INPUT_TYPE.NUMBER },
                            {
                                key: "categoryId", name: "Category: ", value: course.categoryId, type: INPUT_TYPE.SELECT,
                                selectValues: courseCategoriesForInput.map(c => { return { name: c.name, value: c.id } })
                            },
                            {
                                key: "typeId", name: "Type: ", value: course.typeId, type: INPUT_TYPE.SELECT,
                                selectValues: courseTypes.map(ct => { return { name: ct.name, value: ct.id } })
                            },
                            { key: "isPromotional", name: "Is Promotional: ", type: INPUT_TYPE.CHECK, value: course.isPromotional === 1, required: false },
                        ]
                    }
                    loading={loading}
                    onEdit={editCourse}
                />

            }

            {
                // TABS
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "staff")}>
                    <Tab className="staff-tab" eventKey="staff" title="Staff">
                        <AdminCourseStaffComponent context={props.context} courseId={courseId} />
                    </Tab>
                    <Tab className="students-tab" eventKey="students" title="Students">
                        <AdminCourseStudentsComponent context={props.context} courseId={courseId} grade={course.grade} />
                    </Tab>
                    <Tab className="progress-reports-tab" eventKey="progress-reports" title="Progress Reports">
                        <AdminCourseProgressReportsComponent context={props.context} courseId={courseId} />
                    </Tab>
                </Tabs>
            }
        </div>
    );
}

export default AdminCourseViewPage;