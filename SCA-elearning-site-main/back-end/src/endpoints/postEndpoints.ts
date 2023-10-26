
//----------------------------
//     DEPENDENCY IMPORTS
//----------------------------

import path from 'path';
import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";

//----------------------------
//     JWT IMPORTS
//----------------------------

import { generateAccessToken } from "../jwtAuth";


//----------------------------
//     DATABASE IMPORTS
//----------------------------

import DB_Connection, { QueryBuilder, QUERY_PROCS } from '../database';

//----------------------------
//     INTERFACE IMPORTS
//----------------------------
import { IAddAllStudentCourses, IAddCourse, IAddCourseAnnouncement, IAddCourseAssessment, IAddCourseAssignment, IAddCourseMaterial, IAddCourseStaff, IAddCourseTopic, IAddDirectMessage, IAddFileForParents, IAddHomeFile, IAddLink, IAddNewsEvent, IAddParent, IAddParentFinancialStatement, IAddParentStudent, IAddPosition, IAddQuiz, IAddQuizAnswer, IAddQuizQuestion, IAddResourceFile, IAddRootResourceTopic, IAddStaff, IAddStudent, IAddStudentAssessmentMark, IAddStudentAssignment, IAddStudentCourse, IAddStudentQuiz, IAddStudentQuizFile, IAddStudentQuizStructuredAnswer, IAddStudentQuizUnstructuredAnswer, IAddStudentReport, IAddSubResourceTopic, IAddSubtopic, IAddSuggestion, IAddTermsAndConditionsAccepted, IAddTermsAndConditionsFile, IApproveCourseMaterial, IChangePassword, ICheckAdminResourcePassword, ICheckTermsAndConditionsAccepted, IDeleteAssignmentLink, IDeleteCourse, IDeleteCourseAnnouncement, IDeleteCourseAssessment, IDeleteCourseAssignment, IDeleteCourseMaterial, IDeleteCourseTopic, IDeleteFile, IDeleteFileForParents, IDeleteHomeFile, IDeleteLink, IDeleteNewsEvent, IDeleteParent, IDeleteParentRegistrationRequest, IDeleteQuiz, IDeleteQuizAnswer, IDeleteQuizQuestion, IDeleteResourceFile, IDeleteResourceTopic, IDeleteStaff, IDeleteStudent, IDeleteStudentAssignment, IDeleteStudentCourse, IDeleteStudentQuizFile, IEndStudentQuizAttempt, IGenerateInitialStudentAssignmentMarkRecords, IGetAllMessagesBetweenUsers, ILogin, IMarkLinkForDeletion, IMarkMaterialForDeletion, IMarkMessagesAsRead, IMarkStudentQuiz, IParentEmail, IPassword, IRemoveCourseTaught, IResponse, ISetAdminResourcePassword, IUnmarkMaterialForDeletion, IUpdateCourse, IUpdateCourseTopic, IUpdateParent, IUpdateParentFinancesBalance, IUpdateParentFinancesNextPaymentDate, IUpdateQuiz, IUpdateStaff, IUpdateStudent, IUpdateStudentAssessmentMark, IUpdateStudentAssignmentMark, IUpdateStudentCourse, IUpdateStudentQuizStructuredAnswerMark } from '../interfaces';
import { sendMail } from '../smtp';
import { emitDirectMessage } from '../server';


//----------------------------------------------
//      SETUP CONNECTION TO DATABASE
//----------------------------------------------

const dbConnection = new DB_Connection();


//----------------------------
//      CLASS DEFINITION
//----------------------------

class PostEndpoints {

    //--------------------------------------------------------
    //      LOGIN
    //--------------------------------------------------------

    public static Login = (req: Request, res: Response) => {
        let userData: ILogin = req.body;
        //console.log(userData);

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }


