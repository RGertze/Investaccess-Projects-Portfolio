import dotenv from "dotenv";

//----------    DB IMPORTS   ------------

import mysql from "mysql";

//----------    INTERFACE/ENUM IMPORTS   ------------

import { IAddCourse, IAddCourseAnnouncement, IAddCourseAssignment, IAddCourseMaterial, IAddStaff, IAddStudent, IAddStudentAssignment, IDeleteCourseAssignment, IDeleteStudentAssignment, IGenerateInitialStudentAssignmentMarkRecords, IGetAllStudents, IGetAssignmentMark, IGetAssignmentMarksByCourse, IGetAssignmentPath, IGetCourseAnnouncements, IGetCourseAssignments, IGetCoursesByGrade, IGetCoursesTakenByStudent, IGetCoursesShort, IGetCoursesTaughtByStaff, IGetEnrolled, IGetMaterialByTopic, IGetMaterialPath, IGetStaffMembers, IGetStaffShort, IGetStudentAssignmentPaths, IGetStudentsByGrade, IGetStudentsInCourse, ILogin, ISearchAllStudents, ISearchStaff, ISearchStudentsInCourse, IUpdateCourseAssignment, IUpdateStudentAssignment, IUpdateStudentAssignmentMark, IAddStudentCourse, IGetCoursesByGradeShort, IDeleteStudentCourse, IGetCoursesTaughtByStaffDetailed, IGetFilesToDelete, IDeleteFilesToDelete, IDeleteSingleFileToDelete, IGetStudentDetails, IGetStaffDetails, IGetCourseMarks, IDeleteStudent, IDeleteStaff, IAddStudentReport, IGetStudentReports, IUpdateStudent, IUpdateStaff, IGetCourseTopics, IAddCourseTopic, IUpdateStudentCourse, IGetStudentsWithMerritsByCourse, IDeleteCourse, IUpdateCourse, IAddNewsEvent, IGetNewsEvents, IRemoveCourseTaught, IGetParentEmails, IGetSignedGetUrl, IGetCourseOverview, IApproveCourseMaterial, IDeleteCourseMaterial, IChangePassword, IDeleteNewsEvent, IMarkMaterialForDeletion, IUnmarkMaterialForDeletion, IDeleteCourseTopic, IAddAllStudentCourses, IGetAllMaterials, IAddPosition, IAddSuggestion, IGetSubtopics, IAddSubtopic, IUpdateCourseTopic, IGetAllMessagesBetweenUsers, IAddDirectMessage, IGetUsersToMessage, IGetHomeFilesBySection, IAddHomeFile, IDeleteHomeFile, IGetOtherCourseStaff, IAddCourseStaff, IGetCourseAssessments, IGetAssessmentMarksByCourse, IAddCourseAssessment, IAddStudentAssessmentMark, IDeleteCourseAssessment, IUpdateStudentAssessmentMark, IGetRootResourceTopicsForStaff, IGetRootResourceTopicsForStudents, IGetSubResourceTopicsForStaff, IGetSubResourceTopicsForStudents, IGetResourceFilesByTopic, IAddRootResourceTopic, IAddSubResourceTopic, IAddResourceFile, IAddQuiz, IAddQuizQuestion, IAddQuizAnswer, IGetQuizzesByCourse, IGetQuizQuestions, IGetQuizAnswers, IDeleteQuiz, IDeleteQuizQuestion, IDeleteQuizAnswer, IAddStudentQuiz, IGetStudentQuizAttempts, IAddStudentQuizUnstructuredAnswer, IAddStudentQuizStructuredAnswer, IAddStudentQuizFile, IGetStudentQuizFiles, IGetStudentQuizUnstructuredAnswers, IGetStudentQuizStructuredAnswer, IDeleteStudentQuizFile, IUpdateStudentQuizStructuredAnswerMark, IMarkStudentQuiz, IEndStudentQuizAttempt, IAddParent, IGetAllParents, IUpdateParent, IDeleteParent, IAddFileForParents, IGetAllTimetables, IGetAllCalendars, IDeleteFileForParents, IGetParentDetails, IAddParentFinancialStatement, IGetParentFinances, IGetParentFinancialStatements, IUpdateParentFinancesBalance, IUpdateParentFinancesNextPaymentDate, IGetAllSupportDocuments, IAddParentStudent, IGetParentStudents, IAddParentRegistrationRequest, IGetParentRegistrationRequests, IGetParentRegistrationStudentInfo, IDeleteParentRegistrationRequest, IAddTermsAndConditionsFile, IAddTermsAndConditionsAccepted, IGetTermsAndConditionsFiles, ICheckTermsAndConditionsAccepted, IDeleteFile, IAddLink, IDeleteLink, IMarkLinkForDeletion, IGetLinksForMaterials, IGetLinksForAssignments, IDeleteAssignmentLink, IGetHomeSectionLinks, IDeleteResourceFile, IDeleteResourceTopic, IDeleteCourseAnnouncement, ICheckForUnreadMessages, IMarkMessagesAsRead, IUpdateQuiz, ISetAdminResourcePassword } from "./interfaces";


//----------------------------------------------
//      SETUP DOTENV
//----------------------------------------------

dotenv.config();    // load values from .env file

//----------------------------------------------
//----------------------------------------------



//--------------------------------------------
//          QUERY ENUMS
//--------------------------------------------

export enum QUERY_PROCS {
    LOGIN = "call sp_validateLogin",
    GET_ADMIN_RESOURCE_PASSWORD = "call sp_getAdminResourcePassword",
    GET_ENROLLED = "call sp_getEnrolledCourses",
    GET_COURSES_BY_GRADE = "call sp_getCoursesByGrade",
    GET_COURSE_OVERVIEW = "call sp_getCourseOverview",
    GET_COURSES_TAKEN_BY_STUDENT = "call sp_getCoursesTakenByStudent",
    GET_COURSES_SHORT = "call sp_getCoursesShort",
    GET_COURSES_BY_GRADE_SHORT = "call sp_getCoursesByGradeShort",
    GET_COURSE_TOPICS = "call sp_getCourseTopics",
    GET_SUBTOPICS = "call sp_getSubtopics",
    GET_MATERIALS_BY_TOPIC = "call sp_getMaterialByTopic",
    GET_MATERIALS_BY_TOPIC_UNAPPROVED = "call sp_getMaterialByTopicUnapproved",
    GET_ALL_MATERIALS_UNAPPROVED = "call sp_getAllMaterialUnapproved",
    GET_MATERIALS_BY_TOPIC_MARKED_FOR_DELETION = "call sp_getMaterialByTopicToBeDeleted",
    GET_ALL_MATERIALS_MARKED_FOR_DELETION = "call sp_getAllMaterialsToBeDeleted",
    GET_MATERIAL_PATH = "call sp_getMaterialPath",
    GET_COURSE_ASSIGNMENTS = "call sp_getCourseAssignments",
    GET_COURSE_ASSESSMENTS = "call sp_getCourseAssessments",
    GET_ASSIGNMENT_PATH = "call sp_getAssignmentPath",
    GET_STUDENT_ASSIGNMENT_PATHS = "call sp_getStudentAssignmentPaths",
    GET_ASSIGNMENT_MARKS_BY_COURSE = "call sp_getAssignmentMarksByCourse",
    GET_ASSESSMENT_MARKS_BY_COURSE = "call sp_getAssessmentMarksByCourse",
    GET_ASSIGNMENT_MARK = "call sp_getAssignmentMark",
    GET_COURSE_MARKS = "call sp_getCourseMarks",
    GET_ALL_STUDENTS = "call sp_getAllStudents",
    GET_ALL_STUDENTS_SHORT = "call sp_getAllStudentsShort",
    GET_ALL_STUDENTS_NOT_REGISTERED = "call sp_getAllStudentsNotRegistered",
    GET_STUDENTS_BY_GRADE = "call sp_getStudentsByGrade",
    GET_STUDENTS_IN_COURSE = "call sp_getStudentsInCourse",
    GET_STUDENTS_WITH_MERRITS_BY_COURSE = "call sp_getStudentsWithMerritsByCourse",
    GET_STUDENT_REPORTS = "call sp_getStudentReports",
    GET_COURSE_ANNOUNCEMENTS = "call sp_getCourseAnnouncements",
    GET_STAFF_MEMBERS = "call sp_getStaffMembers",
    GET_STAFF_SHORT = "call sp_getStaffShort",
    GET_OTHER_COURSE_STAFF = "call sp_getOtherCourseStaff",
    GET_STUDENT_DETAILS = "call sp_getStudentDetails",
    GET_STAFF_DETAILS = "call sp_getStaffDetails",
    GET_COURSES_TAUGHT_BY_STAFF = "call sp_getCoursesTaughtByStaff",
    GET_COURSES_TAUGHT_BY_STAFF_DETAILED = "call sp_getCoursesTaughtByStaffDetailed",
    GET_POSITIONS_SHORT = "call sp_getJobPositionsShort",
    GET_FILES_TO_DELETE = "call sp_getFilesToDelete",
    GET_NEWS_EVENTS = "call sp_getNewsEvents",
    GET_PARENT_EMAILS = "call sp_getParentEmails",
    GET_ALL_MESSAGES_BETWEEN_USERS = "call sp_getAllMessagesBetweenUsers",
    GET_LAST_MESSAGE_SENT = "call sp_getLastMessageSent",
    GET_USERS_TO_MESSAGE = "call sp_getUsersToMessage",
    GET_HOME_FILES_BY_SECTION = "call sp_getHomeFilesBySection",

    GET_ROOT_RESOURCE_TOPICS_FOR_STAFF = "call sp_getRootResourceTopicsForStaff",
    GET_ROOT_RESOURCE_TOPICS_FOR_STUDENTS = "call sp_getRootResourceTopicsForStudents",
    GET_SUB_RESOURCE_TOPICS_FOR_STAFF = "call sp_getSubResourceTopicsForStaff",
    GET_SUB_RESOURCE_TOPICS_FOR_STUDENTS = "call sp_getSubResourceTopicsForStudents",
    GET_RESOURCE_FILES_BY_TOPIC = "call sp_getResourceFilesByTopic",

    GET_QUIZZES_BY_COURSE = "call sp_getQuizzesByCourse",
    GET_QUIZ_QUESTIONS = "call sp_getQuizQuestions",
    GET_QUIZ_ANSWERS = "call sp_getQuizAnswers",

    GET_STUDENT_QUIZ_ATTEMPTS = "call sp_getStudentQuizAttempts",
    GET_STUDENT_QUIZ_FILES = "call sp_getStudentQuizFiles",
    GET_STUDENT_QUIZ_UNSTRUCTURED_ANSWERS = "call sp_getStudentQuizUnstructuredAnswers",
    GET_STUDENT_QUIZ_STRUCTURED_ANSWER = "call sp_getStudentQuizStructuredAnswer",

    GET_ALL_PARENTS = "call sp_getAllParents",
    GET_PARENT_DETAILS = "call sp_getParentDetails",
    GET_ALL_TIMETABLES = "call sp_getAllTimetables",
    GET_ALL_CALENDARS = "call sp_getAllCalendars",
    GET_ALL_SUPPORT_DOCUMENTS = "call sp_getAllSupportDocuments",
    GET_PARENT_FINANCES = "call sp_getParentFinances",
    GET_PARENT_FINANCIAL_STATEMENTS = "call sp_getParentFinancialStatements",
    GET_PARENT_STUDENTS = "call sp_getParentStudents",
    GET_PARENT_REGISTRATION_REQUESTS = "call sp_getParentRegistrationRequests",
    GET_PARENT_REGISTRATION_STUDENT_INFO = "call sp_getParentRegistrationStudentInfo",

