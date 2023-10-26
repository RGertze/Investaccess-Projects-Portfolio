// base token interface
interface IUser {
    username: string
}

// base course interface
interface ICourse {
    courseID: number
}



//----------------------------------------------
//      RESPONSE INTERFACES
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

export interface ICheckAdminResourcePassword {
    adminID: number,
    password: string
}

export interface ISetAdminResourcePassword extends ICheckAdminResourcePassword { }

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

export interface IGetCoursesTakenByStudent extends IUser { }

export interface IGetCoursesShort { }

export interface IGetCoursesByGradeShort {
    grade: number
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

export interface IGetAllMaterials { }

export interface IGetMaterialPath extends ICourse {
    topicID: number,
    materialName: string
}

export interface IGetCourseAssignments extends ICourse { }

export interface IGetCourseAssessments extends ICourse { }

export interface IGetCourseAnnouncements extends ICourse { }

export interface IGetStudentReports {
    studentID: number
}

export interface IGetAssignmentPath extends ICourse {
    assignmentName: string
}

export interface IGetStudentAssignmentPaths extends IUser {
    assignmentPath: string
}

export interface IGetAssignmentMarksByCourse extends IUser, ICourse { }

export interface IGetAssessmentMarksByCourse extends IUser, ICourse { }

export interface IGetAssignmentMark extends IUser {
    assignmentPath: string
}

export interface IGetCourseMarks extends IUser { }

export interface IGetAllStudents { }

export interface IGetStudentsByGrade {
    grade: number
}

export interface IGetStudentsInCourse extends ICourse { }

export interface IGetStudentsWithMerritsByCourse extends ICourse { }

export interface IGetStaffMembers { }

export interface IGetStaffShort { }

export interface IGetOtherCourseStaff {
    courseID: number
}

export interface IGetStudentDetails {
    studentID: number
}

export interface IGetStaffDetails {
    staffID: number
}

export interface IGetCoursesTaughtByStaff {
    staffID: number
}

export interface IGetCoursesTaughtByStaffDetailed extends IGetCoursesTaughtByStaff { }

export interface IGetAllMessagesBetweenUsers {
    userID1: number,
    userID2: number
}

export interface IGetPositionsShort { }

export interface IGetSignedGetUrl {
    filePath: string
}
export interface IGetSignedPostUrl {
    originalFileName: string
}

export interface IGetFilesToDelete { }

export interface IGetNewsEvents { }

export interface IGetParentEmails { }

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

export interface IGetRootResourceTopicsForStaff {
}

export interface IGetRootResourceTopicsForStudents {
}

export interface IGetSubResourceTopicsForStaff {
    parentTopicID: number,
    staffID: number
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

export interface IGetAllParents { }

export interface IGetParentDetails {
    parentID: number
}

export interface IGetAllTimetables { }

export interface IGetAllCalendars { }

export interface IGetAllSupportDocuments { }

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

export interface IGetLinksForAssignments {
    assignmentPath: string
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

export interface IAddCourseAnnouncement extends ICourse {
    message: string
}

export interface IAddCourseMaterial extends ICourse {
    courseTopicID: number,
    materialPath: string,
    materialName: string
}

export interface IAddCourseAssignment {
    assignmentPath: string,
    courseID: number,
    assignmentName: string,
    dueDate: string,
    marksAvailable: number
}

export interface IAddCourseAssessment {
    courseID: number,
    assessmentName: string,
    marksAvailable: number,
    contributionToTotal: number
}

export interface IAddStudentAssessmentMark {
    studentID: number,
    courseAssessmentID: number
}

export interface IAddStudentAssignment {
    studentID: number,
    courseAssignmentPath: string,
    assignmentPath: string,
    assignmentName: string,
    mark: number
}

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

export interface IAddRootResourceTopic {
    topicName: string,
    visibleToStudents: number
}

export interface IAddSubResourceTopic {
    parentTopicID: number,
    topicName: string,
    courseID: number
}

export interface IAddResourceFile {
    topicID: number,
    filePath: string,
    fileName: string
}

export interface IAddQuiz {
    courseID: number,
    name: string,
    attemptsAllowed: number,
    openTime: string,
    closeTime: string,
    duration: number
}

export interface IAddQuizQuestion {
    quizID: number,
    qType: number,
    value: string,
    marksAvailable: number
}

export interface IAddQuizAnswer {
    quizQuestionID: number,
    value: string,
    isCorrect: number
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

export interface IAddParentRegistrationRequest {
    idNum: string,
    pword: string,
    pName: string,
    pSurname: string,
    pEmail: string,
    pMobile: string,
    pAddr: string,
    pHomeLang: string,
    pReligion: string,
    pChildInfo: string
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

export interface IApproveCourseMaterial {
    materialPath: string
}

export interface IUpdateCourseAssignment extends ICourse {
    assignmentPath: string
    dueDate: string,
    marksAvailable: number
}

export interface IUpdateStaff {
    staffID: number,
    posID: number,
    name: string,
    surname: string,
    age: number,
    cell: string,
    email: string
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

export interface IUpdateStudentAssignment extends IUser {
    courseAssignmentPath: string,
    StudentAssignmentPath: string
}

export interface IUpdateStudentAssignmentMark extends IUser {
    courseAssignmentPath: string,
    mark: number
}

export interface IUpdateStudentAssessmentMark extends IUser {
    assessmentID: number,
    mark: number
}

export interface IChangePassword {
    userType: number,
    userID: number,
    newPassword: string
}

export interface IMarkMaterialForDeletion {
    materialPath: string
}

export interface IUnmarkMaterialForDeletion {
    materialPath: string
}

export interface IMarkMessagesAsRead {
    fromUserID: number,
    toUserID: number
}

export interface IUpdateQuiz {
    quizID: number,
    name: string,
    attemptsAllowed: number,
    openTime: string,
    closeTime: string,
    duration: number
}

export interface IUpdateStudentQuizStructuredAnswerMark {
    studentID: number,
    quizID: number,
    questID: number,
    attemptNum: number,
    mark: number
}

export interface IMarkStudentQuiz {
    studentID: number,
    quizID: number,
    attemptNum: number
}

export interface IEndStudentQuizAttempt {
    studentID: number,
    quizID: number,
    attemptNum: number
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

export interface IMarkLinkForDeletion {
    linkPath: string,
    linkType: number,
    linkTopicID: number
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

export interface IDeleteCourseAssignment extends IDeleteCourseMaterial { }

export interface IDeleteCourseAssessment {
    assessmentID: number
}

export interface IDeleteCourseAnnouncement {
    caID: number
}

export interface IDeleteStaff {
    staffID: number
}

export interface IDeleteStudent {
    studentID: number
}

export interface IDeleteStudentAssignment extends IDeleteCourseMaterial { }

export interface IDeleteStudentCourse {
    studentID: number,
    courseID: number
}

export interface IDeleteFilesToDelete { }

export interface IDeleteSingleFileToDelete {
    filePath: string
}

export interface IDeleteNewsEvent {
    newsImgPath: string
}

export interface IDeleteHomeFile {
    filePath: string
}

export interface IDeleteResourceFile {
    filePath: string
}

export interface IDeleteResourceTopic {
    topicID: number
}

export interface IDeleteQuiz {
    quizID: number
}

export interface IDeleteQuizQuestion {
    questionID: number
}

export interface IDeleteQuizAnswer {
    answerID: number
}

export interface IDeleteStudentQuizFile {
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

export interface IDeleteAssignmentLink {
    linkPath: string,
    assignmentPath: string
}


//------    REMOVE INTERFACES   --------

export interface IRemoveCourseTaught extends ICourse {
    courseID: number,
    staffID: number
}

//------    HELPER INTERFACES   --------

export interface IGenerateInitialStudentAssignmentMarkRecords {
    courseID: number,
    assignmentPath: string
}

//------    RESPONSE INTERFACES   --------

export interface ISignedGetUrl {
    url: string
}

export interface ISignedPostUrl {
    url: string,
    filePath: string
}

//------    DB RESULT INTERFACES   --------

export interface IPassword {
    Password: string
}

export interface IFileToDelete {
    File_Path: string
}

export interface IParentEmail {
    email: string
}
