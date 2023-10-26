export interface IProgressReport {
    id: number,
    name: string,
    examMarksAvailable: number,
    examWeight: number
}

export interface IProgressReportCategory {
    id: number,
    progressReportId: number,
    name: string,
    weight: number
}

export interface IProgressReportAssessment {
    id: number,
    progressReportCategoryId: number,
    name: string,
    marksAvailable: number
}

export interface ICourseProgressReport {
    id: number,
    courseId: number,
    year: number,
    numberOfTerms: number,
    progressReportId: number,
    name: string,
    examWeight: number
}

export interface IStudentProgressReport {
    progressReportId: number,
    progressReporName: string,

    courseProgressReportId: number,
    courseId: string,
    numberOfTerms: number,
    year: number
}

export interface IStudentAssessment {
    studentNumber: string,
    firstName: string,
    lastName: string,

    categoryId: number,

    progressReportAssessmentId: number,
    marksAvailable: number,
    id: number,
    name: string,
    mark: number,
    term: number
}

export interface IStudentExamMark {
    studentNumber: string,
    firstName: string,
    lastName: string,

    examMarksAvailable: number,
    id: number,
    name: string,
    mark: number,
    term: number
}


export interface IPrePrimaryProgressReport {
    id: number,
    year: number,
    terms: number,
}

export interface IStudentPrePrimaryProgressReport {
    id: number,
    progressReportId: number,
    year: number,
    terms: number,

    studentNumber: string,
    firstName: string,
    lastName: string,
}