        //--------      CHECK IF USER EXISTS AND RETRIEVE PASSWORD      -----------

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.LOGIN, userData), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = "failed to read from database";
                return res.json(response);
            }


            //--------      USER NOT FOUND      -----------

            if (result[0][0].RESULT) {
                response.stat = "error";
                response.error = "user does not exist";
                return res.json(response);
            }

            let hashedPassword: IPassword = result[0][0];

            //--------      IF USER EXISTS AND PASSWORD RETRIEVED, COMPARE WITH SENT PASSWORD      -----------

            bcrypt.compare(userData.password, hashedPassword.Password, (err, same) => {
                if (err) {
                    console.log(err);
                    response.stat = "error";
                    response.error = "failed to check password. Try again later";
                    return res.json(response);
                }

                if (same) {
                    response.token = generateAccessToken(userData.username);
                } else {
                    response.stat = "error";
                    response.error = "incorrect password";
                }

                res.json(response);
            });

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      CHECK ADMIN RESOURCE PASSWORD
    //--------------------------------------------------------

    public static CheckAdminResourcePassword = (req: Request, res: Response) => {
        let data: ICheckAdminResourcePassword = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }


        //--------      CHECK IF USER EXISTS AND RETRIEVE PASSWORD      -----------

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_ADMIN_RESOURCE_PASSWORD, data.adminID), (error, result) => {
            if (error) {
                response.stat = "error";
                response.error = error.message;
                return res.json(response);
            }


            let hashedPassword: IPassword = result[0][0];

            //----   COMPARE WITH SENT PASSWORD   ----

            bcrypt.compare(data.password, hashedPassword.Password, (err, same) => {
                if (err) {
                    console.log(err);
                    response.stat = "error";
                    response.error = "failed to check password. Try again later";
                    return res.json(response);
                }

                if (!same) {
                    response.stat = "error";
                    response.error = "incorrect password";
                }

                res.json(response);
            });

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE
    //--------------------------------------------------------

    public static AddCourse = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddCourse = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE STAFF
    //--------------------------------------------------------

    public static AddCourseStaff = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddCourseStaff = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_STAFF, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE TOPIC
    //--------------------------------------------------------

    public static AddCourseTopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddCourseTopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_TOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD SUBTOPIC
    //--------------------------------------------------------

    public static AddSubtopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddSubtopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_SUBTOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });


    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE MATERIAL
    //--------------------------------------------------------

    public static AddCourseMaterial = (req: Request, res: Response) => {

        let data: IAddCourseMaterial = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_MATERIAL, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE ASSIGNMENT
    //--------------------------------------------------------

    public static AddCourseAssignment = (req: Request, res: Response) => {

        let data: IAddCourseAssignment = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_ASSIGNMENT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.json(response);

            //-----        GENERATE MARK RECORD FOR EACH STUDENT IN THE COURSE      -----
            if (response.stat === "ok") {
                let genData: IGenerateInitialStudentAssignmentMarkRecords = {
                    courseID: data.courseID,
                    assignmentPath: data.assignmentPath
                }

                dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GENERATE_INITIAL_STUDENT_ASSIGNMENT_MARK_RECORDS, genData), (err, qryResult) => {
                    if (err)
                        console.log(err);
                    else
                        console.log("Student_Assignment_Mark records generated successfully");
                });
            }
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE ASSESSMENT
    //--------------------------------------------------------

    public static AddCourseAssessment = (req: Request, res: Response) => {

        let data: IAddCourseAssessment = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_ASSESSMENT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE ASSESSMENT MARK
    //--------------------------------------------------------

    public static AddCourseAssessmentMark = (req: Request, res: Response) => {

        let data: IAddStudentAssessmentMark = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_ASSESSMENT_MARK, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT ASSIGNMENT
    //--------------------------------------------------------

    public static AddStudentAssignment = (req: Request, res: Response) => {

        let data: IAddStudentAssignment = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_ASSIGNMENT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD COURSE ANNOUNCEMENT
    //--------------------------------------------------------

    public static AddCourseAnnouncement = (req: Request, res: Response) => {

        let data: IAddCourseAnnouncement = req.body;

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_COURSE_ANNOUNCEMENT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }
            res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT
    //--------------------------------------------------------

    public static AddStudent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddStudent = req.body;

        bcrypt.hash(data.studentPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                response.stat = "error";
                response.error = "failed to create password hash";
                return res.send(response);
            }

            data.studentPassword = hashedPassword;

            dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT, data), (error, result) => {

                if (error) {
                    console.log(error.sqlMessage);
                    response.stat = "error";
                    response.error = error.message;
                } else {
                    if (result[0][0].RESULT !== "ok") {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    }
                }

                return res.json(response);

            });
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT REPORT
    //--------------------------------------------------------

    public static AddStudentReport = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddStudentReport = req.body;


        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_REPORT, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT COURSE
    //--------------------------------------------------------

    public static AddStudentCourse = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddStudentCourse = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_COURSE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD ALL STUDENT COURSES
    //--------------------------------------------------------

    public static AddAllStudentCourses = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddAllStudentCourses = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_ALL_STUDENT_COURSES, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD POSITION
    //--------------------------------------------------------

    public static AddPosition = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddPosition = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_POSITION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STAFF MEMBER
    //--------------------------------------------------------

    public static AddStaff = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IAddStaff = req.body;

        bcrypt.hash(data.staffPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                response.stat = "error";
                response.error = "failed to create password hash";
                return res.send(response);
            }

            data.staffPassword = hashedPassword;

            dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STAFF, data), (error, result) => {

                if (error) {
                    console.log(error.sqlMessage);
                    response.stat = "error";
                    response.error = error.message;
                } else {
                    if (result[0][0].RESULT !== "ok") {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    }
                }

                return res.json(response);

            });
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD NEWS EVENT
    //--------------------------------------------------------

    public static AddNewsEvent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddNewsEvent = req.body;

        //-----   ADD NEWS EVENT TO DB   -----
        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_NEWS_EVENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }

                //-----   GET ALL PARENT EMAILS   -----
                dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_PARENT_EMAILS, {}), (_error, _result) => {

                    if (_error) {
                        console.log(_error.sqlMessage);
                        response.stat = "error";
                        response.error = _error.message;
                    } else {
                        let emails: IParentEmail[] = _result[0];
                        let to: string[] = emails.map(email => email.email);

                        //-----   SEND MAIL TO PARENTS   -----
                        sendMail(to, "(DEVELOPMENT TESTING) news alert!", `New artice available: "${data.title}"`);
                    }

                });
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD SUGGESTION
    //--------------------------------------------------------

    public static AddSuggestion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddSuggestion = req.body;

        //-----   ADD NEWS EVENT TO DB   -----
        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_SUGGESTION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD DIRECT MESSAGE
    //--------------------------------------------------------

    public static AddDirectMessage = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddDirectMessage = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_DIRECT_MESSAGE, data), (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                } else {

                    //----   GET LAST MESSAGE   ----

                    let lastMsgData: IGetAllMessagesBetweenUsers = {
                        userID1: data.fromID,
                        userID2: data.toID
                    }

                    dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_LAST_MESSAGE_SENT, lastMsgData), (error, result) => {
                        if (error) {
                            console.log(error.sqlMessage);
                        } else {
                            if (result[0].length > 0) {
                                emitDirectMessage(data.toID, result[0][0]);
                            } else {
                                console.log("No records found");
                            }
                        }
                    });

                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD HOME FILE
    //--------------------------------------------------------

    public static AddHomeFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddHomeFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_HOME_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD ROOT RESOURCE TOPIC
    //--------------------------------------------------------

    public static AddRootResourceTopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddRootResourceTopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_ROOT_RESOURCE_TOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD SUB RESOURCE TOPIC
    //--------------------------------------------------------

    public static AddSubResourceTopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddSubResourceTopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_SUB_RESOURCE_TOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD RESOURCE FILE
    //--------------------------------------------------------

    public static AddResourceFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddResourceFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_RESOURCE_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD QUIZ
    //--------------------------------------------------------

    public static AddQuiz = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddQuiz = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_QUIZ, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD QUIZ QUESTION
    //--------------------------------------------------------

    public static AddQuizQuestion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddQuizQuestion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_QUIZ_QUESTION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD QUIZ ANSWER
    //--------------------------------------------------------

    public static AddQuizAnswer = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddQuizAnswer = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_QUIZ_ANSWER, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT QUIZ
    //--------------------------------------------------------

    public static AddStudentQuiz = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddStudentQuiz = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_QUIZ, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT QUIZ UNSTRUCTURED ANSWER
    //--------------------------------------------------------

    public static AddStudentQuizUnstructuredAnswer = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddStudentQuizUnstructuredAnswer[] = req.body;

        if (data.length === 0) {
            response.stat = "error";
            response.error = "no answers supplied";
            return res.json(response);
        }

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_ALL_QUESTION_ANSWERS, data[0]), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;

                return res.json(response);
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;

                    return res.json(response);
                } else {

                    dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_QUIZ_UNSTRUCTURED_ANSWER, data), (err, reslt) => {

                        if (error) {
                            console.log(error.sqlMessage);
                            response.stat = "error";
                            response.error = error.message;
                        }

                        return res.json(response);

                    });
                }
            }


        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT QUIZ STRUCTURED ANSWER
    //--------------------------------------------------------

    public static AddStudentQuizStructuredAnswer = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddStudentQuizStructuredAnswer = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_QUIZ_STRUCTURED_ANSWER, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD STUDENT QUIZ FILE
    //--------------------------------------------------------

    public static AddStudentQuizFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddStudentQuizFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_STUDENT_QUIZ_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD PARENT
    //--------------------------------------------------------

    public static AddParent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddParent = req.body;

        bcrypt.hash(data.pword, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                response.stat = "error";
                response.error = "failed to create password hash";
                return res.send(response);
            }

            data.pword = hashedPassword;

            dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_PARENT, data), (error, result) => {

                if (error) {
                    console.log(error.sqlMessage);
                    response.stat = "error";
                    response.error = error.message;
                } else {
                    if (result[0][0].RESULT !== "ok") {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    }
                }

                return res.json(response);

            });
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD FILE FOR PARENTS
    //--------------------------------------------------------

    public static AddFileForParents = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddFileForParents = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_FILE_FOR_PARENTS, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      ADD PARENT FINANCIAL STATEMENT
    //--------------------------------------------------------

    public static AddFinancialStatement = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddParentFinancialStatement = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_PARENT_FINANCIAL_STATEMENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              ADD PARENT STUDENT
    //--------------------------------------------------------

    public static AddParentStudent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddParentStudent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_PARENT_STUDENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              ADD PARENT REGISTRATION REQUEST
    //--------------------------------------------------------

    public static AddParentRegistrationRequest = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddParentStudent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_PARENT_REGISTRATION_REQUEST, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //            ADD TERMS AND CONDITIONS FILE
    //--------------------------------------------------------

    public static AddTermsAndConditionsFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddTermsAndConditionsFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_TERMS_AND_CONDITIONS_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //            ADD TERMS AND CONDITIONS ACCEPTED
    //--------------------------------------------------------

    public static AddTermsAndConditionsAccepted = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddTermsAndConditionsAccepted = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_TERMS_AND_CONDITIONS_ACCEPTED, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //            ADD LINK
    //--------------------------------------------------------

    public static AddLink = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IAddLink = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.ADD_LINK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------




    //--------------------------------------------------------
    //            SET ADMIN RESOURCE PASSWORD
    //--------------------------------------------------------

    public static SetAdminResourcePassword = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: ISetAdminResourcePassword = req.body;

        bcrypt.hash(data.password, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                response.stat = "error";
                response.error = "failed to convert password to secure format";
                return res.send(response);
            }

            data.password = hashedPassword;

            dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.SET_ADMIN_RESOURCE_PASSWORD, data), (error, result) => {

                if (error) {
                    console.log(error.sqlMessage);
                    response.stat = "error";
                    response.error = error.message;
                }

                return res.json(response);

            });
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------


    //--------------------------------------------------------
    //            APPROVE LINK
    //--------------------------------------------------------

    public static ApproveLink = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: IMarkLinkForDeletion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.APPROVE_LINK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //            CHECK TERMS AND CONDITIONS ACCEPTED
    //--------------------------------------------------------

    public static CheckTermsAndConditionsAccepted = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: {},
            error: ""
        }

        let data: ICheckTermsAndConditionsAccepted = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.CHECK_TERMS_AND_CONDITIONS_ACCEPTED, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE STAFF
    //--------------------------------------------------------

    public static UpdateStaff = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateStaff = req.body;

        console.log(data);

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_STAFF, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE COURSE
    //--------------------------------------------------------

    public static UpdateCourse = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateCourse = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_COURSE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE COURSE TOPIC
    //--------------------------------------------------------

    public static UpdateCourseTopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateCourseTopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_COURSE_TOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      APPROVE COURSE MATERIAL
    //--------------------------------------------------------

    public static ApproveCourseMaterial = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IApproveCourseMaterial = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.APPROVE_COURSE_MATERIAL, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE STUDENT
    //--------------------------------------------------------

    public static UpdateStudent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateStudent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_STUDENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE STUDENT COURSE
    //--------------------------------------------------------

    public static UpdateStudentCourse = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateStudentCourse = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_STUDENT_COURSE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE STUDENT ASSIGNMENT MARK
    //--------------------------------------------------------

    public static UpdateStudentAssignmentMark = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateStudentAssignmentMark = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_STUDENT_ASSIGNMENT_MARK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE STUDENT ASSESSMENT MARK
    //--------------------------------------------------------

    public static UpdateStudentAssessmentMark = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateStudentAssessmentMark = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_STUDENT_ASSESSMENT_MARK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      MARK MATERIAL FOR DELETION
    //--------------------------------------------------------

    public static MarkMaterialForDeletion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IMarkMaterialForDeletion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.MARK_MATERIAL_FOR_DELETION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------


    //--------------------------------------------------------
    //      UNMARK MATERIAL FOR DELETION
    //--------------------------------------------------------

    public static UnmarkMaterialForDeletion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUnmarkMaterialForDeletion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UNMARK_MATERIAL_FOR_DELETION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });

    }

    //--------------------------------------------------------
    //--------------------------------------------------------


    //--------------------------------------------------------
    //      CHANGE PASSWORD
    //--------------------------------------------------------

    public static ChangePassword = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IChangePassword = req.body;

        bcrypt.hash(data.newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                response.stat = "error";
                response.error = "failed to convert password to secure format";
                return res.send(response);
            }

            data.newPassword = hashedPassword;

            dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.CHANGE_PASSWORD, data), (error, result) => {

                if (error) {
                    console.log(error.sqlMessage);
                    response.stat = "error";
                    response.error = error.message;
                } else {
                    if (result[0][0].RESULT !== "ok") {
                        response.stat = "error";
                        response.error = result[0][0].RESULT;
                    }
                }

                return res.json(response);

            });
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      UPDATE STUDENT QUIZ STRUCTURED ANSWER MARK
    //--------------------------------------------------------

    public static UpdateStudentQuizStructuredAnswerMark = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateStudentQuizStructuredAnswerMark = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_STUDENT_QUIZ_STRUCTURED_ANSWER_MARK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              MARK STUDENT QUIZ
    //--------------------------------------------------------

    public static MarkStudentQuiz = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IMarkStudentQuiz = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.MARK_STUDENT_QUIZ, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              MARK MESSAGES AS READ
    //--------------------------------------------------------

    public static MarkMessagesAsRead = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IMarkMessagesAsRead = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.MARK_MESSAGES_AS_READ, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              UPDATE QUIZ
    //--------------------------------------------------------

    public static UpdateQuiz = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateQuiz = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_QUIZ, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              END STUDENT QUIZ ATTEMPT
    //--------------------------------------------------------

    public static EndStudentQuizAttempt = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IEndStudentQuizAttempt = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.END_STUDENT_QUIZ_ATTEMPT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              UPDATE PARENT
    //--------------------------------------------------------

    public static UpdateParent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateParent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_PARENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              UPDATE PARENT FINANCES BALANCE
    //--------------------------------------------------------

    public static UpdateParentFinancesBalance = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateParentFinancesBalance = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_PARENT_FINANCES_BALANCE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //         UPDATE PARENT FINANCES NEXT PAYMENT DUE
    //--------------------------------------------------------

    public static UpdateParentFinancesNextPaymentDue = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IUpdateParentFinancesNextPaymentDate = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UPDATE_PARENT_FINANCES_NEXT_PAYMENT_DATE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              MARK LINK FOR DELETION
    //--------------------------------------------------------

    public static MarkLinkForDeletion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IMarkLinkForDeletion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.MARK_LINK_FOR_DELETION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //              UNMARK LINK FOR DELETION
    //--------------------------------------------------------

    public static UnMarkLinkForDeletion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IMarkLinkForDeletion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.UNMARK_LINK_FOR_DELETION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);
        });
    }

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE COURSE 
    //--------------------------------------------------------

    public static DeleteCourse = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteCourse = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_COURSE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE COURSE TOPIC 
    //--------------------------------------------------------

    public static DeleteCourseTopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteCourseTopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_COURSE_TOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE COURSE MATERIAL 
    //--------------------------------------------------------

    public static DeleteCourseMaterial = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteCourseMaterial = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_COURSE_MATERIAL, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE COURSE ASSIGNMENT 
    //--------------------------------------------------------

    public static DeleteCourseAssignment = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteCourseAssignment = req.body;

        console.log(data.path);

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_COURSE_ASSIGNMENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE COURSE ANNOUNCEMENT 
    //--------------------------------------------------------

    public static DeleteCourseAnnouncement = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteCourseAnnouncement = req.body;


        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_COURSE_ANNOUNCEMENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE COURSE ASSESSMENT 
    //--------------------------------------------------------

    public static DeleteCourseAssessment = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteCourseAssessment = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_COURSE_ASSESSMENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE STAFF 
    //--------------------------------------------------------

    public static DeleteStaff = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteStaff = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_STAFF, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE STUDENT 
    //--------------------------------------------------------

    public static DeleteStudent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteStudent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_STUDENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE STUDENT ASSIGNMENT 
    //--------------------------------------------------------

    public static DeleteStudentAssignment = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteStudentAssignment = req.body;

        console.log(data.path);

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_STUDENT_ASSIGNMENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE STUDENT COURSE 
    //--------------------------------------------------------

    public static DeleteStudentCourse = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteStudentCourse = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_STUDENT_COURSE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE NEWS EVENT 
    //--------------------------------------------------------

    public static DeleteNewsEvent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteNewsEvent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_NEWS_EVENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      REMOVE COURSE TAUGHT 
    //--------------------------------------------------------

    public static RemoveCourseTaught = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IRemoveCourseTaught = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.REMOVE_COURSE_TAUGHT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE HOME FILE 
    //--------------------------------------------------------

    public static DeleteHomeFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteHomeFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_HOME_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE RESOURCE FILE 
    //--------------------------------------------------------

    public static DeleteResourceFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteResourceFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_RESOURCE_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE RESOURCE TOPIC 
    //--------------------------------------------------------

    public static DeleteResourceTopic = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteResourceTopic = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_RESOURCE_TOPIC, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE QUIZ 
    //--------------------------------------------------------

    public static DeleteQuiz = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteQuiz = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_QUIZ, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE QUIZ QUESTION 
    //--------------------------------------------------------

    public static DeleteQuizQuestion = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteQuizQuestion = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_QUIZ_QUESTION, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE QUIZ ANSWER 
    //--------------------------------------------------------

    public static DeleteQuizAnswer = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteQuizAnswer = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_QUIZ_ANSWER, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE STUDENT QUIZ FILE 
    //--------------------------------------------------------

    public static DeleteStudentQuizFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteStudentQuizFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_STUDENT_QUIZ_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE PARENT 
    //--------------------------------------------------------

    public static DeleteParent = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteParent = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_PARENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE FILE FOR PARENTS 
    //--------------------------------------------------------

    public static DeleteParentFinancialStatement = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_PARENT_FINANCIAL_STATEMENT, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            }
            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE PARENT FINANCIAL STATEMENT 
    //--------------------------------------------------------

    public static DeleteFileForParents = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteFileForParents = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_FILE_FOR_PARENTS, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE PARENT REGISTRATION REQUEST 
    //--------------------------------------------------------

    public static DeleteParentRegistrationRequest = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteParentRegistrationRequest = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_PARENT_REGISTRATION_REQUEST, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //      DELETE TERMS AND CONDITIONS FILE 
    //--------------------------------------------------------

    public static DeleteTermsAndConditionsFile = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteFile = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_TERMS_AND_CONDITIONS_FILE, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //                  DELETE LINK 
    //--------------------------------------------------------

    public static DeleteLink = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteLink = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_LINK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------



    //--------------------------------------------------------
    //                  DELETE ASSIGNMENT LINK 
    //--------------------------------------------------------

    public static DeleteAssignmentLink = (req: Request, res: Response) => {

        let response: IResponse = {
            stat: "ok",
            token: "",
            data: "",
            error: ""
        }

        let data: IDeleteAssignmentLink = req.body;

        dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_ASSIGNMENT_LINK, data), (error, result) => {

            if (error) {
                console.log(error.sqlMessage);
                response.stat = "error";
                response.error = error.message;
            } else {
                if (result[0][0].RESULT !== "ok") {
                    response.stat = "error";
                    response.error = result[0][0].RESULT;
                }
            }

            return res.json(response);

        });

    };

    //--------------------------------------------------------
    //--------------------------------------------------------
}


export default PostEndpoints;