    GET_TERMS_AND_CONDITIONS_FILES = "call sp_getTermsAndConditionsFiles",

    GET_LINKS_MARKED_FOR_DELETION = "call sp_getLinksMarkedForDeletion",
    GET_ALL_LINKS_MARKED_FOR_DELETION = "call sp_getAllLinksMarkedForDeletion",
    GET_UNAPPROVED_LINKS_BY_TOPIC = "call sp_getLinksByTopicUnapproved ",
    GET_ALL_UNAPPROVED_LINKS = "call sp_getLinksUnapproved",
    GET_APPROVED_LINKS_BY_TOPIC = "call sp_getLinksByTopicApproved",
    GET_LINKS_BY_TOPIC = "call sp_getLinksByTopic",
    GET_COURSE_ASSIGNMENT_LINKS = "call sp_getCourseAssignmentLinks",
    GET_HOME_SECTION_LINKS = "call sp_getHomeSectionLinks",

    CHECK_NEWS_IMG_PATH = "call sp_checkNewsImgPath",
    CHEC_HOME_FILE_PATH = "call sp_checkHomeFilePath",

    CHECK_FOR_UNREAD_MESSAGES = "call sp_checkUnreadMessages",

    CHECK_TERMS_AND_CONDITIONS_ACCEPTED = "call sp_checkTermsAndConditionsAccepted",

    SEARCH_ALL_STUDENTS = "call sp_searchAllStudents",
    SEARCH_STUDENTS_IN_COURSE = "call sp_searchStudentsInCourse",
    SEARCH_STAFF = "call sp_searchStaffMembers",
    ADD_COURSE = "call sp_addCourse",
    ADD_COURSE_STAFF = "call sp_addCourseStaff",
    ADD_COURSE_TOPIC = "call sp_addCourseTopic",
    ADD_SUBTOPIC = "call sp_addSubtopic",
    ADD_COURSE_ANNOUNCEMENT = "call sp_addCourseAnnouncement",
    ADD_COURSE_MATERIAL = "call sp_addCourseMaterial",
    ADD_COURSE_ASSIGNMENT = "call sp_addCourseAssignment",
    ADD_COURSE_ASSESSMENT = "call sp_addCourseAssessment",
    ADD_COURSE_ASSESSMENT_MARK = "call sp_addStudentAssessmentMark",
    ADD_STUDENT_ASSIGNMENT = "call sp_addStudentAssignmentFile",
    ADD_POSITION = "call sp_addJobPosition",
    ADD_STAFF = "call sp_addStaff",
    ADD_STUDENT = "call sp_addStudent",
    ADD_STUDENT_REPORT = "call sp_addStudentReport",
    ADD_STUDENT_COURSE = "call sp_addStudentCourse",
    ADD_ALL_STUDENT_COURSES = "call sp_addAllStudentCourses",
    ADD_NEWS_EVENT = "call sp_addNewsEvent",
    ADD_SUGGESTION = "call sp_addSuggestion",
    ADD_DIRECT_MESSAGE = "call sp_addDirectMessage",
    ADD_HOME_FILE = "call sp_addHomeFile",

    ADD_ROOT_RESOURCE_TOPIC = "call sp_addRootResourceTopic",
    ADD_SUB_RESOURCE_TOPIC = "call sp_addSubResourceTopic",
    ADD_RESOURCE_FILE = "call sp_addResourceFile",

    ADD_QUIZ = "call sp_addQuiz",
    ADD_QUIZ_QUESTION = "call sp_addQuizQuestion",
    ADD_QUIZ_ANSWER = "call sp_addQuizAnswer",

    ADD_STUDENT_QUIZ = "call sp_addStudentQuiz",
    ADD_STUDENT_QUIZ_UNSTRUCTURED_ANSWER = "call sp_addStudentQuizUnstructuredAnswer",
    ADD_STUDENT_QUIZ_STRUCTURED_ANSWER = "call sp_addStudentQuizStructuredAnswer",
    ADD_STUDENT_QUIZ_FILE = "call sp_addStudentQuizFile",

    ADD_PARENT = "call sp_addParent",
    ADD_FILE_FOR_PARENTS = "call sp_addFileForParents",
    ADD_PARENT_FINANCIAL_STATEMENT = "call sp_addParentFinancialStatement",
    ADD_PARENT_STUDENT = "call sp_addParentStudent",
    ADD_PARENT_REGISTRATION_REQUEST = "call sp_addParentRegistrationRequest",

    ADD_TERMS_AND_CONDITIONS_FILE = "call sp_addTermsAndConditionsFile",
    ADD_TERMS_AND_CONDITIONS_ACCEPTED = "call sp_addTermsAndConditionsAccepted",

    ADD_LINK = "call sp_addLink",

    APPROVE_COURSE_MATERIAL = "call sp_approveCourseMaterial",
    APPROVE_LINK = "call sp_approveLink",

    SET_ADMIN_RESOURCE_PASSWORD = "call sp_setAdminResourcePassword",

    UPDATE_COURSE_TOPIC = "call sp_updateCourseTopic",
    UPDATE_STAFF = "call sp_updateStaff",
    UPDATE_STUDENT = "call sp_updateStudent",
    UPDATE_STUDENT_COURSE = "call sp_updateStudentCourse",
    UPDATE_COURSE = "call sp_updateCourse",
    UPDATE_COURSE_MATERIAL = "call sp_updateCourseMaterial",
    UPDATE_COURSE_ASSIGNMENT = "call sp_updateCourseAssignment",
    UPDATE_STUDENT_ASSIGNMENT = "call sp_updateStudentAssignment",
    UPDATE_STUDENT_ASSIGNMENT_MARK = "call sp_updateStudentAssignmentMark",
    UPDATE_STUDENT_ASSESSMENT_MARK = "call sp_updateStudentAssessmentMark",
    MARK_MATERIAL_FOR_DELETION = "call sp_markMaterialForDeletion",
    UNMARK_MATERIAL_FOR_DELETION = "call sp_unmarkMaterialForDeletion",
    CHANGE_PASSWORD = "call sp_changePassword",

    MARK_MESSAGES_AS_READ = "call sp_markMessagesAsRead",

    UPDATE_QUIZ = "call sp_updateQuiz",
    UPDATE_STUDENT_QUIZ_STRUCTURED_ANSWER_MARK = "call sp_updateStudentQuizStructuredAnswerMark",
    MARK_STUDENT_QUIZ = "call sp_calculateStudentQuizAttemptGrade",
    END_STUDENT_QUIZ_ATTEMPT = "call sp_endStudentQuizAttempt",

    UPDATE_PARENT = "call sp_updateParent",
    UPDATE_PARENT_FINANCES_BALANCE = "call sp_updateParentFinancesBalance",
    UPDATE_PARENT_FINANCES_NEXT_PAYMENT_DATE = "call sp_updateParentFinancesNextPaymentDate",

    MARK_LINK_FOR_DELETION = "call sp_markLinkForDeletion",
    UNMARK_LINK_FOR_DELETION = "call sp_unMarkLinkForDeletion",

    DELETE_COURSE = "call sp_deleteCourse",
    DELETE_COURSE_TOPIC = "call sp_deleteCourseTopic",
    DELETE_COURSE_MATERIAL = "call sp_deleteCourseMaterial",
    DELETE_COURSE_ASSIGNMENT = "call sp_deleteCourseAssignment",
    DELETE_COURSE_ANNOUNCEMENT = "call sp_deleteCourseAnnouncement",
    DELETE_COURSE_ASSESSMENT = "call sp_deleteCourseAssessment",
    DELETE_STAFF = "call sp_deleteStaff",
    DELETE_STUDENT = "call sp_deleteStudent",
    DELETE_STUDENT_ASSIGNMENT = "call sp_deleteStudentAssignment",
    DELETE_STUDENT_COURSE = "call sp_deleteStudentCourse",
    DELETE_FILES_TO_DELETE = "call sp_deleteFilesToDelete",
    DELETE_SINGLE_FILE_TO_DELETE = "call sp_deleteSingleFileToDelete",
    DELETE_NEWS_EVENT = "call sp_deleteNewsEvents",
    DELETE_HOME_FILE = "call sp_deleteHomeFile",
    REMOVE_COURSE_TAUGHT = "call sp_removeCourseTaught",

    DELETE_RESOURCE_FILE = "call sp_deleteResourceFile",
    DELETE_RESOURCE_TOPIC = "call sp_deleteResourceTopic",

    DELETE_QUIZ = "call sp_deleteQuiz",
    DELETE_QUIZ_QUESTION = "call sp_deleteQuizQuestion",
    DELETE_QUIZ_ANSWER = "call sp_deleteQuizAnswer",

    DELETE_ALL_QUESTION_ANSWERS = "call sp_deleteAllQuestionAnswers",
    DELETE_STUDENT_QUIZ_FILE = "call sp_deleteStudentQuizFile",

    DELETE_PARENT = "call sp_deleteParent",
    DELETE_FILE_FOR_PARENTS = "call sp_deleteFileForParents",
    DELETE_PARENT_FINANCIAL_STATEMENT = "call sp_deleteParentFinancialStatement",
    DELETE_PARENT_REGISTRATION_REQUEST = "call sp_deleteParentRegistrationRequest",
    DELETE_TERMS_AND_CONDITIONS_FILE = "call sp_deleteTermsAndConditionsFile",

    DELETE_LINK = "call sp_deleteLink",
    DELETE_ASSIGNMENT_LINK = "call sp_deleteAssignmentLink",

    GENERATE_INITIAL_STUDENT_ASSIGNMENT_MARK_RECORDS = "call sp_generateStudentAssignmentMarkRecords"
}

//--------------------------------------------
//--------------------------------------------



//--------------------------------------------
//      QUERY BUILDER CLASS DEFINITION
//--------------------------------------------

export class QueryBuilder {

    //--------------------------------------------
    //      GENERAL PUBLIC QRY BUILD FUNC
    //--------------------------------------------

