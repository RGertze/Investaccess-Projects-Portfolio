import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { ICourse, ICourseCategory, ICourseType } from "../../interfaces/course-interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { ISelect } from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminCoursesPage.css";


interface IProps {
    context: IGlobalContext
}

const AdminCoursesPage = (props: IProps) => {

    const [loadingAllCourses, setLoadingAllCourses] = useState(false);
    const [courses, setCourses] = useState<ICourse[]>([]);

    const [courseCategories, setCourseCategories] = useState<ICourseCategory[]>([]);
    const [courseCategoriesForInput, setCourseCategoriesForInput] = useState<{ id: number, name: string }[]>([]);
    const [courseTypes, setCourseTypes] = useState<ICourseType[]>([]);

    const [showAddingCourse, setShowAddingCourse] = useState(false);

    let navigate = useNavigate();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getCourseCategories();
        getCourseTypes();
        getCourses();
    }, []);

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

    //----   GET ALL COURSES   ----
    const getCourses = async () => {
        setLoadingAllCourses(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_ALL_COURSES, "");
        setLoadingAllCourses(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourses(result.data);
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

    //----   GET ALL COURSE CATEGORIES   ----
    const getCourseCategories = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_COURSE_CATEGORIES, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseCategories(result.data);
    }

    //----   ADD NEW COURSE   ----
    const addNewCourse = async (data: any): Promise<boolean> => {
        if (!validateNewCourseData(data)) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_ADD_COURSE, {
            courseId: data.courseId,
            categoryId: data.categoryId,
            name: data.name,
            grade: data.grade,
            typeId: data.typeId,
            isPromotional: data.isPromotional ? 1 : 0
        }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Course Added!", true, 2000);
        setShowAddingCourse(false);
        getCourses();
        return true;
    }

    //----   VALIDATE NEW COURSE DATA   ----
    const validateNewCourseData = (data: any): boolean => {
        if (data.courseId === "") {
            errorToast(`Enter a course ID`);
            return false;
        }
        if (data.name === "") {
            errorToast(`Enter a course name`);
            return false;
        }
        if (data.grade < 0 || data.grade > 12) {
            errorToast(`Grade must be between 0 and 12`);
            return false;
        }
        if (data.categoryId === 0) {
            errorToast(`Choose a category`);
            return false;
        }
        if (data.typeId === 0) {
            errorToast(`Choose a course type`);
            return false;
        }

        return true;
    }

    //----   DELETE COURSE   ----
    const deleteCourse = async (id: string) => {
        let qry = DELETE_ENDPOINT.ADMIN_DELETE_COURSE.toString();
        qry = qry.replace("{courseId}", id.toString());
        setLoadingAllCourses(true);
        let result: IResponse = await Connection.delRequest(qry);
        setLoadingAllCourses(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Course successfully removed", true, 1500);
        getCourses();
        return true;
    }

    // VIEW COURSE
    const viewCourse = (courseId: string) => {
        navigate(`/admin/courses/${courseId}`, { state: courseId });
    }

    return (
        <div className="admin-parents-page-container">
            {
                showAddingCourse &&
                <AddEditComponentV2
                    title='Add New Course'
                    cancel={() => setShowAddingCourse(false)}
                    submit={addNewCourse}
                    fields={[
                        { key: "courseId", name: "Course ID", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "grade", name: "Grade", type: INPUT_TYPE.NUMBER, value: 0 },
                        {
                            key: "categoryId", name: "Category", type: INPUT_TYPE.SELECT, value: courseCategoriesForInput.length > 0 ? courseCategoriesForInput[0].id : 0,
                            selectValues: courseCategoriesForInput.map(c => { return { name: c.name, value: c.id } })
                        },
                        {
                            key: "typeId", name: "Type", type: INPUT_TYPE.SELECT, value: courseTypes.length > 0 ? courseTypes[0].id : 0,
                            selectValues: courseTypes.map(c => { return { name: c.name, value: c.id } })
                        },
                        { key: "isPromotional", name: "Is Promotional?", type: INPUT_TYPE.CHECK, value: false, required: false },
                    ]}
                />
            }

            <TableV2
                title="Courses"
                columns={[
                    { title: "Course ID", field: "id", filtering: false },
                    { title: "Name", field: "name", filtering: false },
                    { title: "Category", field: "categoryName" },
                    { title: "Type", field: "typeName" },
                    {
                        title: "Grade", field: "grade",
                        lookup: { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12", 13: "13" },
                    },
                ]}
                filtering={true}

                isLoading={loadingAllCourses}

                onAdd={async () => setShowAddingCourse(true)}
                onDelete={async (course: ICourse) => deleteCourse(course.id)}
                onRowClick={async (course: ICourse) => viewCourse(course.id)}

                data={courses.map(c => { return { ...c, typeName: `${courseTypes.find(ct => ct.id === c.typeId)?.name ?? ""}` } })}
            />
        </div>
    );
}

export default AdminCoursesPage;