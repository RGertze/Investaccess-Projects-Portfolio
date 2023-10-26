//  react imports
import React from "react";
import ReactDom from "react-dom";

//  css imports
import "normalize.css";
import "./css/main.css";
import "./css/progressBar.css";
import "./css/navbar.css";
import "./css/coursesSection.css";
import "./css/allCourses.css";
import "./css/taughtCourses.css";
import "./css/courseGradeCard.css";
import "./css/courseCard.css";
import "./css/courseSection.css";
import "./css/courseAnnouncement.css";
import "./css/courseMaterialCard.css";
import "./css/courseAssignmentCard.css";
import "./css/loginSection.css";
import "./css/studentCard.css";
import "./css/studentAssignmentCard.css";
import "./css/accountSection.css";
import "./css/accountNavBar.css";
import "./css/accountInfoCard.css";
import "./css/newsSection.css";
import "./css/newsCard.css";
import "../../front-end/src/css/footer.css";

//  component imports
import Base from "./components/base";

ReactDom.render(React.createElement(Base), document.getElementById("root"));
