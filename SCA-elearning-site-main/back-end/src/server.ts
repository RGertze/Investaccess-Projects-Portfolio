// dependency imports
import path from 'path';
import http from "http";
import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import { Server } from "socket.io";
import dotenv from "dotenv";

// cron job imports
import { s3DeleteTask } from './s3';

// smtp imports
import { initSMTP } from './smtp';

// jwt imports
import { authenticateToken } from './jwtAuth';

// endpoint imports
import GetEndpoints from './endpoints/getEndpoints';
import PostEndpoints from './endpoints/postEndpoints';


dotenv.config();    // load values from .env file


//----------------------------------------------
//      START CRON JOBS
//----------------------------------------------

s3DeleteTask.start();   // -->  DELETE FILES FROM S3 EVERY 24 HOURS

//----------------------------------------------
//----------------------------------------------


//----------------------------------------------
//      SETUP SMTP
//----------------------------------------------

initSMTP();

//----------------------------------------------
//----------------------------------------------


//----------------------------------------------
//      SETUP SERVER
//----------------------------------------------

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");      //allows requests from any domain
    inResponse.header("Access-Control-Allow-Methods", "GET,POST");   //allows these methods
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");   //allows these headers
    inNext();
});

//----------       parse post data
app.use(express.json());
app.use(express.urlencoded());

app.get('*.js', function(req, res, next) {
    if (req.url.match("index.js") === null) { //----   DONT CONVERT INDEX.JS 
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/javascript');
    }
    next();
});

//----------       host different site sections
app.use("/", express.static("public"));
app.use("/admin", express.static("admin-dist"));
app.use("/student", express.static("student-dist"));
app.use("/staff", express.static("staff-dist"));
app.use("/parent", express.static("parent-dist"));

//----------------------------------------------
//----------------------------------------------



//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//
//          GET ENDPOINTS
//
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------


//-----------------     GET ENROLLED COURSES     -------------------

app.get("/enrolled/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetEnrolledCourses(req, res);
});

//-----------------     GET COURSES BY GRADE     -------------------

app.get("/courses/grade/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCoursesByGrade(req, res);
});

//-----------------     GET COURSES SHORT     -------------------

app.get("/courses/short/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCoursesShort(req, res);
});

//-----------------     GET COURSES BY GRADE SHORT     -------------------

app.get("/courses/grade/short/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCoursesByGradeShort(req, res);
});

//-----------------     GET COURSE OVERVIEW     -------------------

app.get("/course/overview/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseOverview(req, res);
});

//-----------------     GET COURSE TOPICS     -------------------

app.get("/course/topics/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseTopics(req, res);
});

//-----------------     GET SUBTOPICS     -------------------

app.get("/course/topics/subtopics/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetSubtopics(req, res);
});

//-----------------     GET COURSE MATERIALS BY TOPIC APPROVED     -------------------

app.get("/course/materials/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseMaterialsTopicApproved(req, res);
});

//-----------------     GET MATERIAL BY TOPIC UNAPPROVED     -------------------

app.get("/course/materials/unapproved/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetMaterialByTopicUnapproved(req, res);
});

//-----------------     GET ALL MATERIALS UNAPPROVED     -------------------

app.get("/materials/unapproved/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllMaterialsUnapproved(req, res);
});

//-----------------     GET MATERIAL BY TOPIC MARKED FOR DELETION     -------------------

app.get("/course/materials/marked/deletion/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetMaterialByTopicMarkedForDeletion(req, res);
});

//-----------------     GET ALL MATERIALS MARKED FOR DELETION     -------------------

app.get("/materials/marked/deletion/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllMaterialsMarkedForDeletion(req, res);
});

//-----------------     GET MATERIAL PATH     -------------------

app.get("/course/materials/path/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseMaterialPath(req, res);
});

//-----------------     GET COURSE ASSIGNMENTS     -------------------

app.get("/course/assignments/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseAssignments(req, res);
});