    public static buildQry(qType: QUERY_PROCS, data: any) {
        switch (qType) {

            //-----     LOGIN    -----

            case QUERY_PROCS.LOGIN:
                return this.loginQry(data);

            //-----     GET ADMIN RESOURCE PASSWORD    -----

            case QUERY_PROCS.GET_ADMIN_RESOURCE_PASSWORD:
                let getAdminResPword = (data as number);
                return `${QUERY_PROCS.GET_ADMIN_RESOURCE_PASSWORD}(${getAdminResPword});`;

            //-----     GET ENROLLED    -----

            case QUERY_PROCS.GET_ENROLLED:
                return this.getEnrolledQry(data);

            //-----     GET COURSES BY GRADE    -----

            case QUERY_PROCS.GET_COURSES_BY_GRADE:
                return this.getCoursesByGradeQry(data);

            //-----     GET COURSE OVERVIEW    -----

            case QUERY_PROCS.GET_COURSE_OVERVIEW:
                return this.getCourseOverview(data);

            //-----     GET COURSES BY STUDENT    -----

            case QUERY_PROCS.GET_COURSES_TAKEN_BY_STUDENT:
                return this.getCoursesTakenByStudent(data);

            //-----     GET COURSES SHORT    -----

            case QUERY_PROCS.GET_COURSES_SHORT:
                return this.getCoursesShort(data);

            //-----     GET COURSES BY GRADE SHORT    -----

            case QUERY_PROCS.GET_COURSES_BY_GRADE_SHORT:
                return this.getCoursesByGradeShort(data);

            //-----     GET COURSE TOPICS    -----

            case QUERY_PROCS.GET_COURSE_TOPICS:
                return this.getCourseTopics(data);

            //-----     GET SUBTOPICS    -----

            case QUERY_PROCS.GET_SUBTOPICS:
                return this.getSubtopics(data);

            //-----     GET MATERIALS BY TOPIC    -----

            case QUERY_PROCS.GET_MATERIALS_BY_TOPIC:
                return this.getMaterialsByTopic(data);

            //-----     GET MATERIALS BY TOPIC UNAPPROVED    -----

            case QUERY_PROCS.GET_MATERIALS_BY_TOPIC_UNAPPROVED:
                return this.getMaterialsByTopicUnapproved(data);

            //-----     GET ALL MATERIALS UNAPPROVED    -----

            case QUERY_PROCS.GET_ALL_MATERIALS_UNAPPROVED:
                return this.getAllMaterialsUnapproved(data);

            //-----     GET MATERIALS BY TOPIC MARKED FOR DELETION    -----

            case QUERY_PROCS.GET_MATERIALS_BY_TOPIC_MARKED_FOR_DELETION:
                return this.getMaterialsByMarkedForDeletion(data);

            //-----     GET ALL MATERIALS MARKED FOR DELETION    -----

            case QUERY_PROCS.GET_ALL_MATERIALS_MARKED_FOR_DELETION:
                return this.getAllMaterialsMarkedForDeletion(data);

            //-----     GET MATERIAL PATH    -----

            case QUERY_PROCS.GET_MATERIAL_PATH:
                return this.getMaterialPath(data);

            //-----     GET COURSE ASSIGNMENTS    -----

            case QUERY_PROCS.GET_COURSE_ASSIGNMENTS:
                return this.getCourseAssignments(data);

            //-----     GET COURSE ASSESSMENTS    -----

            case QUERY_PROCS.GET_COURSE_ASSESSMENTS:
                return this.getCourseAssessments(data);

            //-----     GET COURSE ANNOUNCEMENTS    -----

            case QUERY_PROCS.GET_COURSE_ANNOUNCEMENTS:
                return this.getCourseAnnouncements(data);

            //-----     GET ASSIGNMENT PATH    -----

            case QUERY_PROCS.GET_ASSIGNMENT_PATH:
                return this.getAssignmentPath(data);

            //-----     GET STUDENT ASSIGNMENT PATHS    -----

            case QUERY_PROCS.GET_STUDENT_ASSIGNMENT_PATHS:
                return this.getStudentAssignmentPaths(data);

            //-----     GET ASSIGNMENT MARKS    -----

            case QUERY_PROCS.GET_ASSIGNMENT_MARKS_BY_COURSE:
                return this.getAssignmentMarksByCourse(data);

            //-----     GET ASSESSMENT MARKS    -----

            case QUERY_PROCS.GET_ASSESSMENT_MARKS_BY_COURSE:
                return this.getAssessmentMarksByCourse(data);

            //-----     GET SPECIFIC ASSIGNMENT MARK    -----

            case QUERY_PROCS.GET_ASSIGNMENT_MARK:
                return this.getAssignmentMark(data);

            //-----     GET COURSE MARKS    -----

            case QUERY_PROCS.GET_COURSE_MARKS:
                return this.getCourseMarks(data);

            //-----     GET STUDENTS IN COURSE    -----

            case QUERY_PROCS.GET_STUDENTS_IN_COURSE:
                return this.getStudentsInCourse(data);

            //-----     GET STUDENTS BY GRADE    -----

            case QUERY_PROCS.GET_STUDENTS_BY_GRADE:
                return this.getStudentsByGrade(data);

            //-----     GET ALL STUDENTS    -----

            case QUERY_PROCS.GET_ALL_STUDENTS:
                return this.getAllStudents(data);

            //-----     GET ALL STUDENTS SHORT    -----

            case QUERY_PROCS.GET_ALL_STUDENTS_SHORT:
                return this.getAllStudentsShort(data);

            //-----     GET ALL STUDENTS NOT REGISTERED    -----

            case QUERY_PROCS.GET_ALL_STUDENTS_NOT_REGISTERED:
                return this.getAllStudentsNotRegistered(data);

            //-----     GET STUDENTS WITH MERRITS BY COURSE    -----

            case QUERY_PROCS.GET_STUDENTS_WITH_MERRITS_BY_COURSE:
                return this.getStudentsWithMerritsByCourse(data);

            //-----     GET STUDENT REPORTS    -----

            case QUERY_PROCS.GET_STUDENT_REPORTS:
                return this.getStudentReports(data);

            //-----     GET STAFF MEMBERS    -----

            case QUERY_PROCS.GET_STAFF_MEMBERS:
                return this.getStaffMembers(data);

            //-----     GET SHORT VERSION OF STAFF    -----

            case QUERY_PROCS.GET_STAFF_SHORT:
                return this.getStaffShort(data);

            //-----     GET OTHER COURSE STAFF    -----

            case QUERY_PROCS.GET_OTHER_COURSE_STAFF:
                return this.getOtherCourseStaff(data);

            //-----     GET STUDENT DETAILS    -----

            case QUERY_PROCS.GET_STUDENT_DETAILS:
                return this.getStudentDetails(data);

            //-----     GET STAFF DETAILS    -----

            case QUERY_PROCS.GET_STAFF_DETAILS:
                return this.getStaffDetails(data);

            //-----     GET COURSES TAUGHT BY STAFF    -----

            case QUERY_PROCS.GET_COURSES_TAUGHT_BY_STAFF:
                return this.getCoursesTaughtByStaff(data);

            //-----     GET COURSES TAUGHT BY STAFF DETAILED    -----

            case QUERY_PROCS.GET_COURSES_TAUGHT_BY_STAFF_DETAILED:
                return this.getCoursesTaughtByStaffDetailed(data);

            //-----     GET POSITIONS SHORT    -----

            case QUERY_PROCS.GET_POSITIONS_SHORT:
                return this.getPositionsShort(data);

            //-----     GET FILES TO DELETE    -----

            case QUERY_PROCS.GET_FILES_TO_DELETE:
                return this.getFilesToDelete(data);

            //-----     GET NEWS EVENTS    -----

            case QUERY_PROCS.GET_NEWS_EVENTS:
                return this.getNewsEvents(data);

            //-----     GET PARENT EMAILS    -----

            case QUERY_PROCS.GET_PARENT_EMAILS:
                return this.getParentEmails(data);

            //-----     GET ALL MESSAGES FOR CHAT    -----

            case QUERY_PROCS.GET_ALL_MESSAGES_BETWEEN_USERS:
                return this.getAllMessagesBetweenUsers(data);

            //-----     GET LAST MESSAGE SENT    -----

            case QUERY_PROCS.GET_LAST_MESSAGE_SENT:
                return this.getLastMessageSent(data);

            //-----     GET CHAT USERS    -----

            case QUERY_PROCS.GET_USERS_TO_MESSAGE:
                return this.getUsersToMessage(data);

            //-----     GET HOME FILES BY SECTION    -----

            case QUERY_PROCS.GET_HOME_FILES_BY_SECTION:
                return this.getHomeFilesBySection(data);

            //-----     GET ROOT RESOURCE TOPICS FOR STAFF    -----

            case QUERY_PROCS.GET_ROOT_RESOURCE_TOPICS_FOR_STAFF:
                return this.getRootResourceTopicsForStaff(data);

            //-----     GET ROOT RESOURCE TOPICS FOR STUDENT    -----

            case QUERY_PROCS.GET_ROOT_RESOURCE_TOPICS_FOR_STUDENTS:
                return this.getRootResourceTopicsForStudents(data);

            //-----     GET SUB RESOURCE TOPICS FOR STAFF    -----

            case QUERY_PROCS.GET_SUB_RESOURCE_TOPICS_FOR_STAFF:
                return this.getSubResourceTopicsForStaff(data);

            //-----     GET SUB RESOURCE TOPICS FOR STUDENTS    -----

            case QUERY_PROCS.GET_SUB_RESOURCE_TOPICS_FOR_STUDENTS:
                return this.getSubResourceTopicsForStudents(data);

            //-----     GET RESOURCE FILES BY TOPIC    -----

            case QUERY_PROCS.GET_RESOURCE_FILES_BY_TOPIC:
                return this.getResourceFilesByTopic(data);

            //-----     GET QUIZZES BY COURSE    -----

            case QUERY_PROCS.GET_QUIZZES_BY_COURSE:
                return this.getQuizzesByCourse(data);

            //-----     GET QUIZ QUESTIONS    -----

            case QUERY_PROCS.GET_QUIZ_QUESTIONS:
                return this.getQuizQuestions(data);

            //-----     GET QUIZ ANSWERS    -----

            case QUERY_PROCS.GET_QUIZ_ANSWERS:
                return this.getQuizAnswers(data);

            //-----     GET STUDENT QUIZ ATTEMPTS    -----

            case QUERY_PROCS.GET_STUDENT_QUIZ_ATTEMPTS:
                return this.getStudentQuizAttempts(data);

            //-----     GET STUDENT QUIZ FILES    -----

            case QUERY_PROCS.GET_STUDENT_QUIZ_FILES:
                return this.getStudentQuizFiles(data);

            //-----     GET STUDENT QUIZ UNSTRUCTURED ANSWERS    -----

            case QUERY_PROCS.GET_STUDENT_QUIZ_UNSTRUCTURED_ANSWERS:
                return this.getStudentQuizUnstructuredAnswers(data);

            //-----     GET STUDENT QUIZ STRUCTURED ANSWER    -----

            case QUERY_PROCS.GET_STUDENT_QUIZ_STRUCTURED_ANSWER:
                return this.getStudentQuizStructuredAnswer(data);

            //-----     GET ALL PARENTS    -----

            case QUERY_PROCS.GET_ALL_PARENTS:
                return this.getAllParents(data);

            //-----     GET PARENT DETAILS    -----

            case QUERY_PROCS.GET_PARENT_DETAILS:
                return this.getParentDetails(data);

            //-----     GET ALL TIMETABLES    -----

            case QUERY_PROCS.GET_ALL_TIMETABLES:
                return this.getAllTimetables(data);

            //-----     GET ALL CALENDARS    -----

            case QUERY_PROCS.GET_ALL_CALENDARS:
                return this.getAllCalendars(data);

            //-----     GET ALL SUPPORT DOCUMENTS    -----

            case QUERY_PROCS.GET_ALL_SUPPORT_DOCUMENTS:
                return this.getAllSupportDocuments(data);

            //-----     GET PARENT FINANCES    -----

            case QUERY_PROCS.GET_PARENT_FINANCES:
                return this.getParentFinances(data);

            //-----     GET PARENT FINANCIAL STATEMENTS    -----

            case QUERY_PROCS.GET_PARENT_FINANCIAL_STATEMENTS:
                return this.getParentFinancialStatements(data);

            //-----     GET PARENT STUDENTS    -----

            case QUERY_PROCS.GET_PARENT_STUDENTS:
                return this.getParentStudents(data);

            //-----     GET PARENT REGISTRATION REQUESTS    -----

            case QUERY_PROCS.GET_PARENT_REGISTRATION_REQUESTS:
                return this.getParentRegistrationRequests(data);

            //-----     GET PARENT REGISTRATION STUDENT INFO    -----

            case QUERY_PROCS.GET_PARENT_REGISTRATION_STUDENT_INFO:
                return this.getParentRegistrationStudentInfo(data);

            //-----     GET TERMS AND CONDITIONS FILES    -----

            case QUERY_PROCS.GET_TERMS_AND_CONDITIONS_FILES:
                return this.getTermsAndConditionsFiles(data);

            //-----     GET LINKS MARKED FOR DELETION    -----

            case QUERY_PROCS.GET_LINKS_MARKED_FOR_DELETION:
                let getLinksToDelete = (data as IGetLinksForMaterials);
                return `${QUERY_PROCS.GET_LINKS_MARKED_FOR_DELETION}(${getLinksToDelete.topicID});`;

            //-----     GET ALL LINKS MARKED FOR DELETION    -----

            case QUERY_PROCS.GET_ALL_LINKS_MARKED_FOR_DELETION:
                return `${QUERY_PROCS.GET_ALL_LINKS_MARKED_FOR_DELETION}();`;

            //-----     GET UNAPPROVED LINKS BY TOPIC    -----

            case QUERY_PROCS.GET_UNAPPROVED_LINKS_BY_TOPIC:
                let unapprovedLinksByTopic = (data as IGetLinksForMaterials);
                return `${QUERY_PROCS.GET_UNAPPROVED_LINKS_BY_TOPIC}(${unapprovedLinksByTopic.topicID});`;

            //-----     GET ALL UNAPPROVED LINKS    -----

            case QUERY_PROCS.GET_ALL_UNAPPROVED_LINKS:
                return `${QUERY_PROCS.GET_ALL_UNAPPROVED_LINKS}();`;

            //-----     GET APPROVED LINKS BY TOPIC    -----

            case QUERY_PROCS.GET_APPROVED_LINKS_BY_TOPIC:
                let approvedLinksByTopic = (data as IGetLinksForMaterials);
                return `${QUERY_PROCS.GET_APPROVED_LINKS_BY_TOPIC}(${approvedLinksByTopic.topicID});`;

            //-----     GET LINKS BY TOPIC    -----

            case QUERY_PROCS.GET_LINKS_BY_TOPIC:
                let linksByTopic = (data as IGetLinksForMaterials);
                return `${QUERY_PROCS.GET_LINKS_BY_TOPIC}(${linksByTopic.topicID});`;

            //-----     GET COURSE ASSIGNMENT LINKS    -----

            case QUERY_PROCS.GET_COURSE_ASSIGNMENT_LINKS:
                let getAssignmentLinks = (data as IGetLinksForAssignments);
                return `${QUERY_PROCS.GET_COURSE_ASSIGNMENT_LINKS}("${getAssignmentLinks.assignmentPath}");`;

            //-----     GET HOME SECTION LINKS    -----

            case QUERY_PROCS.GET_HOME_SECTION_LINKS:
                let getHomeSectionLinks = (data as IGetHomeSectionLinks);
                return `${QUERY_PROCS.GET_HOME_SECTION_LINKS}(${getHomeSectionLinks.linkType});`;

            //-----     CHECK TERMS AND CONDITIONS ACCEPTED    -----

            case QUERY_PROCS.CHECK_TERMS_AND_CONDITIONS_ACCEPTED:
                return this.checkTermsAndConditionsAccepted(data);

            //-----     CHECK NEWS IMG PATH    -----

            case QUERY_PROCS.CHECK_NEWS_IMG_PATH:
                return this.checkNewsImgPath(data);

            //-----     CHECK HOME FILE PATH    -----

            case QUERY_PROCS.CHEC_HOME_FILE_PATH:
                return this.checkHomeFilePath(data);

            //-----     CHECK FOR UNREAD MESSAGES    -----

            case QUERY_PROCS.CHECK_FOR_UNREAD_MESSAGES:
                let checkForUnreadMessages = (data as ICheckForUnreadMessages);
                return `${QUERY_PROCS.CHECK_FOR_UNREAD_MESSAGES}(${checkForUnreadMessages.userID});`;

            //-----     SEARCH ALL STUDENTS    -----

            case QUERY_PROCS.SEARCH_ALL_STUDENTS:
                return this.searchAllStudents(data);

            //-----     SEARCH STUDENTS IN COURSE    -----

            case QUERY_PROCS.SEARCH_STUDENTS_IN_COURSE:
                return this.searchStudentsInCourse(data);

            //-----     SEARCH STAFF MEMBERS    -----

            case QUERY_PROCS.SEARCH_STAFF:
                return this.searchStaff(data);

            //-----     ADD COURSE     -----

            case QUERY_PROCS.ADD_COURSE:
                return this.addCourse(data);

            //-----     ADD COURSE STAFF     -----

            case QUERY_PROCS.ADD_COURSE_STAFF:
                return this.addCourseStaff(data);

            //-----     ADD COURSE TOPIC     -----

            case QUERY_PROCS.ADD_COURSE_TOPIC:
                return this.addCourseTopic(data);

            //-----     ADD SUBTOPIC     -----

            case QUERY_PROCS.ADD_SUBTOPIC:
                return this.addSubtopic(data);

            //-----     ADD COURSE ANNOUNCEMENT    -----

            case QUERY_PROCS.ADD_COURSE_ANNOUNCEMENT:
                return this.addCourseAnnouncement(data);

            //-----     ADD COURSE MATERIAL    -----

            case QUERY_PROCS.ADD_COURSE_MATERIAL:
                return this.addCourseMaterial(data);

            //-----     ADD COURSE ASSIGNMENT    -----

            case QUERY_PROCS.ADD_COURSE_ASSIGNMENT:
                return this.addCourseAssignment(data);

            //-----     ADD COURSE ASSESSMENT    -----

            case QUERY_PROCS.ADD_COURSE_ASSESSMENT:
                return this.addCourseAssessment(data);

            //-----     ADD COURSE ASSESSMENT MARK    -----

            case QUERY_PROCS.ADD_COURSE_ASSESSMENT_MARK:
                return this.addCourseAssessmentMark(data);

            //-----     ADD STUDENT ASSIGNMENT    -----

            case QUERY_PROCS.ADD_STUDENT_ASSIGNMENT:
                return this.addStudentAssignment(data);

            //-----     ADD POSITION    -----

            case QUERY_PROCS.ADD_POSITION:
                return this.addPosition(data);

            //-----     ADD STAFF    -----

            case QUERY_PROCS.ADD_STAFF:
                return this.addStaff(data);

            //-----     ADD STUDENT    -----

            case QUERY_PROCS.ADD_STUDENT:
                return this.addStudent(data);

            //-----     ADD STUDENT REPORT    -----

            case QUERY_PROCS.ADD_STUDENT_REPORT:
                return this.addStudentReport(data);

            //-----     ADD STUDENT COURSE    -----

            case QUERY_PROCS.ADD_STUDENT_COURSE:
                return this.addStudentCourse(data);

            //-----     ADD ALL STUDENT COURSES    -----

            case QUERY_PROCS.ADD_ALL_STUDENT_COURSES:
                return this.addAllStudentCourses(data);

            //-----     ADD NEWS EVENT    -----

            case QUERY_PROCS.ADD_NEWS_EVENT:
                return this.addNewsEvent(data);

            //-----     ADD SUGGESTION    -----

            case QUERY_PROCS.ADD_SUGGESTION:
                return this.addSuggestion(data);

            //-----     ADD DIRECT MESSAGE    -----

            case QUERY_PROCS.ADD_DIRECT_MESSAGE:
                return this.addDirectMessage(data);

            //-----     ADD HOME FILE    -----

            case QUERY_PROCS.ADD_HOME_FILE:
                return this.addHomeFile(data);

            //-----     ADD ROOT RESOURCE TOPIC    -----

            case QUERY_PROCS.ADD_ROOT_RESOURCE_TOPIC:
                return this.addRootResourceTopic(data);

            //-----     ADD SUB RESOURCE TOPIC    -----

            case QUERY_PROCS.ADD_SUB_RESOURCE_TOPIC:
                return this.addSubResourceTopic(data);

            //-----     ADD RESOURCE FILE    -----

            case QUERY_PROCS.ADD_RESOURCE_FILE:
                return this.addResourceFile(data);

            //-----     ADD QUIZ    -----

            case QUERY_PROCS.ADD_QUIZ:
                return this.addQuiz(data);

            //-----     ADD QUIZ QUESTION    -----

            case QUERY_PROCS.ADD_QUIZ_QUESTION:
                return this.addQuizQuestion(data);

            //-----     ADD QUIZ ANSWER    -----

            case QUERY_PROCS.ADD_QUIZ_ANSWER:
                return this.addQuizAnswers(data);

            //-----     ADD STUDENT QUIZ    -----

            case QUERY_PROCS.ADD_STUDENT_QUIZ:
                return this.addStudentQuiz(data);

            //-----     ADD STUDENT QUIZ UNSTRUCTURED ANSWER    -----

            case QUERY_PROCS.ADD_STUDENT_QUIZ_UNSTRUCTURED_ANSWER:
                return this.addStudentQuizUnstructuredAnswer(data);

            //-----     ADD STUDENT QUIZ STRUCTURED ANSWER    -----

            case QUERY_PROCS.ADD_STUDENT_QUIZ_STRUCTURED_ANSWER:
                return this.addStudentQuizStructuredAnswer(data);

            //-----     ADD STUDENT QUIZ FILE    -----

            case QUERY_PROCS.ADD_STUDENT_QUIZ_FILE:
                return this.addStudentQuizFile(data);

            //-----     ADD PARENT    -----

            case QUERY_PROCS.ADD_PARENT:
                return this.addParent(data);

            //-----     ADD FILE FOR PARENTS    -----

            case QUERY_PROCS.ADD_FILE_FOR_PARENTS:
                return this.addFileForParents(data);

            //-----     ADD PARENT FINANCIAL STATEMENT    -----

            case QUERY_PROCS.ADD_PARENT_FINANCIAL_STATEMENT:
                return this.addParentFinancialStatement(data);

            //-----     ADD PARENT STUDENT    -----

            case QUERY_PROCS.ADD_PARENT_STUDENT:
                return this.addParentStudent(data);

            //-----     ADD PARENT REGISTRATION REQUEST    -----

            case QUERY_PROCS.ADD_PARENT_REGISTRATION_REQUEST:
                return this.addParentRegistrationRequest(data);

            //-----     ADD TERMS AND CONDITIONS FILE    -----

            case QUERY_PROCS.ADD_TERMS_AND_CONDITIONS_FILE:
                return this.addTermsAndConditionsFile(data);

            //-----     ADD TERMS AND CONDITIONS ACCEPTED    -----

            case QUERY_PROCS.ADD_TERMS_AND_CONDITIONS_ACCEPTED:
                return this.addTermsAndConditionsAccepted(data);

            //-----     ADD LINK    -----

            case QUERY_PROCS.ADD_LINK:
                let addLink = (data as IAddLink);
                return `${QUERY_PROCS.ADD_LINK}("${addLink.linkPath}","${addLink.linkName}",${addLink.linkType},${addLink.linkTopicID},"${addLink.linkAssignmentPath}");`;

            //-----     APPROVE COURSE MATERIAL    -----

            case QUERY_PROCS.APPROVE_COURSE_MATERIAL:
                return this.approveCourseMaterial(data);

            //-----     APPROVE LINK    -----

            case QUERY_PROCS.APPROVE_LINK:
                let approveLink = (data as IMarkLinkForDeletion);
                return `${QUERY_PROCS.APPROVE_LINK}("${approveLink.linkPath}",${approveLink.linkType},${approveLink.linkTopicID});`;

            //-----     SET ADMIN RESOURCE PASSWORD    -----

            case QUERY_PROCS.SET_ADMIN_RESOURCE_PASSWORD:
                let setAdminResPword = (data as ISetAdminResourcePassword);
                return `${QUERY_PROCS.SET_ADMIN_RESOURCE_PASSWORD}(${setAdminResPword.adminID}, '${setAdminResPword.password}');`;

            //-----     UPDATE COURSE    -----

            case QUERY_PROCS.UPDATE_COURSE:
                return this.updateCourse(data);

            //-----     UPDATE COURSE TOPIC    -----

            case QUERY_PROCS.UPDATE_COURSE_TOPIC:
                return this.updateCourseTopic(data);

            //-----     UPDATE COURSE ASSIGNMENT    -----

            case QUERY_PROCS.UPDATE_COURSE_ASSIGNMENT:
                return this.updateCourseAssignment(data);

            //-----     UPDATE STAFF    -----

            case QUERY_PROCS.UPDATE_STAFF:
                return this.updateStaff(data);

            //-----     UPDATE STUDENT    -----

            case QUERY_PROCS.UPDATE_STUDENT:
                return this.updateStudent(data);

            //-----     UPDATE STUDENT COURSE    -----

            case QUERY_PROCS.UPDATE_STUDENT_COURSE:
                return this.updateStudentCourse(data);

            //-----     UPDATE STUDENT ASSIGNMENT    -----

            case QUERY_PROCS.UPDATE_STUDENT_ASSIGNMENT:
                return this.updateStudentAssignment(data);

            //-----     UPDATE STUDENT ASSIGNMENT MARK    -----

            case QUERY_PROCS.UPDATE_STUDENT_ASSIGNMENT_MARK:
                return this.updateStudentAssignmentMark(data);

            //-----     UPDATE STUDENT ASSESSMENT MARK    -----

            case QUERY_PROCS.UPDATE_STUDENT_ASSESSMENT_MARK:
                return this.updateStudentAssessmentMark(data);

            //-----     MARK MATERIAL FOR DELETION    -----

            case QUERY_PROCS.MARK_MATERIAL_FOR_DELETION:
                return this.markMaterialForDeletion(data);

            //-----     UNMARK MATERIAL FOR DELETION    -----

            case QUERY_PROCS.UNMARK_MATERIAL_FOR_DELETION:
                return this.unmarkMaterialForDeletion(data);

            //-----     CHANGE PASSWORD    -----

            case QUERY_PROCS.CHANGE_PASSWORD:
                return this.changePassword(data);

            //-----     MARK MESSAGES AS READ    -----

            case QUERY_PROCS.MARK_MESSAGES_AS_READ:
                let markMessagesAsRead = (data as IMarkMessagesAsRead);
                return `${QUERY_PROCS.MARK_MESSAGES_AS_READ}(${markMessagesAsRead.fromUserID}, ${markMessagesAsRead.toUserID});`;

            //-----     UPDATE STUDENT QUIZ STRUCTURED ANSWER MARK    -----

            case QUERY_PROCS.UPDATE_STUDENT_QUIZ_STRUCTURED_ANSWER_MARK:
                return this.updateStudentQuizStructuredAnswerMark(data);

            //-----     UPDATE QUIZ    -----

            case QUERY_PROCS.UPDATE_QUIZ:
                let updateQuiz = (data as IUpdateQuiz);
                return `${QUERY_PROCS.UPDATE_QUIZ}(${updateQuiz.quizID}, "${updateQuiz.name}", ${updateQuiz.attemptsAllowed}, "${updateQuiz.openTime}", "${updateQuiz.closeTime}", ${updateQuiz.duration});`;

            //-----     MARK STUDENT QUIZ    -----

            case QUERY_PROCS.MARK_STUDENT_QUIZ:
                return this.markStudentQuiz(data);

            //-----     END STUDENT QUIZ ATTEMPT    -----

            case QUERY_PROCS.END_STUDENT_QUIZ_ATTEMPT:
                return this.endStudentQuizAttempt(data);

            //-----     UPDATE PARENT    -----

            case QUERY_PROCS.UPDATE_PARENT:
                return this.updateParent(data);

            //-----     UPDATE PARENT FINANCES BALANCE    -----

            case QUERY_PROCS.UPDATE_PARENT_FINANCES_BALANCE:
                return this.updateParentFinancesBalance(data);

            //-----     UPDATE PARENT FINANCES NEXT PAYMENT DATE    -----

            case QUERY_PROCS.UPDATE_PARENT_FINANCES_NEXT_PAYMENT_DATE:
                return this.updateParentFinancesNextBalanceDue(data);

            //-----     MARK LINK FOR DELETION    -----

            case QUERY_PROCS.MARK_LINK_FOR_DELETION:
                let markLink = (data as IMarkLinkForDeletion);
                return `${QUERY_PROCS.MARK_LINK_FOR_DELETION}("${markLink.linkPath}",${markLink.linkType},${markLink.linkTopicID});`;

            //-----     UNMARK LINK FOR DELETION    -----

            case QUERY_PROCS.UNMARK_LINK_FOR_DELETION:
                let unmarkLink = (data as IMarkLinkForDeletion);
                return `${QUERY_PROCS.UNMARK_LINK_FOR_DELETION}("${unmarkLink.linkPath}",${unmarkLink.linkType},${unmarkLink.linkTopicID});`;

            //-----     DELETE COURSE    -----

            case QUERY_PROCS.DELETE_COURSE:
                return this.deleteCourse(data);

            //-----     DELETE COURSE TOPIC    -----

            case QUERY_PROCS.DELETE_COURSE_TOPIC:
                return this.deleteCourseTopic(data);

            //-----     DELETE COURSE MATERIAL    -----

            case QUERY_PROCS.DELETE_COURSE_MATERIAL:
                return this.deleteCourseMaterial(data);

            //-----     DELETE COURSE ASSIGNMENT    -----

            case QUERY_PROCS.DELETE_COURSE_ASSIGNMENT:
                return this.deleteCourseAssignment(data);

            //-----     DELETE COURSE ANNOUNCEMENT    -----

            case QUERY_PROCS.DELETE_COURSE_ANNOUNCEMENT:
                let delAnnouncement = (data as IDeleteCourseAnnouncement);
                return `${QUERY_PROCS.DELETE_COURSE_ANNOUNCEMENT}(${delAnnouncement.caID});`;

            //-----     DELETE COURSE ASSESSMENT    -----

            case QUERY_PROCS.DELETE_COURSE_ASSESSMENT:
                return this.deleteCourseAssessment(data);

            //-----     DELETE STAFF    -----

            case QUERY_PROCS.DELETE_STAFF:
                return this.deleteStaff(data);

            //-----     DELETE STUDENT    -----

            case QUERY_PROCS.DELETE_STUDENT:
                return this.deleteStudent(data);

            //-----     DELETE STUDENT ASSIGNMENT    -----

            case QUERY_PROCS.DELETE_STUDENT_ASSIGNMENT:
                return this.deleteStudentAssignment(data);

            //-----     DELETE STUDENT COURSE    -----

            case QUERY_PROCS.DELETE_STUDENT_COURSE:
                return this.deleteStudentCourse(data);

            //-----     DELETE FILES TO DELETE    -----

            case QUERY_PROCS.DELETE_FILES_TO_DELETE:
                return this.deleteFilesToDelete(data);

            //-----     DELETE SINGLE FILE TO DELETE    -----

            case QUERY_PROCS.DELETE_SINGLE_FILE_TO_DELETE:
                return this.deleteSingleFileToDelete(data);

            //-----     DELETE COURSE TAUGHT    -----

            case QUERY_PROCS.REMOVE_COURSE_TAUGHT:
                return this.removeCourseTaught(data);

            //-----     DELETE NEWS EVENT    -----

            case QUERY_PROCS.DELETE_NEWS_EVENT:
                return this.deleteNewsEvent(data);

            //-----     DELETE HOME FILE    -----

            case QUERY_PROCS.DELETE_HOME_FILE:
                return this.deleteHomeFile(data);

            //-----     DELETE RESOURCE FILE    -----

            case QUERY_PROCS.DELETE_RESOURCE_FILE:
                let delResFile = (data as IDeleteResourceFile);
                return `${QUERY_PROCS.DELETE_RESOURCE_FILE}("${delResFile.filePath}");`;

            //-----     DELETE RESOURCE TOPIC    -----

            case QUERY_PROCS.DELETE_RESOURCE_TOPIC:
                let delResTopic = (data as IDeleteResourceTopic);
                return `${QUERY_PROCS.DELETE_RESOURCE_TOPIC}("${delResTopic.topicID}");`;

            //-----     DELETE QUIZ    -----

            case QUERY_PROCS.DELETE_QUIZ:
                return this.deleteQuiz(data);

            //-----     DELETE QUIZ QUESTION    -----

            case QUERY_PROCS.DELETE_QUIZ_QUESTION:
                return this.deleteQuizQuestion(data);

            //-----     DELETE QUIZ ANSWER    -----

            case QUERY_PROCS.DELETE_QUIZ_ANSWER:
                return this.deleteQuizAnswer(data);

            //-----     DELETE ALL QUESTION ANSWERS    -----

            case QUERY_PROCS.DELETE_ALL_QUESTION_ANSWERS:
                return this.deleteAllQuestionAnswers(data);

            //-----     DELETE STUDENT QUIZ FILE    -----

            case QUERY_PROCS.DELETE_STUDENT_QUIZ_FILE:
                return this.deleteStudentQuizFile(data);

            //-----     DELETE PARENT    -----

            case QUERY_PROCS.DELETE_PARENT:
                return this.deleteParent(data);

            //-----     DELETE FILE FOR PARENTS    -----

            case QUERY_PROCS.DELETE_FILE_FOR_PARENTS:
                return this.deleteFileForParents(data);

            //-----     DELETE PARENT FINANCIAL STATEMENT    -----

            case QUERY_PROCS.DELETE_PARENT_FINANCIAL_STATEMENT:
                let delParentFinStat = (data as IDeleteFile);
                return `${QUERY_PROCS.DELETE_PARENT_FINANCIAL_STATEMENT}("${delParentFinStat.filePath}");`;

            //-----     DELETE PARENT REGISTRATION REQUEST    -----

            case QUERY_PROCS.DELETE_PARENT_REGISTRATION_REQUEST:
                return this.deleteParentRegistrationRequest(data);

            //-----     DELETE TERMS AND CONDITIONS FILE    -----

            case QUERY_PROCS.DELETE_TERMS_AND_CONDITIONS_FILE:
                let delTerms = (data as IDeleteFile);
                return `${QUERY_PROCS.DELETE_TERMS_AND_CONDITIONS_FILE}("${delTerms.filePath}");`;

            //-----     DELETE LINK    -----

            case QUERY_PROCS.DELETE_LINK:
                let delLink = (data as IDeleteLink);
                return `${QUERY_PROCS.DELETE_LINK}("${delLink.linkPath}",${delLink.linkType},${delLink.linkTopicID});`;

            //-----     DELETE ASSIGNMENT LINK    -----

            case QUERY_PROCS.DELETE_ASSIGNMENT_LINK:
                let delAssLink = (data as IDeleteAssignmentLink);
                return `${QUERY_PROCS.DELETE_ASSIGNMENT_LINK}("${delAssLink.linkPath}","${delAssLink.assignmentPath}");`;

            //-----     GENERATE INITIAL STUDENT ASSIGNMENT MARK RECORDS    -----
            case QUERY_PROCS.GENERATE_INITIAL_STUDENT_ASSIGNMENT_MARK_RECORDS:
                return this.generateInitialStudentAssignmentMarkRecords(data);

            default:
                return "";
        }
    }

