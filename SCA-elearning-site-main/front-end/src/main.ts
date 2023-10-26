//  react imports
import React from "react";
import ReactDom from "react-dom";

//  css imports
import "normalize.css";
import "./css/main.css";
import "./css/progressBar.css";
import "../../staff-front-end/src/css/navbar.css";
import "./css/coursesSection.css";
import "./css/allCourses.css";
import "./css/enrolledCourses.css";
import "./css/courseGradeCard.css";
import "./css/courseCard.css";
import "./css/courseSection.css";
import "./css/courseAnnouncement.css";
import "./css/courseMaterialCard.css";
import "./css/courseAssignmentCard.css";
import "./css/courseMarksCard.css";
import "../../staff-front-end/src/css/loginSection.css";
import "./css/accountSection.css";
import "../../staff-front-end/src/css/accountNavBar.css";
import "./css/accountInfoCard.css";
import "./css/accountMarksCard.css";
import "./css/accountCourseMarkCard.css";
import "./css/accountReportsCard.css";
import "./css/accountStudentReportCard.css";
import "./css/newsSection.css";
import "./css/newsCard.css";
import "./css/footer.css";

//  component imports
import Base from "./components/base";

ReactDom.render(React.createElement(Base), document.getElementById("root"));