//-----------------     GET COURSE ASSESSMENTS     -------------------

app.get("/course/assessments/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseAssessments(req, res);
});

//-----------------     GET ASSESSMENTS MARKS BY COURSE     -------------------

app.get("/student/assessments/marks/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAssessmentMarksByCourse(req, res);
});

//-----------------     GET ASSIGNMENT PATH     -------------------

app.get("/course/assignments/path/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseAssignmentPath(req, res);
});

//-----------------     GET COURSE ANNOUNCEMENTS     -------------------

app.get("/course/announcements/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseAnnouncements(req, res);
});

//-----------------     GET ALL STUDENTS     -------------------

app.get("/students/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllStudents(req, res);
});

//-----------------     GET ALL STUDENTS SHORT     -------------------

app.get("/students/all/short/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllStudentsShort(req, res);
});

//-----------------     GET ALL STUDENTS NOT REGISTERED     -------------------

app.get("/students/unregistered/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllStudentsNotRegistered(req, res);
});

//-----------------     GET COURSES TAKEN BY STUDENT     -------------------

app.get("/students/courses/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCoursesByStudent(req, res);
});

//-----------------     SEARCH ALL STUDENTS     -------------------

app.get("/students/all/search/:data", authenticateToken, (req, res) => {
    GetEndpoints.SearchAllStudents(req, res);
});

//-----------------     GET STUDENTS BY GRADE     -------------------

app.get("/students/grade/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentsByGrade(req, res);
});

//-----------------     GET STUDENT REPORTS     -------------------

app.get("/students/reports/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentReports(req, res);
});

//-----------------     GET STUDENTS IN COURSE     -------------------

app.get("/course/students/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentsInCourse(req, res);
});

//-----------------     SEARCH STUDENTS IN COURSE     -------------------

app.get("/course/students/search/:data", authenticateToken, (req, res) => {
    GetEndpoints.SearchStudentsInCourse(req, res);
});

//-----------------     GET STUDENTS WITH MERRITS BY COURSE     -------------------

app.get("/course/students/merrits/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentsWithMerritsByCourse(req, res);
});

//-----------------     GET COURSE MARKS     -------------------

app.get("/course/students/marks/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCourseMarks(req, res);
});

//-----------------     GET ASSIGNMENT MARKS BY COURSE     -------------------

app.get("/course/assignments/marks/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAssignmentMarksByCourse(req, res);
});

//-----------------     GET ASSIGNMENT MARK     -------------------

app.get("/course/assignments/marks/single/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAssignmentMark(req, res);
});

//-----------------     GET STUDENT ASSIGNMENT PATHS     -------------------

app.get("/course/assignments/student/path/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentAssignmentPaths(req, res);
});

//-----------------     GET STAFF MEMBERS     -------------------

app.get("/staff/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStaffMembers(req, res);
});

//-----------------     GET SHORT VERSION OF STAFF     -------------------

app.get("/staff/all/short/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStaffMembersShort(req, res);
});

//-----------------     GET STUDENT DETAILS     -------------------

app.get("/students/details/single/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentDetails(req, res);
});

//-----------------     GET STAFF DETAILS     -------------------

app.get("/staff/details/single/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStaffDetails(req, res);
});

//-----------------     GET OTHER COURSE STAFF     -------------------

app.get("/course/staff/other/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetOtherCourseStaff(req, res);
});

//-----------------     SEARCH STAFF MEMBERS     -------------------

app.get("/staff/search/:data", authenticateToken, (req, res) => {
    GetEndpoints.SearchStaffMembers(req, res);
});

//-----------------     GET COURSES TAUGHT BY STAFF     -------------------

app.get("/staff/courses/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCoursesTaughtByStaff(req, res);
});

//-----------------     GET COURSES TAUGHT BY STAFF DETAILED     -------------------

app.get("/staff/courses/detailed/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetCoursesTaughtByStaffDetailed(req, res);
});

//-----------------     GET POSITIONS SHORT     -------------------