    //--------------------------------------------



    //--------------------------------------------
    //      SPECIFIC PRIVATE QRY BUILD FUNCS
    //--------------------------------------------


    //------    GET QUERIES     -------

    private static loginQry(data: ILogin): string {
        return `${QUERY_PROCS.LOGIN}(${data.loginType},"${data.username}");`;
    }

    private static getEnrolledQry(data: IGetEnrolled): string {
        return `${QUERY_PROCS.GET_ENROLLED}(${data.username});`;
    }

    private static getCoursesByGradeQry(data: IGetCoursesByGrade): string {
        return `${QUERY_PROCS.GET_COURSES_BY_GRADE}(${data.grade});`;
    }

    private static getCourseOverview(data: IGetCourseOverview): string {
        return `${QUERY_PROCS.GET_COURSE_OVERVIEW}(${data.courseID});`;
    }

    private static getCoursesTakenByStudent(data: IGetCoursesTakenByStudent): string {
        return `${QUERY_PROCS.GET_COURSES_TAKEN_BY_STUDENT}(${data.username});`;
    }

    private static getCoursesShort(data: IGetCoursesShort): string {
        return `${QUERY_PROCS.GET_COURSES_SHORT}();`;
    }

    private static getCoursesByGradeShort(data: IGetCoursesByGradeShort): string {
        return `${QUERY_PROCS.GET_COURSES_BY_GRADE_SHORT}(${data.grade});`;
    }

