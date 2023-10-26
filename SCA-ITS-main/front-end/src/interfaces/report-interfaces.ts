export interface IReportGroup {
    id: number,
    year: number,
    terms: number
}

export interface IReport {
    studentNumber: string,
    firstName: string,
    lastName: string,
    grade: number,

    reportdId: number
}

export interface IReportDetails {
    daysAbsent: number,
    personaBriefComments: string,
    remarks: string,
    registerTeacher: string,
    dominantHand: number,
}

export interface IPersonaCategory {
    id: number,
    name: string
}
export interface IPersona {
    id: number,
    categoryId: number,
    name: string,
}

export interface IPersonaGrade {
    id: number,
    grade: number,
    term: number,

    categoryId: number,
    personaName: string
}

export interface IDevelopmentGroup {
    id: number,
    name: string
}
export interface IDevelopmentCategory {
    id: number,
    groupId: number,
    name: string,
}
export interface IDevelopmentAssessment {
    id: number,
    categoryId: number,
    name: string,
}
export interface IDevelopmentAssessmentGrade {
    id: number,
    assessmentId: number,
    term: number,
    grade: string
}

export interface ICourseRemark {
    id: number,
    remark: string,
    initials: string,
    courseName: string,
}

export interface IReportGenerationJob {
    id: number,
    reportGroupId: number,
    term: number,
}

export interface IGeneratedReport {
    id: number,
    status: number,
    failureMessage: string,
    filePath: string,

    studentNumber: string,
    firstName: string,
    lastName: string,
    grade: number
}

export interface IStudentReportFile {
    id: number,
    status: number,
    filePath: string,

    year: number,
    term: number
}

export enum REPORT_GENERATION_STATUS {
    PENDING = 0,
    RUNNING = 1,
    FAILED = 2,
    SUCCESSFUL = 3
}

export function getReportGenerationStatusColour(status: REPORT_GENERATION_STATUS) {
    if (status === REPORT_GENERATION_STATUS.FAILED)
        return "danger";
    if (status === REPORT_GENERATION_STATUS.SUCCESSFUL)
        return "success";
    return "warning";
}