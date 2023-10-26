
//------------      REACT IMPORTS     ------------------

import React, { useState } from "react";
import { ICourseDetails } from "../interfaces";

//------------      INTERFACE/ENUM IMPORTS     ------------------


//------------      COMPONENT IMPORTS     ------------------

import CourseSection from "./courseSection";
import TaughtCourses from "./taughtCourses";
import ResourcesSection from "./resourcesSection/resourcesSection";
import { Route, Routes, useNavigate } from "react-router-dom";



//---------------------------------------
//       ENUM DEFINITIONS
//---------------------------------------

enum COURSE_SECTION {
    ENROLLED = 0,
    RESOURCES = 1
}

//---------------------------------------
//---------------------------------------



//---------------------------------------
//       INTERFACE DEFINITIONS
//---------------------------------------

interface IProps {
    token: string,
    staffID: string
}

//---------------------------------------
//---------------------------------------



//---------------------------------------
//       COLOR CONSTS
//---------------------------------------

//const ACTIVE: string[] = ["-8888FF", "white"];
const ACTIVE: string[] = ["#CB7B3E", "white"];
const INACTIVE: string[] = ["#82332E", "#EEEEEE"];
//const INACTIVE: string[] = ["-CCCCFF", "black"];
//const INACTIVE = "rgb(210,210,210)";
//const ACTIVE = "rgb(230,230,230)";

//---------------------------------------
//---------------------------------------



//---------------------------------------
//       COMP DEFINITION
//---------------------------------------


const CoursesSection = (props: IProps) => {

    //----   STATE   ----

    const [section, setSection] = useState(COURSE_SECTION.ENROLLED);
    const [currentCourse, setCurrentCourse] = useState<ICourseDetails>(null);
    const [all_tab_col, setAllTabCol] = useState(INACTIVE);
    const [my_tab_col, setMyTabCol] = useState(ACTIVE);

    //----   REACT-ROUTER NAVIGATE HOOK   ----

    const navigate = useNavigate();


    //------------      CHANGE SECTION FUNC     ------------------

    const changeSection = (sect: COURSE_SECTION) => {
        if (sect === COURSE_SECTION.RESOURCES) {
            setAllTabCol(ACTIVE);
            setMyTabCol(INACTIVE);
        }
        else {

            setAllTabCol(INACTIVE);
            setMyTabCol(ACTIVE);
        }
        setSection(sect);
    }


    //------------      VIEW COURSE FUNC     ------------------

    const viewCourse = (course: ICourseDetails) => {
        setCurrentCourse(course);
        navigate("/staff/courses/view");
    }


    return (
        <div id="courses-section-container">
            <Routes>
                <Route path="" element={

                    //----------    VIEW LIST OF COURSES    -----------

                    <div>

                        <div id="courses-nav-tabs">
                            <div id="courses-nav-tabs-my" style={{ backgroundColor: my_tab_col[0], color: my_tab_col[1] }} className="course-nav-tabs-opts" onClick={() => changeSection(COURSE_SECTION.ENROLLED)}>
                                <h4 style={{ borderBottom: (section == COURSE_SECTION.ENROLLED) ? "2px solid white" : "none" }}>My Courses</h4>
                            </div>
                            <div id="courses-nav-tabs-all" style={{ backgroundColor: all_tab_col[0], color: all_tab_col[1] }} className="course-nav-tabs-opts" onClick={() => changeSection(COURSE_SECTION.RESOURCES)}>
                                <h4 style={{ borderBottom: (section == COURSE_SECTION.RESOURCES) ? "2px solid white" : "none" }}>Resources</h4>
                            </div>
                        </div>

                        {
                            //----------    VIEW ENROLLED COURSES    -----------

                            section === COURSE_SECTION.ENROLLED &&
                            <TaughtCourses token={props.token} staffID={props.staffID} viewCourse={viewCourse} />
                        }


                        {
                            //----------    RESOURCES SECTION    -----------

                            section === COURSE_SECTION.RESOURCES &&
                            <ResourcesSection token={props.token} staffID={parseInt(props.staffID)} />
                        }

                    </div>

                } />


                {

                    //----------    VIEW SPECIFIC COURSE    -----------

                    <Route path="view" element={<CourseSection course={currentCourse} token={props.token} staffID={props.staffID} />} />
                }
            </Routes>
        </div >
    );
}

export default CoursesSection;