    private static getCourseTopics(data: IGetCourseTopics): string {
        return `${QUERY_PROCS.GET_COURSE_TOPICS}(${data.courseID});`;
    }

    private static getSubtopics(data: IGetSubtopics): string {
        return `${QUERY_PROCS.GET_SUBTOPICS}(${data.parentTopicID});`;
    }

    private static getMaterialsByTopic(data: IGetMaterialByTopic): string {
        return `${QUERY_PROCS.GET_MATERIALS_BY_TOPIC}(${data.courseID},${data.topicID});`;
    }

    private static getMaterialsByTopicUnapproved(data: IGetMaterialByTopic): string {
        return `${QUERY_PROCS.GET_MATERIALS_BY_TOPIC_UNAPPROVED}(${data.courseID},${data.topicID});`;
    }

    private static getAllMaterialsUnapproved(data: IGetAllMaterials): string {
        return `${QUERY_PROCS.GET_ALL_MATERIALS_UNAPPROVED}();`;
    }

    private static getMaterialsByMarkedForDeletion(data: IGetMaterialByTopic): string {
        return `${QUERY_PROCS.GET_MATERIALS_BY_TOPIC_MARKED_FOR_DELETION}(${data.courseID},${data.topicID});`;
    }

    private static getAllMaterialsMarkedForDeletion(data: IGetAllMaterials): string {
        return `${QUERY_PROCS.GET_ALL_MATERIALS_MARKED_FOR_DELETION}();`;
    }

