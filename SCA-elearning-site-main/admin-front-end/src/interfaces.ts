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
//      RESPONSE INTERFACE
//----------------------------------------------
export interface IResponse {
    stat: string,
    token: string,
    data: any,
    error: string
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
//      USER REQUEST INTERFACES
//----------------------------------------------

export interface ILogin {
    loginType: number,
    username: string,
    password: string
}

export interface ICheckAdminResourcePassword {
    adminID: number,
    password: string
}

export interface ISetAdminResourcePassword extends ICheckAdminResourcePassword { }


//------    GET INTERFACES   --------

export interface IGetCourseTopics {
    courseID: number
}

export interface IGetSubtopics {
    parentTopicID: number
}

export interface IGetMaterialByTopic extends ICourse {
    topicID: number
}

export interface IGetAllMaterials { }

export interface IGetCoursesByGrade {
    grade: number
}

export interface IGetCoursesShort { }

export interface IGetCoursesByGradeShort {
    grade: number
}

export interface IGetCoursesTakenByStudent extends IUser { }

export interface IGetCourseMarks extends IUser { }

export interface IGetCourseAssignments extends ICourse { }

export interface IGetStudentsInCourse extends ICourse { }

export interface IGetAllStudents { }

export interface IGetStudentsByGrade {
    grade: number
}

export interface IGetStudentsWithMerritsByCourse extends ICourse { }

export interface IGetStudentReports {
    studentID: number
}

export interface IGetAssignmentMark extends IUser {
    assignmentPath: string
}

export interface IGetStaffMembers { }

export interface IGetStaffShort { }

export interface IGetOtherCourseStaff {
    courseID: number
}

export interface IGetCoursesTaughtByStaff {
    staffID: number
}

export interface IGetPositionsShort { }

export interface IGetNewsEvents { }

export interface IGetAllMessagesBetweenUsers {
    userID1: number,
    userID2: number
}

export interface IGetUsersToMessage {
    userID: number,
    userType: number
}

export interface ICheckForUnreadMessages {
    userID: number
}

export interface IGetHomeFilesBySection {
    section: string
}

export interface IGetAllParents { }

export interface IGetAllFiles { }


export interface IGetSignedGetUrl {
    filePath: string
}

export interface IGetSignedPostUrl {
    originalFileName: string
}

export interface IGetParentFinances {
    parentID: number
}

export interface IGetParentFinancialStatements {
    parentID: number
}

export interface IGetParentStudents {
    parentID: number
}

export interface IGetParentRegistrationRequests { }

export interface IGetParentRegistrationStudentInfo {
    idNum: string
}

export interface IGetTermsAndConditionsFiles { }

export interface ICheckTermsAndConditionsAccepted {
    parentID: number
}

export interface IGetLinksForMaterials {
    topicID: number
}

export interface IGetHomeSectionLinks {
    linkType: number
}


//------    SEARCH INTERFACES   --------

export interface ISearchAllStudents {
    name: string,
    surname: string
}

export interface ISearchStudentsInCourse extends ICourse {
    name: string,
    surname: string
}

export interface ISearchStaff {
    name: string,
    surname: string
}


//------    ADD INTERFACES   --------

export interface IAddPosition {
    posName: string,
    posDesc: string,
    posLevel: number
}

export interface IAddStaff {
    positionID: number,
    staffName: string,
    staffSurname: string,
    staffAge: number,
    staffCell: string,
    staffEmail: string,
    staffPassword: string
}

export interface IAddStudent {
    studentFirstname: string,
    studentSurname: string,
    studentAge: number,
    studentGrade: number,
    studentGuardianCell: string,
    studentGuardianEmailM: string,
    studentGuardianEmailF: string,
    studentPassword: string
}

export interface IAddStudentReport {
    reportPath: string,
    studentID: number,
    reportName: string,
    term: number,
    year: number
}

export interface IAddCourse {
    staffID: number,
    courseName: string,
    courseDesc: string,
    courseGrade: number
}

export interface IAddCourseStaff {
    courseID: number,
    staffID: number
}

export interface IAddCourseTopic {
    courseID: number,
    topicName: string
}

export interface IAddSubtopic {
    parentTopicID: number,
    topicName: string
}

export interface IAddStudentCourse {
    studentID: number,
    courseID: number
}

export interface IAddAllStudentCourses {
    studentID: number
}

export interface IAddNewsEvent {
    title: string,
    content: string,
    imgPath: string
}

export interface IAddSuggestion {
    message: string
}

export interface IAddDirectMessage {
    fromID: number,
    toID: number,
    message: string
}

export interface IAddHomeFile {
    filePath: string,
    fileName: string,
    fileSection: string
}

export interface IAddParent {
    idNum: string,
    pword: string,
    pName: string,
    pSurname: string,
    pEmail: string,
    pMobile: string,
    pAddr: string,
    pHomeLang: string,
    pReligion: string
}

export interface IAddFileForParents {
    filePath: string,
    fileType: number,
    fileName: string
}

export interface IAddParentFinancialStatement {
    filePath: string,
    parentID: number,
    fileName: string,
    statementMonth: string
}

export interface IAddParentStudent {
    parentID: number,
    studentID: number
}

export interface IAddTermsAndConditionsFile {
    filePath: string,
    fileName: string
}

export interface IAddTermsAndConditionsAccepted {
    parentID: number
}

export interface IAddLink {
    linkPath: string,
    linkName: string,
    linkType: number,
    linkTopicID: number,
    linkAssignmentPath: string
}


//------    UPDATE INTERFACES   --------

export interface IUpdateStaff {
    staffID: number,
    posID: number,
    name: string,
    surname: string,
    age: number,
    cell: string,
    email: string
}

export interface IApproveCourseMaterial {
    materialPath: string
}

export interface IApproveLink {
    linkPath: string,
    linkType: number,
    linkTopicID: number
}

export interface IUpdateCourse {
    courseID: number,
    staffID: number,
    courseName: string,
    courseDesc: string
}

export interface IUpdateCourseTopic {
    topicID: number,
    topicName: string
}

export interface IUpdateStudent {
    studentID: number,
    name: string,
    surname: string,
    age: number,
    grade: number,
    cell: string,
    emailM: string,
    emailF: string
}

export interface IUpdateStudentCourse {
    studentID: number,
    courseID: number,
    mark: number
}

export interface IUpdateStudentAssignmentMark extends IUser {
    courseAssignmentPath: string,
    mark: number
}

export interface IChangePassword {
    userType: number,
    userID: number,
    newPassword: string
}

export interface IMarkMessagesAsRead {
    fromUserID: number,
    toUserID: number
}

export interface IUpdateParent {
    idNum: string,
    pName: string,
    pSurname: string,
    pEmail: string,
    pMobile: string,
    pAddr: string,
    pHomeLang: string,
    pReligion: string
}

export interface IUpdateParentFinancesBalance {
    parentID: number,
    balance: number
}

export interface IUpdateParentFinancesNextPaymentDate {
    parentID: number,
    nextDate: string
}


//------    DELETE INTERFACES   --------

export interface IDeleteCourse {
    courseID: number
}

export interface IDeleteCourseTopic {
    topicID: number
}

export interface IDeleteCourseMaterial {
    path: string
}

export interface IDeleteStaff {
    staffID: number
}

export interface IDeleteStudent {
    studentID: number
}

export interface IDeleteStudentCourse {
    studentID: number,
    courseID: number
}

export interface IDeleteNewsEvent {
    newsImgPath: string
}

export interface IDeleteHomeFile {
    filePath: string
}

export interface IDeleteParent {
    idNum: string
}

export interface IDeleteFileForParents {
    filePath: string
}

export interface IDeleteParentRegistrationRequest {
    idNum: string
}

export interface IDeleteFile {
    filePath: string
}

export interface IDeleteLink {
    linkPath: string,
    linkType: number,
    linkTopicID: number
}

//------    REMOVE INTERFACES   --------

export interface IRemoveCourseTaught extends ICourse {
    courseID: number,
    staffID: number
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

export interface ICoursesByGrade extends ICourseDetails { }

export interface IStudentAll {
    Student_ID: number,
    Student_First_Name: string,
    Student_Surname_Name: string,
    Student_Age: number,
    Student_Grade: number,
    Student_Guardian_Cell: string,
    Student_Guardian_Email_M: string,
    Student_Guardian_Email_F: string
}

export interface IStudentAllShort {
    Student_ID: number,
    Student_First_Name: string,
    Student_Surname_Name: string
}

export interface IStudentsInCourse extends IStudentAll { }

export interface IStudentWithMerritsByCourse extends IStudentAll { }

export interface IStudentNotRegistered {
    Student_ID: number,
    Student_First_Name: string,
    Student_Surname_Name: string,
    Student_Grade: number
}

export interface IStudentReportCard {
    Student_Report_Path: string,
    Student_Report_Name: string,
    Student_Report_Term: number,
    Student_Report_Year: number
}

export interface IAssignmentMark {
    Assignment_Mark: number
}

export interface IStaffMember {
    Staff_ID: number,
    Position_Name: string,
    Staff_Name: string,
    Staff_Surname: string,
    Staff_Age: number,
    Staff_Cell: string,
    Staff_Email: string
}

export interface IStaffShort {
    Staff_ID: number,
    Staff_Name: string
}

export interface ICourseTopic {
    Course_Topic_ID: number,
    Course_Topic_Name: string
}

export interface ICourseMaterial {
    Course_Material_Path: string,
    Course_Material_Name: string
}

export interface ICourseMaterialDetailed extends ICourseMaterial {
    Course_Topic_Name: string,
    Course_Name: string
}

export interface ICourseShort {
    Course_ID: number,
    Course_Name: string,
}

export interface ICourseTaughtByStaff extends ICourseShort {
    Course_Grade: number
}

export interface ICourseTakenByStudent extends ICourseShort {
    Course_Desc: string
}

export interface ICourseMark {
    Course_ID: number,
    Course_Name: string,
    Student_Course_Mark: number
}

export interface ICourseAssignment {
    Course_Assignment_Path: string,
    Course_Assignment_Name: string,
    Course_Assignment_Due_Date: Date,
    Course_Assignment_Marks_Available: number
}

export interface IPositionShort {
    Position_ID: number,
    Position_Name: string
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

export interface IDirectMessage {
    From_User_ID: number,
    Message_Content: string,
    Message_Date_Added: string
}

export interface IHomeFile {
    Home_File_Path: string,
    Home_File_Name: string
}

export interface IParent {
    Parent_ID: number,
    Parent_ID_Number: string,
    Parent_Name: string,
    Parent_Surname: string,
    Parent_Email: string,
    Parent_Mobile: string,
    Parent_Address: string,
    Parent_Home_Language: string,
    Parent_Religion: string,
    Parent_Password: string
}

export interface IParentFile {
    File_Path: string,
    File_Type: number,
    File_Name: string,
    File_Date_Added: string
}

export interface IParentFinances {
    Current_Balance: number,
    Next_Payment_Due: string
}

export interface IParentFinancialStatement {
    Statement_File_Path: string,
    Statement_File_Name: string,
    Statement_File_Date_Added: string,
    Statement_Month: string
}

export interface IParentRegistrationStudentInfo {
    Parent_Children_Info: string
}

export interface ITermsAndConditionsFile {
    File_Path: string,
    File_Name: string
}

export interface ILink {
    Link_Path: string,
    Link_Name: string
}

export interface ILinkToApprove {
    Link_Path: string,
    Link_Name: string,
    Link_Topic_ID: number,
    Course_Name: string,
    Course_Topic_Name: string
}



export interface ISignedGetUrl {
    url: string
}

export interface ISignedPostUrl {
    url: string,
    filePath: string
}