app.get("/positions/short/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetPositionsShort(req, res);
});

//-----------------     GET NEWS EVENTS     -------------------

app.get("/news/:data", (req, res) => {
    GetEndpoints.GetNewsEvents(req, res);
});

//-----------------     GET ALL MESSAGES BETWEEN USERS     -------------------

app.get("/chat/messages/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllMessagesBetweenUsers(req, res);
});

//-----------------     GET USERS TO MESSAGE     -------------------

app.get("/chat/users/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetUsersToMessage(req, res);
});

//-----------------     CHECK FOR UNREAD MESSAGES     -------------------

app.get("/chat/messages/unread/:data", authenticateToken, GetEndpoints.CheckForUnreadMessages);

//-----------------     GET HOME FILES BY SECTION     -------------------

app.get("/home/files/section/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetHomeFilesBySection(req, res);
});

//-----------------     GET ROOT RESOURCE TOPICS FOR STAFF     -------------------

app.get("/resources/topics/root/staff/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetRootResourceTopicsForStaff(req, res);
});

//-----------------     GET ROOT RESOURCE TOPICS FOR STUDENTS     -------------------

app.get("/resources/topics/root/students/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetRootResourceTopicsForStudents(req, res);
});

//-----------------     GET SUB RESOURCE TOPICS FOR STAFF     -------------------

app.get("/resources/topics/sub/staff/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetSubResourceTopicsForStaff(req, res);
});

//-----------------     GET SUB RESOURCE TOPICS FOR STUDENTS     -------------------

app.get("/resources/topics/sub/students/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetSubResourceTopicsForStudents(req, res);
});

//-----------------     GET RESOURCE FILES BY TOPIC     -------------------

app.get("/resources/files/topic/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetResourceFilesByTopic(req, res);
});

//-----------------     GET QUIZZES BY COURSE     -------------------

app.get("/course/quizzes/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetQuizzesByCourse(req, res);
});

//-----------------     GET QUIZ QUESTIONS     -------------------

app.get("/course/quiz/questions/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetQuizQuestions(req, res);
});

//-----------------     GET QUIZ ANSWERS     -------------------

app.get("/course/quiz/question/answers/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetQuizAnswers(req, res);
});

//-----------------     GET STUDENT QUIZ ATTEMPTS     -------------------

app.get("/student/quizzes/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentQuizAttempts(req, res);
});

//-----------------     GET STUDENT QUIZ FILES     -------------------

app.get("/student/quiz/question/files/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentQuizFiles(req, res);
});

//-----------------     GET STUDENT QUIZ UNSTRUCTURED ANSWERS     -------------------

app.get("/student/quiz/question/answers/unstructured/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentQuizUnstructuredAnswers(req, res);
});

//-----------------     GET STUDENT QUIZ STRUCTURED ANSWER     -------------------

app.get("/student/quiz/question/answers/structured/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetStudentQuizStructuredAnswer(req, res);
});

//-----------------     GET ALL PARENTS     -------------------

app.get("/parents/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllParents(req, res);
});

//-----------------     GET PARENT DETAILS     -------------------

app.get("/parent/details/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetParentDetails(req, res);
});

//-----------------     GET ALL TIMETABLES     -------------------

app.get("/parents/files/timetables/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllTimetables(req, res);
});

//-----------------     GET ALL CALENDARS     -------------------

app.get("/parents/files/calendars/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllCalendars(req, res);
});

//-----------------     GET ALL SUPPORT DOCUMETNS     -------------------

app.get("/parents/files/support/all/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetAllSupportDocuments(req, res);
});

//-----------------     GET PARENT FINANCES     -------------------

app.get("/parent/finances/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetParentFinances(req, res);
});

//-----------------     GET PARENT FINANCIAL STATEMENTS     -------------------

app.get("/parent/statements/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetParentFinancialStatements(req, res);
});

//-----------------     GET PARENT STUDENTS     -------------------