    private static getMaterialPath(data: IGetMaterialPath): string {
        return `${QUERY_PROCS.GET_MATERIAL_PATH}(${data.courseID},${data.topicID},"${data.materialName}");`;
    }

    private static getCourseAssignments(data: IGetCourseAssignments): string {
        return `${QUERY_PROCS.GET_COURSE_ASSIGNMENTS}(${data.courseID});`;
    }

    private static getCourseAssessments(data: IGetCourseAssessments): string {
        return `${QUERY_PROCS.GET_COURSE_ASSESSMENTS}(${data.courseID});`;
    }

    private static getCourseAnnouncements(data: IGetCourseAnnouncements): string {
        return `${QUERY_PROCS.GET_COURSE_ANNOUNCEMENTS}(${data.courseID});`;
    }

    private static getAssignmentPath(data: IGetAssignmentPath): string {
        return `${QUERY_PROCS.GET_ASSIGNMENT_PATH}(${data.courseID},"${data.assignmentName}");`;
    }

    private static getStudentAssignmentPaths(data: IGetStudentAssignmentPaths): string {
        return `${QUERY_PROCS.GET_STUDENT_ASSIGNMENT_PATHS}(${data.username},"${data.assignmentPath}");`;
    }

    private static getAssignmentMarksByCourse(data: IGetAssignmentMarksByCourse): string {
        return `${QUERY_PROCS.GET_ASSIGNMENT_MARKS_BY_COURSE}(${data.username},${data.courseID});`;
    }

    private static getAssessmentMarksByCourse(data: IGetAssessmentMarksByCourse): string {
        return `${QUERY_PROCS.GET_ASSESSMENT_MARKS_BY_COURSE}(${data.username},${data.courseID});`;
    }

    private static getAssignmentMark(data: IGetAssignmentMark): string {
        return `${QUERY_PROCS.GET_ASSIGNMENT_MARK}(${data.username},"${data.assignmentPath}");`;
    }

    private static getCourseMarks(data: IGetCourseMarks): string {
        return `${QUERY_PROCS.GET_COURSE_MARKS}(${data.username});`;
    }

    private static getStudentsInCourse(data: IGetStudentsInCourse): string {
        return `${QUERY_PROCS.GET_STUDENTS_IN_COURSE}(${data.courseID});`;
    }

    private static getStudentsByGrade(data: IGetStudentsByGrade): string {
        return `${QUERY_PROCS.GET_STUDENTS_BY_GRADE}(${data.grade});`;
    }

    private static getAllStudents(data: IGetAllStudents): string {
        return `${QUERY_PROCS.GET_ALL_STUDENTS}();`;
    }

    private static getAllStudentsShort(data: IGetAllStudents): string {
        return `${QUERY_PROCS.GET_ALL_STUDENTS_SHORT}();`;
    }

    private static getAllStudentsNotRegistered(data: IGetAllStudents): string {
        return `${QUERY_PROCS.GET_ALL_STUDENTS_NOT_REGISTERED}();`;
    }

    private static getStudentsWithMerritsByCourse(data: IGetStudentsWithMerritsByCourse): string {
        return `${QUERY_PROCS.GET_STUDENTS_WITH_MERRITS_BY_COURSE}(${data.courseID});`;
    }

    private static getStudentReports(data: IGetStudentReports): string {
        return `${QUERY_PROCS.GET_STUDENT_REPORTS}(${data.studentID});`;
    }

    private static getStaffMembers(data: IGetStaffMembers): string {
        return `${QUERY_PROCS.GET_STAFF_MEMBERS}();`;
    }

    private static getStaffShort(data: IGetStaffShort): string {
        return `${QUERY_PROCS.GET_STAFF_SHORT}();`;
    }

    private static getOtherCourseStaff(data: IGetOtherCourseStaff): string {
        return `${QUERY_PROCS.GET_OTHER_COURSE_STAFF}(${data.courseID});`;
    }

    private static getStudentDetails(data: IGetStudentDetails): string {
        return `${QUERY_PROCS.GET_STUDENT_DETAILS}(${data.studentID});`;
    }

    private static getStaffDetails(data: IGetStaffDetails): string {
        return `${QUERY_PROCS.GET_STAFF_DETAILS}(${data.staffID});`;
    }

    private static getCoursesTaughtByStaff(data: IGetCoursesTaughtByStaff): string {
        return `${QUERY_PROCS.GET_COURSES_TAUGHT_BY_STAFF}(${data.staffID});`;
    }

    private static getCoursesTaughtByStaffDetailed(data: IGetCoursesTaughtByStaffDetailed): string {
        return `${QUERY_PROCS.GET_COURSES_TAUGHT_BY_STAFF_DETAILED}(${data.staffID});`;
    }

    private static getPositionsShort(data: IGetCoursesTaughtByStaff): string {
        return `${QUERY_PROCS.GET_POSITIONS_SHORT}();`;
    }

    private static getFilesToDelete(data: IGetFilesToDelete): string {
        return `${QUERY_PROCS.GET_FILES_TO_DELETE}();`;
    }

    private static getNewsEvents(data: IGetNewsEvents): string {
        return `${QUERY_PROCS.GET_NEWS_EVENTS}();`;
    }

    private static getParentEmails(data: IGetParentEmails): string {
        return `${QUERY_PROCS.GET_PARENT_EMAILS}();`;
    }

    private static getAllMessagesBetweenUsers(data: IGetAllMessagesBetweenUsers): string {
        return `${QUERY_PROCS.GET_ALL_MESSAGES_BETWEEN_USERS}(${data.userID1},${data.userID2});`;
    }

    private static getLastMessageSent(data: IGetAllMessagesBetweenUsers): string {
        return `${QUERY_PROCS.GET_LAST_MESSAGE_SENT}(${data.userID1},${data.userID2});`;
    }

    private static getUsersToMessage(data: IGetUsersToMessage): string {
        return `${QUERY_PROCS.GET_USERS_TO_MESSAGE}(${data.userID},${data.userType});`;
    }

    private static getHomeFilesBySection(data: IGetHomeFilesBySection): string {
        return `${QUERY_PROCS.GET_HOME_FILES_BY_SECTION}("${data.section}");`;
    }

    private static getRootResourceTopicsForStaff(data: IGetRootResourceTopicsForStaff): string {
        return `${QUERY_PROCS.GET_ROOT_RESOURCE_TOPICS_FOR_STAFF}();`;
    }

    private static getRootResourceTopicsForStudents(data: IGetRootResourceTopicsForStudents): string {
        return `${QUERY_PROCS.GET_ROOT_RESOURCE_TOPICS_FOR_STUDENTS}();`;
    }

    private static getSubResourceTopicsForStaff(data: IGetSubResourceTopicsForStaff): string {
        return `${QUERY_PROCS.GET_SUB_RESOURCE_TOPICS_FOR_STAFF}(${data.parentTopicID}, ${data.staffID});`;
    }

    private static getSubResourceTopicsForStudents(data: IGetSubResourceTopicsForStudents): string {
        return `${QUERY_PROCS.GET_SUB_RESOURCE_TOPICS_FOR_STUDENTS}(${data.parentTopicID});`;
    }

    private static getResourceFilesByTopic(data: IGetResourceFilesByTopic): string {
        return `${QUERY_PROCS.GET_RESOURCE_FILES_BY_TOPIC}(${data.topicID});`;
    }

    private static getQuizzesByCourse(data: IGetQuizzesByCourse): string {
        return `${QUERY_PROCS.GET_QUIZZES_BY_COURSE}(${data.courseID});`;
    }

    private static getQuizQuestions(data: IGetQuizQuestions): string {
        return `${QUERY_PROCS.GET_QUIZ_QUESTIONS}(${data.quizID});`;
    }

    private static getQuizAnswers(data: IGetQuizAnswers): string {
        return `${QUERY_PROCS.GET_QUIZ_ANSWERS}(${data.quizQuestionID});`;
    }

    private static getStudentQuizAttempts(data: IGetStudentQuizAttempts): string {
        return `${QUERY_PROCS.GET_STUDENT_QUIZ_ATTEMPTS}(${data.studentID},${data.quizID});`;
    }

    private static getStudentQuizFiles(data: IGetStudentQuizFiles): string {
        return `${QUERY_PROCS.GET_STUDENT_QUIZ_FILES}(${data.studentID}, ${data.quizID}, ${data.attemptNum}, ${data.questID});`;
    }

    private static getStudentQuizUnstructuredAnswers(data: IGetStudentQuizUnstructuredAnswers): string {
        return `${QUERY_PROCS.GET_STUDENT_QUIZ_UNSTRUCTURED_ANSWERS}(${data.studentID}, ${data.quizID}, ${data.attemptNum}, ${data.questID});`;
    }

