
//----------------------------
//     DEPENDENCY IMPORTS
//----------------------------

import path from 'path';
import { Request, Response, NextFunction } from 'express';


//----------------------------
//     DATABASE IMPORTS
//----------------------------

import DB_Connection, { QueryBuilder, QUERY_PROCS } from '../database';

//----------------------------
//     INTERFACE IMPORTS
//----------------------------
import { IGetAllStudents, IGetAssignmentMark, IGetAssignmentMarksByCourse, IGetAssignmentPath, IGetCourseAnnouncements, IGetCourseAssignments, IGetCoursesByGrade, IGetCoursesTakenByStudent, IGetCoursesShort, IGetCoursesTaughtByStaff, IGetEnrolled, IGetMaterialByTopic, IGetMaterialPath, IGetPositionsShort, IGetSignedGetUrl, IGetSignedPostUrl, IGetStaffMembers, IGetStaffShort, IGetStudentAssignmentPaths, IGetStudentsByGrade, IGetStudentsInCourse, IResponse, ISearchAllStudents, ISearchStaff, ISearchStudentsInCourse, ISignedGetUrl, ISignedPostUrl, IGetCoursesByGradeShort, IGetCoursesTaughtByStaffDetailed, IGetStudentDetails, IGetStaffDetails, IGetCourseMarks, IGetStudentReports, IGetCourseTopics, IGetStudentsWithMerritsByCourse, IGetNewsEvents, IGetCourseOverview, IGetAllMaterials, IGetSubtopics, IGetAllMessagesBetweenUsers, IGetUsersToMessage, IGetHomeFilesBySection, IGetOtherCourseStaff, IGetCourseAssessments, IGetAssessmentMarksByCourse, IGetRootResourceTopicsForStaff, IGetRootResourceTopicsForStudents, IGetSubResourceTopicsForStaff, IGetSubResourceTopicsForStudents, IGetResourceFilesByTopic, IGetQuizzesByCourse, IGetQuizQuestions, IGetQuizAnswers, IGetStudentQuizAttempts, IGetStudentQuizFiles, IGetStudentQuizUnstructuredAnswers, IGetStudentQuizStructuredAnswer, IGetAllParents, IGetAllTimetables, IGetAllCalendars, IGetParentDetails, IGetParentFinances, IGetParentFinancialStatements, IGetAllSupportDocuments, IGetParentStudents, IGetParentRegistrationRequests, IGetParentRegistrationStudentInfo, IGetTermsAndConditionsFiles, IGetLinksForMaterials, IGetLinksForAssignments, IGetHomeSectionLinks, ICheckForUnreadMessages } from '../interfaces';
import S3Storage from '../s3';


//----------------------------------------------
//      SETUP CONNECTION TO DATABASE
//----------------------------------------------

const dbConnection = new DB_Connection();


//----------------------------
//      CLASS DEFINITION
//----------------------------

class GetEndpoints {


    //--------------------------------------------------------
    //      GET ENROLLED COURSES
    //--------------------------------------------------------