app.get("/parent/students/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetParentStudents(req, res);
});

//-----------------     GET PARENT REGISTRATION REQUESTS     -------------------

app.get("/parents/registrations/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetParentRegistrationRequests(req, res);
});

//-----------------     GET PARENT REGISTRATION STUDENT INFO     -------------------

app.get("/parent/registration/student-info/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetParentRegistrationStudentInfo(req, res);
});

//-----------------     GET TERMS AND CONDITIONS FILES     -------------------

app.get("/terms-conditions/files/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetTermsAndConditionsFiles(req, res);
});

//-----------------     GET LINKS MARKED FOR DELETION     -------------------

app.get("/links/marked-for-deletion/:data", authenticateToken, GetEndpoints.GetLinksMarkedForDeletion);

//-----------------     GET ALL LINKS MARKED FOR DELETION     -------------------

app.get("/links/marked-for-deletion/all/:data", authenticateToken, GetEndpoints.GetAllLinksMarkedForDeletion);

//-----------------     GET UNAPPROVED LINKS BY TOPIC     -------------------

app.get("/links/topic/unapproved/:data", authenticateToken, GetEndpoints.GetUnapprovedLinksByTopic);

//-----------------     GET ALL UNAPPROVED LINKS     -------------------

app.get("/links/unapproved/all/:data", authenticateToken, GetEndpoints.GetAllUnapprovedLinks);

//-----------------     GET APPROVED LINKS BY TOPIC     -------------------

app.get("/links/topic/approved/:data", authenticateToken, GetEndpoints.GetApprovedLinksByTopic);

//-----------------     GET LINKS BY TOPIC     -------------------

app.get("/links/topic/:data", authenticateToken, GetEndpoints.GetLinksByTopic);

//-----------------     GET COURSE ASSIGNMENT LINKS     -------------------

app.get("/assignment/links/:data", authenticateToken, GetEndpoints.GetCourseAssignmentLinks);

//-----------------     GET HOME SECTION LINKS     -------------------

app.get("/home/links/:data", authenticateToken, GetEndpoints.GetHomeSectionLinks);




//-----------------     GET SIGNED S3 NEWS IMG GET URL     -------------------

app.get("/news/image/:data", (req, res) => {
    GetEndpoints.GetSignedNewsImgGetUrl(req, res);
});

//-----------------     GET SIGNED S3 HOME FILE GET URL     -------------------

app.get("/home/files/url/:data", (req, res) => {
    GetEndpoints.GetSignedHomeFileGetUrl(req, res);
});

//-----------------     GET SIGNED S3 GET URL     -------------------

app.get("/file/get/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetSignedGetUrl(req, res);
});

//-----------------     GET SIGNED S3 POST URL     -------------------

app.get("/file/add/:data", authenticateToken, (req, res) => {
    GetEndpoints.GetSignedPostUrl(req, res);
});

//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------




//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//
//          POST ENDPOINTS
//
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------


//-----------------     LOGIN     -------------------

app.post("/login", (req, res) => {
    PostEndpoints.Login(req, res);
});

//-----------------     SET ADMIN RESOURCE PASSWORD     -------------------

app.post("/admin/resource-password/update", authenticateToken, PostEndpoints.SetAdminResourcePassword);

//-----------------     CHECK ADMIN RESOURCE PASSWORD     -------------------

app.post("/admin/resource-password/check", authenticateToken, PostEndpoints.CheckAdminResourcePassword);


//-----------------     ADD COURSE     -------------------

app.post("/course/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourse(req, res);
});

//-----------------     ADD COURSE STAFF     -------------------

app.post("/course/staff/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseStaff(req, res);
});

//-----------------     ADD COURSE TOPIC     -------------------

app.post("/course/topics/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseTopic(req, res);
});

//-----------------     ADD SUBTOPIC     -------------------

app.post("/course/topics/subtopics/add", authenticateToken, (req, res) => {
    PostEndpoints.AddSubtopic(req, res);
});