    private static getStudentQuizStructuredAnswer(data: IGetStudentQuizStructuredAnswer): string {
        return `${QUERY_PROCS.GET_STUDENT_QUIZ_STRUCTURED_ANSWER}(${data.studentID}, ${data.quizID}, ${data.attemptNum}, ${data.questID});`;
    }

    private static getAllParents(data: IGetAllParents): string {
        return `${QUERY_PROCS.GET_ALL_PARENTS}();`;
    }

    private static getParentDetails(data: IGetParentDetails): string {
        return `${QUERY_PROCS.GET_PARENT_DETAILS}(${data.parentID});`;
    }

    private static getAllTimetables(data: IGetAllTimetables): string {
        return `${QUERY_PROCS.GET_ALL_TIMETABLES}();`;
    }

    private static getAllCalendars(data: IGetAllCalendars): string {
        return `${QUERY_PROCS.GET_ALL_CALENDARS}();`;
    }

    private static getAllSupportDocuments(data: IGetAllSupportDocuments): string {
        return `${QUERY_PROCS.GET_ALL_SUPPORT_DOCUMENTS}();`;
    }

    private static getParentFinances(data: IGetParentFinances): string {
        return `${QUERY_PROCS.GET_PARENT_FINANCES}(${data.parentID});`;
    }

    private static getParentFinancialStatements(data: IGetParentFinancialStatements): string {
        return `${QUERY_PROCS.GET_PARENT_FINANCIAL_STATEMENTS}(${data.parentID});`;
    }

    private static getParentStudents(data: IGetParentStudents): string {
        return `${QUERY_PROCS.GET_PARENT_STUDENTS}(${data.parentID});`;
    }

    private static getParentRegistrationRequests(data: IGetParentRegistrationRequests): string {
        return `${QUERY_PROCS.GET_PARENT_REGISTRATION_REQUESTS}();`;
    }

    private static getParentRegistrationStudentInfo(data: IGetParentRegistrationStudentInfo): string {
        return `${QUERY_PROCS.GET_PARENT_REGISTRATION_STUDENT_INFO}("${data.idNum}");`;
    }

    private static getTermsAndConditionsFiles(data: IGetTermsAndConditionsFiles): string {
        return `${QUERY_PROCS.GET_TERMS_AND_CONDITIONS_FILES}();`;
    }

    //------    CHECK QUERIES     -------

    private static checkNewsImgPath(data: IGetSignedGetUrl): string {
        return `${QUERY_PROCS.CHECK_NEWS_IMG_PATH}('${data.filePath}');`;
    }

    private static checkHomeFilePath(data: IGetSignedGetUrl): string {
        return `${QUERY_PROCS.CHEC_HOME_FILE_PATH}('${data.filePath}');`;
    }

    private static checkTermsAndConditionsAccepted(data: ICheckTermsAndConditionsAccepted): string {
        return `${QUERY_PROCS.CHECK_TERMS_AND_CONDITIONS_ACCEPTED}(${data.parentID});`;
    }

    //------    SEARCH QUERIES     -------

    private static searchAllStudents(data: ISearchAllStudents): string {
        return `${QUERY_PROCS.SEARCH_ALL_STUDENTS}("%${data.name}%","%${data.surname}%");`;
    }

    private static searchStudentsInCourse(data: ISearchStudentsInCourse): string {
        return `${QUERY_PROCS.SEARCH_STUDENTS_IN_COURSE}(${data.courseID},"%${data.name}%","%${data.surname}%");`;
    }

    private static searchStaff(data: ISearchStaff): string {
        return `${QUERY_PROCS.SEARCH_STAFF}("%${data.name}%","%${data.surname}%");`;
    }

    //------    ADD QUERIES     -------

    private static addCourseAnnouncement(data: IAddCourseAnnouncement): string {
        return `${QUERY_PROCS.ADD_COURSE_ANNOUNCEMENT}(${data.courseID},"${data.message}");`;
    }

    private static addCourse(data: IAddCourse): string {
        return `${QUERY_PROCS.ADD_COURSE}(${data.staffID},"${data.courseName}","${data.courseDesc}",${data.courseGrade});`;
    }

    private static addCourseStaff(data: IAddCourseStaff): string {
        return `${QUERY_PROCS.ADD_COURSE_STAFF}(${data.staffID},${data.courseID});`;
    }

    private static addCourseTopic(data: IAddCourseTopic): string {
        return `${QUERY_PROCS.ADD_COURSE_TOPIC}(${data.courseID},"${data.topicName}");`;
    }

    private static addSubtopic(data: IAddSubtopic): string {
        return `${QUERY_PROCS.ADD_SUBTOPIC}(${data.parentTopicID},"${data.topicName}");`;
    }

    private static addCourseMaterial(data: IAddCourseMaterial): string {
        return `${QUERY_PROCS.ADD_COURSE_MATERIAL}(${data.courseID},${data.courseTopicID},"${data.materialPath}","${data.materialName}");`;
    }

    private static addCourseAssignment(data: IAddCourseAssignment): string {
        return `${QUERY_PROCS.ADD_COURSE_ASSIGNMENT}(${data.courseID},"${data.assignmentPath}","${data.assignmentName}","${data.dueDate}",${data.marksAvailable});`;
    }

    private static addCourseAssessment(data: IAddCourseAssessment): string {
        return `${QUERY_PROCS.ADD_COURSE_ASSESSMENT}(${data.courseID},"${data.assessmentName}",${data.marksAvailable},${data.contributionToTotal});`;
    }

    private static addCourseAssessmentMark(data: IAddStudentAssessmentMark): string {
        return `${QUERY_PROCS.ADD_COURSE_ASSESSMENT_MARK}(${data.studentID},${data.courseAssessmentID});`;
    }

    private static addStudentAssignment(data: IAddStudentAssignment): string {
        return `${QUERY_PROCS.ADD_STUDENT_ASSIGNMENT}(${data.studentID},"${data.courseAssignmentPath}","${data.assignmentPath}","${data.assignmentName}",${data.mark});`;
    }

    private static addPosition(data: IAddPosition): string {
        return `${QUERY_PROCS.ADD_POSITION}("${data.posName}","${data.posDesc}",${data.posLevel});`;
    }

    private static addStaff(data: IAddStaff): string {
        return `${QUERY_PROCS.ADD_STAFF}(${data.positionID},"${data.staffName}","${data.staffSurname}",${data.staffAge},"${data.staffCell}","${data.staffEmail}","${data.staffPassword}");`;
    }

    private static addStudent(data: IAddStudent): string {
        return `${QUERY_PROCS.ADD_STUDENT}("${data.studentFirstname}","${data.studentSurname}",${data.studentAge},${data.studentGrade},"${data.studentGuardianCell}","${data.studentGuardianEmailM}","${data.studentGuardianEmailF}","${data.studentPassword}");`;
    }

    private static addStudentReport(data: IAddStudentReport): string {
        return `${QUERY_PROCS.ADD_STUDENT_REPORT}("${data.reportPath}",${data.studentID},"${data.reportName}",${data.term},${data.year});`;
    }

    private static addStudentCourse(data: IAddStudentCourse): string {
        return `${QUERY_PROCS.ADD_STUDENT_COURSE}(${data.studentID},${data.courseID});`;
    }

    private static addAllStudentCourses(data: IAddAllStudentCourses): string {
        return `${QUERY_PROCS.ADD_ALL_STUDENT_COURSES}(${data.studentID});`;
    }

    private static addNewsEvent(data: IAddNewsEvent): string {
        return `${QUERY_PROCS.ADD_NEWS_EVENT}("${data.title}","${data.content}","${data.imgPath}");`;
    }

    private static addSuggestion(data: IAddSuggestion): string {
        return `${QUERY_PROCS.ADD_SUGGESTION}("${data.message}");`;
    }

    private static addDirectMessage(data: IAddDirectMessage): string {
        return `${QUERY_PROCS.ADD_DIRECT_MESSAGE}(${data.fromID},${data.toID},"${data.message}");`;
    }

    private static addHomeFile(data: IAddHomeFile): string {
        return `${QUERY_PROCS.ADD_HOME_FILE}("${data.filePath}", "${data.fileName}", "${data.fileSection}");`;
    }

    private static addRootResourceTopic(data: IAddRootResourceTopic): string {
        return `${QUERY_PROCS.ADD_ROOT_RESOURCE_TOPIC}("${data.topicName}", ${data.visibleToStudents});`;
    }

    private static addSubResourceTopic(data: IAddSubResourceTopic): string {
        return `${QUERY_PROCS.ADD_SUB_RESOURCE_TOPIC}(${data.parentTopicID}, "${data.topicName}", ${data.courseID});`;
    }

    private static addResourceFile(data: IAddResourceFile): string {
        return `${QUERY_PROCS.ADD_RESOURCE_FILE}(${data.topicID}, "${data.filePath}", "${data.fileName}");`;
    }

    private static addQuiz(data: IAddQuiz): string {
        return `${QUERY_PROCS.ADD_QUIZ}(${data.courseID}, "${data.name}", ${data.attemptsAllowed}, "${data.openTime}", "${data.closeTime}", ${data.duration});`;
    }

    private static addQuizQuestion(data: IAddQuizQuestion): string {
        return `${QUERY_PROCS.ADD_QUIZ_QUESTION}(${data.quizID}, ${data.qType}, "${data.value}", ${data.marksAvailable});`;
    }

    private static addQuizAnswers(data: IAddQuizAnswer): string {
        return `${QUERY_PROCS.ADD_QUIZ_ANSWER}(${data.quizQuestionID}, "${data.value}", ${data.isCorrect});`;
    }

    private static addStudentQuiz(data: IAddStudentQuiz): string {
        return `${QUERY_PROCS.ADD_STUDENT_QUIZ}(${data.studentID}, ${data.quizID});`;
    }

    private static addStudentQuizUnstructuredAnswer(data: IAddStudentQuizUnstructuredAnswer[]): string {
        let qry = "";
        data.forEach(item => {
            qry += `${QUERY_PROCS.ADD_STUDENT_QUIZ_UNSTRUCTURED_ANSWER}(${item.studentID}, ${item.quizID}, ${item.attemptNum}, ${item.questID}, ${item.ansID});\n`;
        });
        return qry;
    }

    private static addStudentQuizStructuredAnswer(data: IAddStudentQuizStructuredAnswer): string {
        return `${QUERY_PROCS.ADD_STUDENT_QUIZ_STRUCTURED_ANSWER}(${data.studentID}, ${data.quizID}, ${data.attemptNum}, ${data.questID}, "${data.ans}");`;
    }

    private static addStudentQuizFile(data: IAddStudentQuizFile): string {
        return `${QUERY_PROCS.ADD_STUDENT_QUIZ_FILE}("${data.filePath}", ${data.studentID}, ${data.quizID}, ${data.attemptNum}, ${data.questID}, "${data.fileName}");`;
    }

    private static addParent(data: IAddParent): string {
        console.log(`${QUERY_PROCS.ADD_PARENT}("${data.idNum}", "${data.pword}", "${data.pName}", "${data.pSurname}", "${data.pEmail}", "${data.pMobile}", "${data.pAddr}", "${data.pHomeLang}", "${data.pReligion}");`);
        return `${QUERY_PROCS.ADD_PARENT}("${data.idNum}", "${data.pword}", "${data.pName}", "${data.pSurname}", "${data.pEmail}", "${data.pMobile}", "${data.pAddr}", "${data.pHomeLang}", "${data.pReligion}");`;
    }

    private static addFileForParents(data: IAddFileForParents): string {
        return `${QUERY_PROCS.ADD_FILE_FOR_PARENTS}("${data.filePath}", "${data.fileName}", ${data.fileType});`;
    }

