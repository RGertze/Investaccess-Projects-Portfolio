import { WSConnection } from "./connection";

export interface IMaterial {
    material_ID: string,
    material_Name: string
}


//--------------------------------------------------------------------------------------------
//      CONNECTION INTERFACES
//--------------------------------------------------------------------------------------------

// base token interface
interface IUser {
    username: string
}

// base course interface
interface ICourse {
    courseID: number
}



//----------------------------------------------
//      GLOBAL CONTEXT
//----------------------------------------------
export interface IGlobalContextState {
    token: string,
    setToken(newToken: string): void,

    newMessagesAvail: boolean,
    setNewMessagesAvail(newMsgAvail: boolean): void,

    wsConn: WSConnection,
    setWsConn(userID: string, appendMsg: any, handleMsgNotif: any): void,

    checkForUnreadMessages(): void
}


//----------------------------------------------
//      RESPONSE INTERFACE
//----------------------------------------------
export interface IResponse {
    stat: string,
    token: string,
    data: any,
    error: string
}



//----------------------------------------------
//      USER REQUEST INTERFACES
//----------------------------------------------

export interface ILogin {
    loginType: number,
    username: string,
    password: string
}

export interface IUpload extends IUser {
    fileData: FormData
}


//------    GET INTERFACES   --------

export interface IGetEnrolled extends IUser { }

export interface IGetCoursesByGrade {
    grade: number
}

export interface IGetCourseOverview {
    courseID: number
}

export interface IGetCourseTopics {
    courseID: number
}

export interface IGetSubtopics {
    parentTopicID: number
}

export interface IGetMaterialByTopic extends ICourse {
    topicID: number
}

export interface IGetMaterialPath extends ICourse {
    topicID: number,
    materialName: string
}

export interface IGetCourseAssignments extends ICourse { }

export interface IGetCourseAnnouncements extends ICourse { }

export interface IGetAssignmentPath extends ICourse {
    assignmentName: string
}

export interface IGetAssignmentMarksByCourse extends IUser, ICourse { }

export interface IGetCourseMarks extends IUser { }

export interface IGetAssessmentMarksByCourse extends IUser, ICourse { }

export interface IGetStudentReports {
    studentID: number
}

export interface IGetStudentAssignmentPaths extends IUser {
    assignmentPath: string
}

export interface IGetStudentDetails {
    studentID: number
}

export interface IGetNewsEvents { }

export interface IGetUsersToMessage {
    userID: number,
    userType: number
}

export interface IGetAllMessagesBetweenUsers {
    userID1: number,
    userID2: number
}

export interface IGetHomeFilesBySection {
    section: string
}

export interface IGetRootResourceTopicsForStudents {
}

export interface IGetSubResourceTopicsForStudents {
    parentTopicID: number
}

export interface IGetResourceFilesByTopic {
    topicID: number
}

export interface IGetQuizzesByCourse {
    courseID: number
}

export interface IGetQuizQuestions {
    quizID: number
}

export interface IGetQuizAnswers {
    quizQuestionID: number
}

export interface IGetStudentQuizAttempts {
    studentID: number,
    quizID: number
}

export interface IGetStudentQuizFiles {
    studentID: number,
    quizID: number,
    attemptNum: number,
    questID: number
}

export interface IGetStudentQuizUnstructuredAnswers {
    studentID: number,
    quizID: number,
    attemptNum: number,
    questID: number
}

export interface IGetStudentQuizStructuredAnswer {
    studentID: number,
    quizID: number,
    attemptNum: number,
    questID: number
}

export interface IGetLinksForMaterials {
    topicID: number
}

export interface IGetLinksForAssignments {
    assignmentPath: string
}
export interface IGetHomeSectionLinks {
    linkType: number
}



export interface IGetSignedGetUrl {
    filePath: string
}
export interface IGetSignedPostUrl {
    originalFileName: string
}



//------    ADD INTERFACES   --------

export interface IAddStudentAssignment {
    studentID: number,
    courseAssignmentPath: string,
    assignmentPath: string,
    assignmentName: string,
    mark: number
}

export interface IAddSuggestion {
    message: string
}

export interface IAddDirectMessage {
    fromID: number,
    toID: number,
    message: string
}

export interface IAddStudentQuiz {
    studentID: number,
    quizID: number
}

export interface IAddStudentQuizUnstructuredAnswer {
    studentID: number,
    quizID: number,
    attemptNum: number,
    questID: number,
    ansID: number
}

export interface IAddStudentQuizStructuredAnswer {
    studentID: number,
    quizID: number,
    attemptNum: number,
    questID: number,
    ans: string
}

export interface IAddStudentQuizFile {
    filePath: string,
    studentID: number,
    quizID: number,
    attemptNum: number,
    questID: number,
    fileName: string
}

//------    UPDATE INTERFACES   --------

export interface IUpdateStudentAssignment extends IUser {
    courseAssignmentPath: string,
    StudentAssignmentPath: string
}

