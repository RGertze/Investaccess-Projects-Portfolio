//######################################
//      COMPONENT IMPORTS
//######################################
import React from "react";
import Loadable from "react-loadable";
import Loading from "./loading";


//######################################
//      ASYNC STUDENTS SECTION
//######################################
const AsyncStudentsSection = Loadable({
    loader: () => import("../components/studentsSection"),
    loading: Loading,
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    }
});

//######################################
//      ASYNC COURSES SECTION
//######################################
const AsyncCoursesSection = Loadable({
    loader: () => import("../components/coursesSection"),
    loading: Loading,
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    }
});

//######################################
//      ASYNC STAFF SECTION
//######################################
const AsyncStaffSection = Loadable({
    loader: () => import("../components/staffSection"),
    loading: Loading,
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    }

});

//######################################
//      ASYNC NEWS SECTION
//######################################
const AsyncNewsSection = Loadable({
    loader: () => import("../components/newsSection"),
    loading: Loading,
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    }

});

//######################################
//      EXPORTS
//######################################
export {
    AsyncStudentsSection,
    AsyncCoursesSection,
    AsyncStaffSection,
    AsyncNewsSection
};