//-----------------     UPDATE COURSE TOPIC     -------------------

app.post("/course/topics/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateCourseTopic(req, res);
});

//-----------------     ADD COURSE ANNOUNCEMENT     -------------------

app.post("/course/announcements/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseAnnouncement(req, res);
});

//-----------------     ADD COURSE MATERIAL     -------------------

app.post("/course/materials/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseMaterial(req, res);
});

//-----------------     ADD COURSE ASSIGNMENT     -------------------

app.post("/course/assignments/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseAssignment(req, res);
});

//-----------------     ADD COURSE ASSESSMENT     -------------------

app.post("/course/assessments/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseAssessment(req, res);
});

//-----------------     ADD ASSESSMENT MARK     -------------------

app.post("/student/assessments/marks/add", authenticateToken, (req, res) => {
    PostEndpoints.AddCourseAssessmentMark(req, res);
});

//-----------------     ADD STUDENT ASSIGNMENT     -------------------

app.post("/course/assignments/student/add", authenticateToken, (req, res) => { //------  RETURNS FILE PATH TO BE UPDATED IN SUBSEQUENT CALL TO SERVER
    PostEndpoints.AddStudentAssignment(req, res);
});

//-----------------     UPDATE STUDENT ASSIGNMENT MARK     -------------------

app.post("/course/assignments/student/mark/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateStudentAssignmentMark(req, res);
});

//-----------------     UPDATE STUDENT ASSESSMENT MARK     -------------------

app.post("/course/assessments/student/mark/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateStudentAssessmentMark(req, res);
});

//-----------------     ADD STUDENT     -------------------

app.post("/students/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudent(req, res);
});

//-----------------     UPDATE COURSE     -------------------

app.post("/course/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateCourse(req, res);
});

//-----------------     APPROVE COURSE MATERIAL     -------------------

app.post("/course/material/approve", authenticateToken, (req, res) => {
    PostEndpoints.ApproveCourseMaterial(req, res);
});

//-----------------     MARK MATERIAL FOR DELETION     -------------------

app.post("/course/material/delete/mark", authenticateToken, (req, res) => {
    PostEndpoints.MarkMaterialForDeletion(req, res);
});

//-----------------     UNMARK MATERIAL FOR DELETION     -------------------

app.post("/course/material/delete/unmark", authenticateToken, (req, res) => {
    PostEndpoints.UnmarkMaterialForDeletion(req, res);
});

//-----------------     UPDATE STUDENT     -------------------

app.post("/students/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateStudent(req, res);
});

//-----------------     UPDATE STUDENT COURSE     -------------------

app.post("/students/courses/marks/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateStudentCourse(req, res);
});

//-----------------     UPDATE STUDENT QUIZ STRUCTURED ANSWER MARK     -------------------

app.post("/student/quiz/answers/structured/mark/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateStudentQuizStructuredAnswerMark(req, res);
});

//-----------------     MARK STUDENT QUIZ     -------------------

app.post("/student/quiz/mark", authenticateToken, (req, res) => {
    PostEndpoints.MarkStudentQuiz(req, res);
});

//-----------------     END STUDENT QUIZ ATTEMPT     -------------------

app.post("/student/quiz/end", authenticateToken, (req, res) => {
    PostEndpoints.EndStudentQuizAttempt(req, res);
});

//-----------------     ADD STUDENT REPORT     -------------------

app.post("/students/reports/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudentReport(req, res);
});

//-----------------     ADD STUDENT COURSE     -------------------

app.post("/students/courses/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudentCourse(req, res);
});

//-----------------     ADD ALL STUDENT COURSES     -------------------

app.post("/students/courses/add/all", authenticateToken, (req, res) => {
    PostEndpoints.AddAllStudentCourses(req, res);
});

//-----------------     ADD POSITION     -------------------

app.post("/position/add", authenticateToken, (req, res) => {
    PostEndpoints.AddPosition(req, res);
});

