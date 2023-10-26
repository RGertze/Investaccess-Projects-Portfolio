export interface IHealthSummaryAll {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    profilePicPath: string,
    createdAt: string,
    updatedAt: string
}

export interface IHealthSummarySingle {
    id: number,
    patientId: number,
    doctorId: number,
    content: string,
}