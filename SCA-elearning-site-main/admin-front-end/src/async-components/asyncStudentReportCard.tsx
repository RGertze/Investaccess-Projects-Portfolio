//######################################
//      COMPONENT IMPORTS
//######################################
import React from "react";
import Loadable from "react-loadable";
import Loading from "./loading";


//######################################
//      ASYNC REPORT CARD SECTION
//######################################
const AsyncStudentReportCard = Loadable({
    loader: () => import("../components/studentReportCard"),
    loading: Loading,
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    }
});

export {
    AsyncStudentReportCard
}