//-----------------     ADD STAFF MEMBER     -------------------

app.post("/staff/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStaff(req, res);
});

//-----------------     UPDATE STAFF MEMBER     -------------------

app.post("/staff/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateStaff(req, res);
});

//-----------------     CHANGE PASSWORD     -------------------

app.post("/users/password/change", authenticateToken, (req, res) => {
    PostEndpoints.ChangePassword(req, res);
});

//-----------------     ADD NEWS EVENT     -------------------

app.post("/news/add", authenticateToken, (req, res) => {
    PostEndpoints.AddNewsEvent(req, res);
});

//-----------------     ADD DIRECT MESSAGE     -------------------

app.post("/chat/messages/add", authenticateToken, (req, res) => {
    PostEndpoints.AddDirectMessage(req, res);
});

//-----------------     MARK MESSAGES AS READ     -------------------

app.post("/chat/messages/mark-as-read", authenticateToken, PostEndpoints.MarkMessagesAsRead);

//-----------------     ADD SUGGESTION     -------------------

app.post("/suggestions/add", authenticateToken, (req, res) => {
    PostEndpoints.AddSuggestion(req, res);
});

//-----------------     ADD HOME FILE     -------------------

app.post("/home/files/add", authenticateToken, (req, res) => {
    PostEndpoints.AddHomeFile(req, res);
});

//-----------------     ADD ROOT RESOURCE TOPIC     -------------------

app.post("/resources/topics/root/add", authenticateToken, (req, res) => {
    PostEndpoints.AddRootResourceTopic(req, res);
});

//-----------------     ADD SUB RESOURCE TOPIC     -------------------

app.post("/resources/topics/sub/add", authenticateToken, (req, res) => {
    PostEndpoints.AddSubResourceTopic(req, res);
});

//-----------------     ADD RESOURCE FILE     -------------------

app.post("/resources/files/add", authenticateToken, (req, res) => {
    PostEndpoints.AddResourceFile(req, res);
});

//-----------------     ADD QUIZ     -------------------

app.post("/course/quizzes/add", authenticateToken, (req, res) => {
    PostEndpoints.AddQuiz(req, res);
});

//-----------------     UPDATE QUIZ     -------------------

app.post("/course/quiz/update", authenticateToken, PostEndpoints.UpdateQuiz);

//-----------------     ADD QUIZ QUESTION     -------------------

app.post("/course/quiz/questions/add", authenticateToken, (req, res) => {
    PostEndpoints.AddQuizQuestion(req, res);
});

//-----------------     ADD QUIZ ANSWER     -------------------

app.post("/course/quiz/question/answers/add", authenticateToken, (req, res) => {
    PostEndpoints.AddQuizAnswer(req, res);
});

//-----------------     ADD STUDENT QUIZ     -------------------

app.post("/student/quizzes/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudentQuiz(req, res);
});

//-----------------     ADD STUDENT QUIZ UNSTRUCTURED ANSWER     -------------------

app.post("/student/quiz/answers/unstructured/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudentQuizUnstructuredAnswer(req, res);
});

//-----------------     ADD STUDENT QUIZ STRUCTURED ANSWER     -------------------

app.post("/student/quiz/answers/structured/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudentQuizStructuredAnswer(req, res);
});

//-----------------     ADD STUDENT QUIZ FILE     -------------------

app.post("/student/quiz/answers/file/add", authenticateToken, (req, res) => {
    PostEndpoints.AddStudentQuizFile(req, res);
});

//-----------------     ADD PARENT     -------------------

app.post("/parents/add", authenticateToken, (req, res) => {
    PostEndpoints.AddParent(req, res);
});

//-----------------     ADD FILE FOR PARENTS     -------------------

app.post("/parents/files/add", authenticateToken, (req, res) => {
    PostEndpoints.AddFileForParents(req, res);
});

//-----------------     ADD PARENT FINANCIAL STATEMENT     -------------------