    public static GetEnrolledCourses = async (req: Request, res: Response) => {
        let data: IGetEnrolled = JSON.parse(req.params.data);
        //console.log(data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ENROLLED, data), (error, result) => {
            if (error) {
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "no records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSES BY GRADE
    //--------------------------------------------------------

    public static GetCoursesByGrade = async (req: Request, res: Response) => {
        let data: IGetCoursesByGrade = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSES_BY_GRADE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE OVERVIEW
    //--------------------------------------------------------

    public static GetCourseOverview = async (req: Request, res: Response) => {
        let data: IGetCourseOverview = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_OVERVIEW, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0][0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------




    //--------------------------------------------------------
    //      GET COURSES BY STUDENT
    //--------------------------------------------------------

    public static GetCoursesByStudent = async (req: Request, res: Response) => {
        let data: IGetCoursesTakenByStudent = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSES_TAKEN_BY_STUDENT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSES SHORT
    //--------------------------------------------------------

    public static GetCoursesShort = async (req: Request, res: Response) => {

        let data: IGetCoursesShort = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSES_SHORT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }

            res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSES BY GRADE SHORT
    //--------------------------------------------------------

    public static GetCoursesByGradeShort = async (req: Request, res: Response) => {

        let data: IGetCoursesByGradeShort = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSES_BY_GRADE_SHORT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }

            res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE TOPICS
    //--------------------------------------------------------

    public static GetCourseTopics = async (req: Request, res: Response) => {

        let data: IGetCourseTopics = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_TOPICS, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }

            res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SUBTOPICS
    //--------------------------------------------------------

    public static GetSubtopics = async (req: Request, res: Response) => {

        let data: IGetSubtopics = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_SUBTOPICS, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }

            res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET APPROVED COURSE MATERIALS BY TOPIC
    //--------------------------------------------------------

    public static GetCourseMaterialsTopicApproved = async (req: Request, res: Response) => {
        let data: IGetMaterialByTopic = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_MATERIALS_BY_TOPIC, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET MATERIAL BY TOPIC UNAPPROVED
    //--------------------------------------------------------

    public static GetMaterialByTopicUnapproved = async (req: Request, res: Response) => {
        let data: IGetMaterialByTopic = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_MATERIALS_BY_TOPIC_UNAPPROVED, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL MATERIALS UNAPPROVED
    //--------------------------------------------------------

    public static GetAllMaterialsUnapproved = async (req: Request, res: Response) => {
        let data: IGetAllMaterials = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_MATERIALS_UNAPPROVED, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET MATERIAL BY TOPIC MARKED FOR DELETION
    //--------------------------------------------------------

    public static GetMaterialByTopicMarkedForDeletion = async (req: Request, res: Response) => {
        let data: IGetMaterialByTopic = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_MATERIALS_BY_TOPIC_MARKED_FOR_DELETION, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL MATERIALS MARKED FOR DELETION
    //--------------------------------------------------------

    public static GetAllMaterialsMarkedForDeletion = async (req: Request, res: Response) => {
        let data: IGetAllMaterials = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_MATERIALS_MARKED_FOR_DELETION, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE MATERIAL PATH
    //--------------------------------------------------------

    public static GetCourseMaterialPath = async (req: Request, res: Response) => {
        let data: IGetMaterialPath = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_MATERIAL_PATH, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0][0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE ASSIGNMENTS
    //--------------------------------------------------------

    public static GetCourseAssignments = async (req: Request, res: Response) => {
        let data: IGetCourseAssignments = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_ASSIGNMENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE ASSESSMENTS
    //--------------------------------------------------------

    public static GetCourseAssessments = async (req: Request, res: Response) => {
        let data: IGetCourseAssessments = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_ASSESSMENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ASSESSMENT MARKS BY COURSE
    //--------------------------------------------------------

    public static GetAssessmentMarksByCourse = async (req: Request, res: Response) => {
        let data: IGetAssessmentMarksByCourse = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ASSESSMENT_MARKS_BY_COURSE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ASSIGNMENT PATH
    //--------------------------------------------------------

    public static GetCourseAssignmentPath = async (req: Request, res: Response) => {

        let data: IGetAssignmentPath = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ASSIGNMENT_PATH, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0][0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE ANNOUNCEMENTS
    //--------------------------------------------------------

    public static GetCourseAnnouncements = async (req: Request, res: Response) => {

        let data: IGetCourseAnnouncements = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_ANNOUNCEMENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL STUDENTS
    //--------------------------------------------------------

    public static GetAllStudents = async (req: Request, res: Response) => {

        let data: IGetAllStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_STUDENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL STUDENTS SHORT
    //--------------------------------------------------------

    public static GetAllStudentsShort = async (req: Request, res: Response) => {

        let data: IGetAllStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_STUDENTS_SHORT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL STUDENTS NOT REGISTERED
    //--------------------------------------------------------

    public static GetAllStudentsNotRegistered = async (req: Request, res: Response) => {

        let data: IGetAllStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_STUDENTS_NOT_REGISTERED, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------


    //--------------------------------------------------------
    //      SEARCH ALL STUDENTS
    //--------------------------------------------------------

    public static SearchAllStudents = async (req: Request, res: Response) => {

        let data: ISearchAllStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.SEARCH_ALL_STUDENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENTS BY GRADE
    //--------------------------------------------------------

    public static GetStudentsByGrade = async (req: Request, res: Response) => {

        let data: IGetStudentsByGrade = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENTS_BY_GRADE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);

        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENTS IN COURSE
    //--------------------------------------------------------

    public static GetStudentsInCourse = async (req: Request, res: Response) => {

        let data: IGetStudentsInCourse = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENTS_IN_COURSE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      SEARCH STUDENTS IN COURSE
    //--------------------------------------------------------

    public static SearchStudentsInCourse = async (req: Request, res: Response) => {

        let data: ISearchStudentsInCourse = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.SEARCH_STUDENTS_IN_COURSE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENTS WITH MERRITS BY COURSE
    //--------------------------------------------------------

    public static GetStudentsWithMerritsByCourse = async (req: Request, res: Response) => {

        let data: IGetStudentsWithMerritsByCourse = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENTS_WITH_MERRITS_BY_COURSE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------


    //--------------------------------------------------------
    //      GET STUDENT REPORTS
    //--------------------------------------------------------

    public static GetStudentReports = async (req: Request, res: Response) => {

        let data: IGetStudentReports = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_REPORTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ASSIGNMENT MARKS BY COURSE
    //--------------------------------------------------------

    public static GetAssignmentMarksByCourse = async (req: Request, res: Response) => {
        let data: IGetAssignmentMarksByCourse = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ASSIGNMENT_MARKS_BY_COURSE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ASSIGNMENT MARK
    //--------------------------------------------------------

    public static GetAssignmentMark = async (req: Request, res: Response) => {
        let data: IGetAssignmentMark = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ASSIGNMENT_MARK, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0][0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No record found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSE MARKS
    //--------------------------------------------------------

    public static GetCourseMarks = async (req: Request, res: Response) => {
        let data: IGetCourseMarks = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_MARKS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No record found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENT ASSIGNMENT PATHS
    //--------------------------------------------------------

    public static GetStudentAssignmentPaths = async (req: Request, res: Response) => {
        let data: IGetStudentAssignmentPaths = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_ASSIGNMENT_PATHS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STAFF MEMBERS
    //--------------------------------------------------------

    public static GetStaffMembers = async (req: Request, res: Response) => {
        let data: IGetStaffMembers = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STAFF_MEMBERS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SHORT VERSION OF STAFF
    //--------------------------------------------------------

    public static GetStaffMembersShort = async (req: Request, res: Response) => {
        let data: IGetStaffShort = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STAFF_SHORT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENT DETAILS
    //--------------------------------------------------------

    public static GetStudentDetails = async (req: Request, res: Response) => {
        let data: IGetStudentDetails = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_DETAILS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0][0].RESULT) {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                } else {
                    response.data = result[0][0];
                }
            }

            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STAFF DETAILS
    //--------------------------------------------------------

    public static GetStaffDetails = async (req: Request, res: Response) => {
        let data: IGetStaffDetails = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STAFF_DETAILS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0][0].RESULT) {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                } else {
                    response.data = result[0][0];
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET OTHER COURSE STAFF
    //--------------------------------------------------------

    public static GetOtherCourseStaff = async (req: Request, res: Response) => {
        let data: IGetOtherCourseStaff = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_OTHER_COURSE_STAFF, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      SEARCH STAFF MEMBERS
    //--------------------------------------------------------

    public static SearchStaffMembers = async (req: Request, res: Response) => {

        let data: ISearchStaff = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.SEARCH_STAFF, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSES TAUGHT BY STAFF
    //--------------------------------------------------------

    public static GetCoursesTaughtByStaff = async (req: Request, res: Response) => {
        let data: IGetCoursesTaughtByStaff = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSES_TAUGHT_BY_STAFF, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET COURSES TAUGHT BY STAFF DETAILED
    //--------------------------------------------------------

    public static GetCoursesTaughtByStaffDetailed = async (req: Request, res: Response) => {
        let data: IGetCoursesTaughtByStaffDetailed = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSES_TAUGHT_BY_STAFF_DETAILED, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET POSITIONS SHORT
    //--------------------------------------------------------

    public static GetPositionsShort = async (req: Request, res: Response) => {
        let data: IGetPositionsShort = JSON.parse(req.params.data);
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_POSITIONS_SHORT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET NEWS EVENTS
    //--------------------------------------------------------

    public static GetNewsEvents = async (req: Request, res: Response) => {
        let data: IGetNewsEvents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_NEWS_EVENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL MESSAGES BETWEEN USERS
    //--------------------------------------------------------

    public static GetAllMessagesBetweenUsers = async (req: Request, res: Response) => {
        let data: IGetAllMessagesBetweenUsers = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_MESSAGES_BETWEEN_USERS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET USERS TO MESSAGE
    //--------------------------------------------------------

    public static GetUsersToMessage = async (req: Request, res: Response) => {
        let data: IGetUsersToMessage = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_USERS_TO_MESSAGE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET USERS TO MESSAGE
    //--------------------------------------------------------

    public static CheckForUnreadMessages = async (req: Request, res: Response) => {
        let data: ICheckForUnreadMessages = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.CHECK_FOR_UNREAD_MESSAGES, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0][0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------


    //--------------------------------------------------------
    //      GET HOME FILES BY SECTION
    //--------------------------------------------------------

    public static GetHomeFilesBySection = async (req: Request, res: Response) => {
        let data: IGetHomeFilesBySection = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_HOME_FILES_BY_SECTION, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ROOT RESOURCE TOPICS FOR STAFF
    //--------------------------------------------------------

    public static GetRootResourceTopicsForStaff = async (req: Request, res: Response) => {
        let data: IGetRootResourceTopicsForStaff = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ROOT_RESOURCE_TOPICS_FOR_STAFF, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ROOT RESOURCE TOPICS FOR STUDENTS
    //--------------------------------------------------------

    public static GetRootResourceTopicsForStudents = async (req: Request, res: Response) => {
        let data: IGetRootResourceTopicsForStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ROOT_RESOURCE_TOPICS_FOR_STUDENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SUB RESOURCE TOPICS FOR STAFF
    //--------------------------------------------------------

    public static GetSubResourceTopicsForStaff = async (req: Request, res: Response) => {
        let data: IGetSubResourceTopicsForStaff = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_SUB_RESOURCE_TOPICS_FOR_STAFF, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SUB RESOURCE TOPICS FOR STUDENTS
    //--------------------------------------------------------

    public static GetSubResourceTopicsForStudents = async (req: Request, res: Response) => {
        let data: IGetSubResourceTopicsForStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_SUB_RESOURCE_TOPICS_FOR_STUDENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET RESOURCE FILES BY TOPIC
    //--------------------------------------------------------

    public static GetResourceFilesByTopic = async (req: Request, res: Response) => {
        let data: IGetResourceFilesByTopic = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_RESOURCE_FILES_BY_TOPIC, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET QUIZZES BY COURSE
    //--------------------------------------------------------

    public static GetQuizzesByCourse = async (req: Request, res: Response) => {
        let data: IGetQuizzesByCourse = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_QUIZZES_BY_COURSE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET QUIZ QUESTIONS
    //--------------------------------------------------------

    public static GetQuizQuestions = async (req: Request, res: Response) => {
        let data: IGetQuizQuestions = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_QUIZ_QUESTIONS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET QUIZ ANSWERS
    //--------------------------------------------------------

    public static GetQuizAnswers = async (req: Request, res: Response) => {
        let data: IGetQuizAnswers = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_QUIZ_ANSWERS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENT QUIZ ATTEMPTS
    //--------------------------------------------------------

    public static GetStudentQuizAttempts = async (req: Request, res: Response) => {
        let data: IGetStudentQuizAttempts = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_QUIZ_ATTEMPTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    if (result[0][0].RESULT) {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    } else {
                        response.data = result[0];
                    }
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENT QUIZ FILES
    //--------------------------------------------------------

    public static GetStudentQuizFiles = async (req: Request, res: Response) => {
        let data: IGetStudentQuizFiles = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_QUIZ_FILES, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENT QUIZ UNSTRUCTURED ANSWERS
    //--------------------------------------------------------

    public static GetStudentQuizUnstructuredAnswers = async (req: Request, res: Response) => {
        let data: IGetStudentQuizUnstructuredAnswers = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_QUIZ_UNSTRUCTURED_ANSWERS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET STUDENT QUIZ STRUCTURED ANSWER
    //--------------------------------------------------------

    public static GetStudentQuizStructuredAnswer = async (req: Request, res: Response) => {
        let data: IGetStudentQuizStructuredAnswer = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_STUDENT_QUIZ_STRUCTURED_ANSWER, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL PARENTS
    //--------------------------------------------------------

    public static GetAllParents = async (req: Request, res: Response) => {

        let data: IGetAllParents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_PARENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET PARENT DETAILS
    //--------------------------------------------------------

    public static GetParentDetails = async (req: Request, res: Response) => {

        let data: IGetParentDetails = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_DETAILS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0][0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //-------------------------------------------------------- --------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL TIMETABLES
    //--------------------------------------------------------

    public static GetAllTimetables = async (req: Request, res: Response) => {

        let data: IGetAllTimetables = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_TIMETABLES, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL CALENDARS
    //--------------------------------------------------------

    public static GetAllCalendars = async (req: Request, res: Response) => {

        let data: IGetAllCalendars = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_CALENDARS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET ALL SUPPORT DOCUMENTS
    //--------------------------------------------------------

    public static GetAllSupportDocuments = async (req: Request, res: Response) => {

        let data: IGetAllSupportDocuments = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_SUPPORT_DOCUMENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET PARENT FINANCES
    //--------------------------------------------------------

    public static GetParentFinances = async (req: Request, res: Response) => {

        let data: IGetParentFinances = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_FINANCES, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET PARENT FINANCIAL STATEMENTS
    //--------------------------------------------------------

    public static GetParentFinancialStatements = async (req: Request, res: Response) => {

        let data: IGetParentFinancialStatements = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_FINANCIAL_STATEMENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              GET PARENT STUDENTS
    //--------------------------------------------------------

    public static GetParentStudents = async (req: Request, res: Response) => {

        let data: IGetParentStudents = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_STUDENTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET PARENT REGISTRATION REQUESTS
    //--------------------------------------------------------

    public static GetParentRegistrationRequests = async (req: Request, res: Response) => {

        let data: IGetParentRegistrationRequests = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_REGISTRATION_REQUESTS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET PARENT REGISTRATION STUDENT INFO
    //--------------------------------------------------------

    public static GetParentRegistrationStudentInfo = async (req: Request, res: Response) => {

        let data: IGetParentRegistrationStudentInfo = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_REGISTRATION_STUDENT_INFO, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0][0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET TERMS AND CONDITIONS FILES
    //--------------------------------------------------------

    public static GetTermsAndConditionsFiles = async (req: Request, res: Response) => {

        let data: IGetTermsAndConditionsFiles = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_TERMS_AND_CONDITIONS_FILES, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET LINKS MARKED FOR DELETION
    //--------------------------------------------------------

    public static GetLinksMarkedForDeletion = async (req: Request, res: Response) => {

        let data: IGetLinksForMaterials = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_LINKS_MARKED_FOR_DELETION, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET ALL LINKS MARKED FOR DELETION
    //--------------------------------------------------------

    public static GetAllLinksMarkedForDeletion = async (req: Request, res: Response) => {

        let data = {};

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_LINKS_MARKED_FOR_DELETION, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET UNAPPROVED LINKS BY TOPIC
    //--------------------------------------------------------

    public static GetUnapprovedLinksByTopic = async (req: Request, res: Response) => {

        let data: IGetLinksForMaterials = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_UNAPPROVED_LINKS_BY_TOPIC, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET ALL UNAPPROVED LINKS
    //--------------------------------------------------------

    public static GetAllUnapprovedLinks = async (req: Request, res: Response) => {

        let data = {};

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ALL_UNAPPROVED_LINKS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET APPROVED LINKS BY TOPIC
    //--------------------------------------------------------

    public static GetApprovedLinksByTopic = async (req: Request, res: Response) => {

        let data: IGetLinksForMaterials = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_APPROVED_LINKS_BY_TOPIC, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET LINKS BY TOPIC
    //--------------------------------------------------------

    public static GetLinksByTopic = async (req: Request, res: Response) => {

        let data: IGetLinksForMaterials = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_LINKS_BY_TOPIC, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET COURSE ASSIGNMENT LINKS
    //--------------------------------------------------------

    public static GetCourseAssignmentLinks = async (req: Request, res: Response) => {

        let data: IGetLinksForAssignments = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_COURSE_ASSIGNMENT_LINKS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //           GET HOME SECTION LINKS
    //--------------------------------------------------------

    public static GetHomeSectionLinks = async (req: Request, res: Response) => {

        let data: IGetHomeSectionLinks = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: [],
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_HOME_SECTION_LINKS, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0].length > 0) {
                    response.data = result[0];
                } else {
                    response.stat = "error";
                    response.error = "No records found";
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------




    //--------------------------------------------------------
    //      GET SIGNED S3 NEWS IMG GET URL
    //--------------------------------------------------------

    public static GetSignedNewsImgGetUrl = async (req: Request, res: Response) => {
        let data: IGetSignedGetUrl = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let urlResult: ISignedGetUrl = {
            url: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.CHECK_NEWS_IMG_PATH, data), async (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0][0].RESULT == "ok") {
                    try {
                        urlResult.url = await S3Storage.getSignedGetUrl(data.filePath);
                        response.data = urlResult;
                    } catch (err) {
                        console.log(err);
                        response.stat = "error";
                        response.error = "failed to generate signed url";
                    }
                } else {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.send(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SIGNED S3 HOME FILE GET URL
    //--------------------------------------------------------

    public static GetSignedHomeFileGetUrl = async (req: Request, res: Response) => {
        let data: IGetSignedGetUrl = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let urlResult: ISignedGetUrl = {
            url: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.CHEC_HOME_FILE_PATH, data), async (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.sqlMessage;
            } else {
                if (result[0][0].RESULT == "ok") {
                    try {
                        urlResult.url = await S3Storage.getSignedGetUrl(data.filePath);
                        response.data = urlResult;
                    } catch (err) {
                        console.log(err);
                        response.stat = "error";
                        response.error = "failed to generate signed url";
                    }
                } else {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.send(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SIGNED S3 GET URL
    //--------------------------------------------------------

    public static GetSignedGetUrl = async (req: Request, res: Response) => {
        let data: IGetSignedGetUrl = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let result: ISignedGetUrl = {
            url: ""
        }

        try {
            result.url = await S3Storage.getSignedGetUrl(data.filePath);
            response.data = result;
        } catch (err) {
            console.log(err);
            response.stat = "error";
            response.error = "failed to generate signed url";
        }

        res.send(response);
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      GET SIGNED S3 POST URL
    //--------------------------------------------------------

    public static GetSignedPostUrl = async (req: Request, res: Response) => {
        let data: IGetSignedPostUrl = JSON.parse(req.params.data);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let result: ISignedPostUrl = {
            filePath: "",
            url: ""
        }

        result.filePath = S3Storage.generateUniqueFileName(data.originalFileName);

        try {
            result.url = await S3Storage.getSignedPostUrl(result.filePath);
            response.data = result;
        } catch (err) {
            console.log(err);
            response.stat = "error";
            response.error = "failed to generate signed url";
        }

        res.send(response);
    }

    //--------------------------------------------------------
    //--------------------------------------------------------
}

export default GetEndpoints;