export interface IEndStudentQuizAttempt {
    studentID: number,
    quizID: number,
    attemptNum: number
}

export interface IMarkMessagesAsRead {
    fromUserID: number,
    toUserID: number
}

//------    DELETE INTERFACES   --------

export interface IDeleteStudentAssignment {
    path: string
}

export interface IDeleteStudentQuizFile {
    filePath: string
}



//----------------------------------------------
//      QRY RESULT INTERFACES
//---------------------------------------------- 

export interface ICourseDetails {
    Course_ID: number,
    Course_Name: string,
    Course_Desc: string,
    Staff_Name: string
}

export interface IEnrolledCourses extends ICourseDetails { }

export interface ICoursesByGrade extends ICourseDetails { }

export interface ICourseOverview {
    Course_Topic_Name: string,
    Course_Assignments: number
}

export interface ICourseTopic {
    Course_Topic_ID: number,
    Course_Topic_Name: string
}

export interface ICourseMaterial {
    Course_Material_Path: string,
    Course_Material_Name: string
}

export interface IMaterialPath {
    Course_Material_Path: string
}

export interface ICourseAssignment {
    Course_Assignment_Path: string,
    Course_Assignment_Name: string,
    Course_Assignment_Due_Date: Date,
    Course_Assignment_Marks_Available: number
}

export interface ICourseAnnouncement {
    Course_Announcement_Message: string,
    Course_Announcement_Date: string,
    Staff_Name: string
}

export interface IAssignmentPath {
    Course_Assignment_Path: string
}

export interface IAssignmentMarksByCourse {
    Course_Assignment_Name: string,
    Course_Assignment_Marks_Available: number,
    Assignment_Mark: number
}

export interface IAssessmentMark {
    Course_Assessment_Name: string,
    Course_Assessment_Marks_Available: number,
    Course_Assessment_Contribution: number,
    Assessment_Mark: number
}

export interface ICourseMark {
    Course_Name: string,
    Student_Course_Mark: number
}

export interface IStudentReportCard {
    Student_Report_Path: string,
    Student_Report_Name: string,
    Student_Report_Term: number,
    Student_Report_Year: number
}

export interface IStudentAssignmentPaths {
    Student_Assignment_File_Path: string,
    Student_Assignment_File_Name: string
}

export interface IStudentDetails {
    Student_ID: number,
    Student_Name: string,
    Student_Age: number,
    Student_Grade: number
    Student_Guardian_Cell: string,
    Student_Guardian_Email_M: string,
    Student_Guardian_Email_F: string
}

export interface INewsEvent {
    News_Events_Title: string,
    News_Events_Content: string,
    News_Events_Date_Added: Date,
    News_Events_Img_Path: string
}

export interface IChatUser {
    userID: number,
    userName: string,
    newMessages: number
}

export interface ICheckUnreadMsgsResult {
    newMessages: number
}

export interface ICheckForUnreadMessages {
    userID: number
}

export interface IDirectMessage {
    From_User_ID: number,
    Message_Content: string,
    Message_Date_Added: string
}

export interface IHomeFile {
    Home_File_Path: string,
    Home_File_Name: string
}

export interface IResourceTopic {
    Resource_Topic_ID: number,
    Resource_Topic_Name: string,
    Course_ID: number
}

export interface IResourceFile {
    Resource_File_Path: string,
    Resource_File_Name: string,
    Resource_File_Date_Added: string
}

export interface IQuiz {
    Quiz_ID: number,
    Quiz_Name: string,
    Quiz_Opening_Time: string,
    Quiz_Closing_Time: string,
    Quiz_Duration: number,
    Quiz_Marks_Available: number
}

export interface IQuizQuestion {
    Quiz_Question_ID: number,
    Quiz_Question_Type: number,
    Quiz_Question_Number: number,
    Quiz_Question_Value: string,
    Quiz_Question_Marks_Available: number,
    Quiz_Question_Has_Multiple_Answers: any
}

export interface IQuizAnswer {
    Quiz_Answer_ID: number,
    Quiz_Answer_Value: string,
    Quiz_Answer_Is_Correct: any
}

export interface IStudentQuiz {
    Student_Quiz_Attempt_Number: number,
    Student_Quiz_Start_Time: string,
    Student_Quiz_End_Time: string,
    Student_Quiz_Mark_Obtained: number,
    Student_Quiz_Graded: any,
    In_Progress: any
}

export interface IStudentQuizFile {
    Student_Quiz_File_Path: string,
    Student_Quiz_File_Name: string
}

export interface IStudentQuizUnstructuredAnswer {
    Quiz_Answer_ID: number
}

export interface IStudentQuizStructuredAnswer {
    Student_Quiz_Structured_Answer_Value: string
}

export interface ILink {
    Link_Path: string,
    Link_Name: string
}



export interface ISignedGetUrl {
    url: string
}

export interface ISignedPostUrl {
    url: string,
    filePath: string
}