app.post("/parent/statements/add", authenticateToken, (req, res) => {
    PostEndpoints.AddFinancialStatement(req, res);
});

//-----------------     ADD PARENT STUDENT     -------------------

app.post("/parent/students/add", authenticateToken, (req, res) => {
    PostEndpoints.AddParentStudent(req, res);
});

//-----------------     ADD PARENT REGISTRATION REQUEST     -------------------

app.post("/parents/registrations/add", (req, res) => {
    PostEndpoints.AddParentRegistrationRequest(req, res);
});

//-----------------     ADD TERMS AND CONDITIONS FILE     -------------------

app.post("/terms-conditions/add", (req, res) => {
    PostEndpoints.AddTermsAndConditionsFile(req, res);
});

//-----------------     ADD TERMS AND CONDITIONS ACCEPTED     -------------------

app.post("/terms-conditions/accepted/add", (req, res) => {
    PostEndpoints.AddTermsAndConditionsAccepted(req, res);
});

//-----------------     ADD LINK     -------------------

app.post("/links/add", authenticateToken, PostEndpoints.AddLink);

//-----------------     CHECK TERMS AND CONDITIONS ACCEPTED     -------------------

app.post("/terms-conditions/accepted/check", (req, res) => {
    PostEndpoints.CheckTermsAndConditionsAccepted(req, res);
});

//-----------------     UPDATE PARENT     -------------------

app.post("/parent/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateParent(req, res);
});

//-----------------     UPDATE PARENT FINANCES BALANCE     -------------------

app.post("/parent/finances/balance/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateParentFinancesBalance(req, res);
});

//-----------------     UPDATE PARENT FINANCES NEXT PAYMENT DUE     -------------------

app.post("/parent/finances/payment-date/update", authenticateToken, (req, res) => {
    PostEndpoints.UpdateParentFinancesNextPaymentDue(req, res);
});

//-----------------     APPROVE LINK     -------------------

app.post("/link/approve", authenticateToken, PostEndpoints.ApproveLink);

//-----------------     MARK LINK FOR DELETION     -------------------

app.post("/link/mark/deletion", authenticateToken, PostEndpoints.MarkLinkForDeletion);

//-----------------     UNMARK LINK FOR DELETION     -------------------

app.post("/link/unmark/deletion", authenticateToken, PostEndpoints.UnMarkLinkForDeletion);

//-----------------     DELETE COURSE     -------------------

app.post("/course/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteCourse(req, res);
});

//-----------------     DELETE COURSE TOPIC     -------------------

app.post("/course/topics/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteCourseTopic(req, res);
});

//-----------------     REJECT COURSE MATERIAL     -------------------

app.post("/course/material/reject", authenticateToken, (req, res) => {
    PostEndpoints.DeleteCourseMaterial(req, res);
});

//-----------------     DELETE COURSE MATERIAL     -------------------

app.post("/course/material/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteCourseMaterial(req, res);
});

//-----------------     DELETE COURSE ASSIGNMENT     -------------------

app.post("/course/assignments/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteCourseAssignment(req, res);
});

//-----------------     DELETE COURSE ANNOUNCEMENT     -------------------

app.post("/course/announcements/delete", authenticateToken, PostEndpoints.DeleteCourseAnnouncement);

//-----------------     DELETE COURSE ASSESSMENT     -------------------

app.post("/course/assessments/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteCourseAssessment(req, res);
});

//-----------------     DELETE STAFF    -------------------

app.post("/staff/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteStaff(req, res);
});

//-----------------     DELETE STUDENT    -------------------

app.post("/students/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteStudent(req, res);
});

//-----------------     DELETE STUDENT ASSIGNMENT     -------------------

app.post("/course/assignments/student/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteStudentAssignment(req, res);
});

//-----------------     DELETE STUDENT COURSE     -------------------

app.post("/students/courses/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteStudentCourse(req, res);
});

//-----------------     DELETE NEWS EVENT     -------------------

app.post("/news/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteNewsEvent(req, res);
});

