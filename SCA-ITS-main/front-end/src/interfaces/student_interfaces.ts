export interface IStudent {
    parentId: number,
    studentNumber: string,
    firstName: string,
    lastName: string,
    dob: string,
    grade: number,

    // general info
    age: number,
    gender: number,
    citizenship: string,
    studyPermit: string,
    homeLanguage: string,
    postalAddress: string,
    residentialAddress: string,
    telephoneHome: string,
    telephoneOther: string,

    // religious info
    currentChurch: string,
    currentChurchAddress: string,
    pastor: string,
    pastorTelephone: string,
    fatherConfirmationDate: string,
    motherConfirmationDate: string,
    baptismDate: string,

    // scholastic info
    currentGrade: number,
    lastSchoolAttended: string,
    nameOfPrincipal: string,
    schoolAddress: string,
    studentsStrengths: string,
    talentsAndInterests: string,
    learningDifficulties: string,
    disiplinaryDifficulties: string,
    legalDifficulties: string,
    academicLevel: string,
    academicFailureAssessment: string,

    // medical info
    familyDoctor: string,
    doctorTelephone: string,
    otherMedicalConditions: string,
    generalHearingTestDate: string,
    generalVisionTestDate: string,
    tuberculosisTestDate: string,
    isShy: number,
    bitesFingerNails: number,
    sucksThumb: number,
    hasExcessiveFears: number,
    likesSchool: number,
    playsWellWithOthers: number,
    eatsBreakfastRegularly: number,
    bedtime: string,
    risingTime: string,
    disabilityDueToDiseaseOrAccident: string,
    chronicMedication: string,

    registrationStage: number,
    rejectionMessage: string,
    approvalRequested: number,

    createdAt: string,
}

export interface IStudenetRegistrationRequest {
    studentNumber: string,
    firstName: string,
    lastName: string
}

export interface INonScaSibling {
    id: number,
    studentNumber: string,
    name: string,
    age: number
}