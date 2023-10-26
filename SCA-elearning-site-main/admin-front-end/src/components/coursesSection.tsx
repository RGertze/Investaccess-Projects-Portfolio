
//##################################
//      REACT IMPORTS
//##################################

import React, { Component } from "react";

//##################################
//      COMPONENT IMPORTS
//##################################

import CourseCard from "./courseCard";

//##################################
//      INTERFACE IMPORTS
//##################################

import { ICourseDetails, IGetCoursesByGrade, IResponse } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";
import CourseAddCard from "./courseAddCard";


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    courses: ICourseDetails[],
    noCourses: boolean,
    isUpdating: boolean,
    courseToUpdate: ICourseDetails,

    gradeVal: number,
    sortVal: number
}

interface IProps {
    token: string
}


//##################################
//      CLASS DEFINITION
//##################################

class CourseSection extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            courses: [],
            noCourses: false,
            isUpdating: false,
            courseToUpdate: null,

            gradeVal: 0,
            sortVal: 0
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
        this.getCourses(this.state.gradeVal);     // start with courses from grade 0
    }


    //##################################
    //     SORT COURSES BY NAME
    //##################################

    sortCoursesByName = async (opt: number) => {
        let sortedCourses: ICourseDetails[] = this.state.courses.slice();

        let resT = 1;   // asc order                                            
        let resF = -1;

        if (opt === 1) {
            resT = -1;  // desc order                                           
            resF = 1;
        }

        sortedCourses.sort((courseA, courseB) => {

            if (courseA.Course_Name > courseB.Course_Name)
                return resT;
            if (courseA.Course_Name < courseB.Course_Name)
                return resF;
            return 0;
        });

        this.setState({ courses: sortedCourses, sortVal: opt });
    }


    //##################################
    //     SET COURSE UPDATING STATE
    //##################################

    setUpdating = (isUpdating: boolean, courseToUpdate: ICourseDetails) => {
        document.getElementById("content-container").scrollTop = 0;
        this.setState({ isUpdating: isUpdating, courseToUpdate: courseToUpdate });
    }


    //##################################
    //      GET COURSES
    //##################################

    getCourses = async (grade: number) => {
        let data: IGetCoursesByGrade = {
            grade: grade
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_BY_GRADE, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ noCourses: true, gradeVal: grade });
            return;
        }

        this.setState({ courses: [] }, () => this.setState({ noCourses: false, courses: result.data, gradeVal: grade, sortVal: 0 }));
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="course-section-container">

                <CourseAddCard token={this.props.token} isUpdating={this.state.isUpdating} courseToUpdate={this.state.courseToUpdate} setUpdating={this.setUpdating} refreshCourses={this.getCourses} updateGrade={this.state.gradeVal} />

                <div id="course-section-sort-container">
                    <select value={this.state.gradeVal} onChange={(ev) => this.getCourses(parseInt(ev.target.value))}>
                        <option value={0}>Grade 0</option>
                        <option value={1}>Grade 1</option>
                        <option value={2}>Grade 2</option>
                        <option value={3}>Grade 3</option>
                        <option value={4}>Grade 4</option>
                        <option value={5}>Grade 5</option>
                        <option value={6}>Grade 6</option>
                        <option value={7}>Grade 7</option>
                    </select>
                    <select value={this.state.sortVal} onChange={(ev) => this.sortCoursesByName(parseInt(ev.target.value))}>
                        <option value={0}>A-Z</option>
                        <option value={1}>Z-A</option>
                    </select>
                </div>

                <div id="course-section-table-header-container">
                    <h3 style={{ gridColumn: 1 }}>ID</h3>
                    <h3 style={{ gridColumn: 2 }}>Name</h3>
                    <h3 style={{ gridColumn: 3 }}>Desc</h3>
                    <h3 style={{ gridColumn: 4 }}>Head Staff</h3>
                </div>

                {
                    this.state.noCourses &&
                    <h3 id="course-section-no-courses">No courses found!</h3>
                }

                {
                    !this.state.noCourses &&
                    this.state.courses.map((course) => {
                        return (
                            <CourseCard token={this.props.token} course={course} setUpdating={this.setUpdating} refreshCourses={this.getCourses} grade={this.state.gradeVal} />
                        );
                    })
                }
            </div>
        );
    }
}

export default CourseSection;