//-----------------     REMOVE COURSE TAUGHT     -------------------

app.post("/staff/courses/remove", authenticateToken, (req, res) => {
    PostEndpoints.RemoveCourseTaught(req, res);
});

//-----------------     DELETE HOME FILE     -------------------

app.post("/home/files/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteHomeFile(req, res);
});

//-----------------     DELETE RESOURCE FILE     -------------------

app.post("/resources/files/delete", authenticateToken, PostEndpoints.DeleteResourceFile);

//-----------------     DELETE RESOURCE TOPICS     -------------------

app.post("/resources/topics/delete", authenticateToken, PostEndpoints.DeleteResourceTopic);

//-----------------     DELETE QUIZ     -------------------

app.post("/course/quizzes/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteQuiz(req, res);
});

//-----------------     DELETE QUIZ QUESITON     -------------------

app.post("/course/quiz/questions/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteQuizQuestion(req, res);
});

//-----------------     DELETE QUIZ ANSWER     -------------------

app.post("/course/quiz/question/answers/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteQuizAnswer(req, res);
});

//-----------------     DELETE STUDENT QUIZ FILE     -------------------

app.post("/student/quiz/answers/file/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteStudentQuizFile(req, res);
});

//-----------------     DELETE PARENT     -------------------

app.post("/parent/delete", authenticateToken, PostEndpoints.DeleteParent);

//-----------------     DELETE PARENT FINANCIAL STATEMENT     -------------------

app.post("/parent/statements/delete", authenticateToken, PostEndpoints.DeleteParentFinancialStatement);

//-----------------     DELETE FILE FOR PARENTS     -------------------

app.post("/parent/files/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteFileForParents(req, res);
});

//-----------------     DELETE PARENT REGISTRATION REQUEST     -------------------

app.post("/parents/registrations/delete", authenticateToken, (req, res) => {
    PostEndpoints.DeleteParentRegistrationRequest(req, res);
});

//-----------------     DELETE TERMS AND CONDITIONS FILE     -------------------

app.post("/terms-conditions/delete", authenticateToken, PostEndpoints.DeleteTermsAndConditionsFile);

//-----------------     DELETE LINK     -------------------

app.post("/links/delete", authenticateToken, PostEndpoints.DeleteLink);

//-----------------     DELETE ASSIGNMENT LINK     -------------------

app.post("/assignment/links/delete", authenticateToken, PostEndpoints.DeleteAssignmentLink);



//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------



//------   TEST ENDPOINT   --------------
app.get("/test/:data", (req, res) => {
    let data = JSON.parse(req.params.data);
    console.log(data);
});

//----------------------------------------------
//----------------------------------------------



//----------------------------------------------
//
//      WS SETUP
//
//----------------------------------------------


//----   STORES USER ID'S MAPPED TO SOCK ID'S   ----

const clientSockIDMap: Map<number, string> = new Map();

enum WS_TOPICS {
    INIT = "init",
    DIRECT_MESSAGE_RECV = "direct-message-recv"
}

io.on('connection', (socket) => {

    //----------------------------------------------
    //      SET USERNAME AND SOCK ID IN MAP
    //----------------------------------------------

    socket.on(WS_TOPICS.INIT, (data) => {
        let userID: string = JSON.parse(data);
        clientSockIDMap.set(parseInt(userID), socket.id);
    });

});

//----   SEND DIRECT MESSAGE   ----

export function emitDirectMessage(userID: number, data: any) {

    if (clientSockIDMap.has(userID)) {
        io.to(clientSockIDMap.get(userID)).emit(WS_TOPICS.DIRECT_MESSAGE_RECV, data);
    }

}

//----------------------------------------------
//----------------------------------------------



//----------------------------------------------
//      SET SERVER TO LISTEN ON PORT 8081
//----------------------------------------------

server.listen(8081, 'localhost', () => {
    console.log("...server is running...");
});

//----------------------------------------------
//----------------------------------------------