    private static addParentFinancialStatement(data: IAddParentFinancialStatement): string {
        return `${QUERY_PROCS.ADD_PARENT_FINANCIAL_STATEMENT}("${data.filePath}", ${data.parentID},"${data.fileName}", "${data.statementMonth}");`;
    }

    private static addParentStudent(data: IAddParentStudent): string {
        return `${QUERY_PROCS.ADD_PARENT_STUDENT}(${data.parentID}, ${data.studentID});`;
    }

    private static addParentRegistrationRequest(data: IAddParentRegistrationRequest): string {
        return `${QUERY_PROCS.ADD_PARENT_REGISTRATION_REQUEST}("${data.idNum}", "${data.pword}", "${data.pName}", "${data.pSurname}", "${data.pEmail}", "${data.pMobile}", "${data.pAddr}", "${data.pHomeLang}", "${data.pReligion}", "${data.pChildInfo}");`;
    }

    private static addTermsAndConditionsFile(data: IAddTermsAndConditionsFile): string {
        return `${QUERY_PROCS.ADD_TERMS_AND_CONDITIONS_FILE}("${data.filePath}", "${data.fileName}");`;
    }

    private static addTermsAndConditionsAccepted(data: IAddTermsAndConditionsAccepted): string {
        return `${QUERY_PROCS.ADD_TERMS_AND_CONDITIONS_ACCEPTED}(${data.parentID});`;
    }

    //------    UPDATE QUERIES     -------

    private static updateCourseAssignment(data: IUpdateCourseAssignment): string {
        return `${QUERY_PROCS.UPDATE_COURSE_ASSIGNMENT}(${data.courseID},"${data.dueDate}",${data.marksAvailable},"${data.assignmentPath}");`;
    }

    private static updateStaff(data: IUpdateStaff): string {
        return `${QUERY_PROCS.UPDATE_STAFF}(${data.staffID},${data.posID},"${data.name}","${data.surname}",${data.age},"${data.cell}","${data.email}");`;
    }

    private static updateStudent(data: IUpdateStudent): string {
        return `${QUERY_PROCS.UPDATE_STUDENT}(${data.studentID},"${data.name}","${data.surname}",${data.age},${data.grade},"${data.cell}","${data.emailM}","${data.emailF}");`;
    }

    private static updateStudentCourse(data: IUpdateStudentCourse): string {
        return `${QUERY_PROCS.UPDATE_STUDENT_COURSE}(${data.studentID},${data.courseID},${data.mark});`;
    }

    private static updateStudentAssignment(data: IUpdateStudentAssignment): string {
        return `${QUERY_PROCS.UPDATE_STUDENT_ASSIGNMENT}(${data.username},"${data.courseAssignmentPath}","${data.StudentAssignmentPath}");`;
    }

    private static updateStudentAssignmentMark(data: IUpdateStudentAssignmentMark): string {
        return `${QUERY_PROCS.UPDATE_STUDENT_ASSIGNMENT_MARK}(${data.username},"${data.courseAssignmentPath}",${data.mark});`;
    }

    private static updateStudentAssessmentMark(data: IUpdateStudentAssessmentMark): string {
        return `${QUERY_PROCS.UPDATE_STUDENT_ASSESSMENT_MARK}(${data.username}, ${data.assessmentID}, ${data.mark});`;
    }

    private static markMaterialForDeletion(data: IMarkMaterialForDeletion): string {
        return `${QUERY_PROCS.MARK_MATERIAL_FOR_DELETION}("${data.materialPath}");`;
    }

    private static unmarkMaterialForDeletion(data: IUnmarkMaterialForDeletion): string {
        return `${QUERY_PROCS.UNMARK_MATERIAL_FOR_DELETION}("${data.materialPath}");`;
    }

    private static updateCourse(data: IUpdateCourse): string {
        return `${QUERY_PROCS.UPDATE_COURSE}(${data.courseID},${data.staffID},"${data.courseName}","${data.courseDesc}");`;
    }

    private static updateCourseTopic(data: IUpdateCourseTopic): string {
        return `${QUERY_PROCS.UPDATE_COURSE_TOPIC}(${data.topicID},"${data.topicName}");`;
    }

    private static approveCourseMaterial(data: IApproveCourseMaterial): string {
        return `${QUERY_PROCS.APPROVE_COURSE_MATERIAL}("${data.materialPath}")`;
    }

    private static changePassword(data: IChangePassword): string {
        return `${QUERY_PROCS.CHANGE_PASSWORD}(${data.userType},${data.userID},"${data.newPassword}")`;
    }

    private static updateStudentQuizStructuredAnswerMark(data: IUpdateStudentQuizStructuredAnswerMark): string {
        return `${QUERY_PROCS.UPDATE_STUDENT_QUIZ_STRUCTURED_ANSWER_MARK}(${data.studentID}, ${data.quizID}, ${data.questID}, ${data.attemptNum}, ${data.mark})`;
    }

    private static markStudentQuiz(data: IMarkStudentQuiz): string {
        return `${QUERY_PROCS.MARK_STUDENT_QUIZ}(${data.studentID}, ${data.quizID}, ${data.attemptNum})`;
    }

    private static endStudentQuizAttempt(data: IEndStudentQuizAttempt): string {
        return `${QUERY_PROCS.END_STUDENT_QUIZ_ATTEMPT}(${data.studentID}, ${data.quizID}, ${data.attemptNum})`;
    }

    private static updateParent(data: IUpdateParent): string {
        return `${QUERY_PROCS.UPDATE_PARENT}("${data.idNum}", "${data.pName}", "${data.pSurname}", "${data.pEmail}", "${data.pMobile}", "${data.pAddr}", "${data.pHomeLang}", "${data.pReligion}");`;
    }

    private static updateParentFinancesBalance(data: IUpdateParentFinancesBalance): string {
        return `${QUERY_PROCS.UPDATE_PARENT_FINANCES_BALANCE}(${data.parentID}, ${data.balance});`;
    }

    private static updateParentFinancesNextBalanceDue(data: IUpdateParentFinancesNextPaymentDate): string {
        return `${QUERY_PROCS.UPDATE_PARENT_FINANCES_NEXT_PAYMENT_DATE}(${data.parentID}, "${data.nextDate}");`;
    }


    //------    DELETE QUERIES     -------

    private static deleteCourse(data: IDeleteCourse): string {
        return `${QUERY_PROCS.DELETE_COURSE}(${data.courseID});`;
    }

    private static deleteCourseTopic(data: IDeleteCourseTopic): string {
        return `${QUERY_PROCS.DELETE_COURSE_TOPIC}(${data.topicID});`;
    }

    private static deleteCourseMaterial(data: IDeleteCourseMaterial): string {
        return `${QUERY_PROCS.DELETE_COURSE_MATERIAL}("${data.path}");`;
    }

    private static deleteCourseAssignment(data: IDeleteCourseAssignment): string {
        return `${QUERY_PROCS.DELETE_COURSE_ASSIGNMENT}("${data.path}");`;
    }

    private static deleteCourseAssessment(data: IDeleteCourseAssessment): string {
        return `${QUERY_PROCS.DELETE_COURSE_ASSESSMENT}(${data.assessmentID});`;
    }

    private static deleteStaff(data: IDeleteStaff): string {
        return `${QUERY_PROCS.DELETE_STAFF}(${data.staffID});`;
    }

    private static deleteStudent(data: IDeleteStudent): string {
        return `${QUERY_PROCS.DELETE_STUDENT}(${data.studentID});`;
    }

    private static deleteStudentAssignment(data: IDeleteStudentAssignment): string {
        return `${QUERY_PROCS.DELETE_STUDENT_ASSIGNMENT}("${data.path}");`;
    }

    private static deleteStudentCourse(data: IDeleteStudentCourse): string {
        return `${QUERY_PROCS.DELETE_STUDENT_COURSE}(${data.studentID},${data.courseID});`;
    }

    private static deleteFilesToDelete(data: IDeleteFilesToDelete): string {
        return `${QUERY_PROCS.DELETE_FILES_TO_DELETE}();`;
    }

    private static deleteSingleFileToDelete(data: IDeleteSingleFileToDelete): string {
        return `${QUERY_PROCS.DELETE_SINGLE_FILE_TO_DELETE}("${data.filePath}");`;
    }

    private static removeCourseTaught(data: IRemoveCourseTaught): string {
        console.log(data);
        return `${QUERY_PROCS.REMOVE_COURSE_TAUGHT}(${data.courseID}, ${data.staffID});`;
    }

    private static deleteNewsEvent(data: IDeleteNewsEvent): string {
        return `${QUERY_PROCS.DELETE_NEWS_EVENT}('${data.newsImgPath}');`;
    }

    private static deleteHomeFile(data: IDeleteHomeFile): string {
        return `${QUERY_PROCS.DELETE_HOME_FILE}('${data.filePath}');`;
    }

    private static deleteQuiz(data: IDeleteQuiz): string {
        return `${QUERY_PROCS.DELETE_QUIZ}(${data.quizID});`;
    }

    private static deleteQuizQuestion(data: IDeleteQuizQuestion): string {
        return `${QUERY_PROCS.DELETE_QUIZ_QUESTION}(${data.questionID});`;
    }

    private static deleteQuizAnswer(data: IDeleteQuizAnswer): string {
        return `${QUERY_PROCS.DELETE_QUIZ_ANSWER}(${data.answerID});`;
    }

    private static deleteAllQuestionAnswers(data: IAddStudentQuizUnstructuredAnswer): string {
        return `${QUERY_PROCS.DELETE_ALL_QUESTION_ANSWERS}(${data.studentID}, ${data.quizID}, ${data.attemptNum}, ${data.questID});`;
    }

    private static deleteStudentQuizFile(data: IDeleteStudentQuizFile): string {
        return `${QUERY_PROCS.DELETE_STUDENT_QUIZ_FILE}('${data.filePath}');`;
    }

    private static deleteParent(data: IDeleteParent): string {
        return `${QUERY_PROCS.DELETE_PARENT}('${data.idNum}');`;
    }

    private static deleteFileForParents(data: IDeleteFileForParents): string {
        return `${QUERY_PROCS.DELETE_FILE_FOR_PARENTS}('${data.filePath}');`;
    }

    private static deleteParentRegistrationRequest(data: IDeleteParentRegistrationRequest): string {
        return `${QUERY_PROCS.DELETE_PARENT_REGISTRATION_REQUEST}('${data.idNum}');`;
    }


    //------    HELPER QUERIES     -------

    private static generateInitialStudentAssignmentMarkRecords(data: IGenerateInitialStudentAssignmentMarkRecords): string {
        return `${QUERY_PROCS.GENERATE_INITIAL_STUDENT_ASSIGNMENT_MARK_RECORDS}(${data.courseID},"${data.assignmentPath}");`;
    }

    //--------------------------------------------

}

//--------------------------------------------
//--------------------------------------------



//--------------------------------------------
//      DB CONNECTION CLASS DEFINITION
//--------------------------------------------

class DB_Connection {
    private connectionPool: mysql.Pool;     // stores connection pool

    constructor() {

        //----------    SETUP CONNECTION POOL   ------------

        this.connectionPool = mysql.createPool({
            connectionLimit: 20,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: "SCA_DB_DEV",
            multipleStatements: true,
            dateStrings: true
        });

    }

    //----------    HANDLE DB QUERIES   ------------

    public query(qry: string, callback: (err: mysql.MysqlError, res: any) => void) {
        this.connectionPool.query(qry, callback);
    }

}

export default DB_Connection;

//--------------------------------------------
//--------------------------------------------
