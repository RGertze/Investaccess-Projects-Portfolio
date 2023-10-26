/**
 *  1.  Parent Profile 
 * 
 * 
 * 
 * 
 * 
 */

//  1.  Parent Profile
export interface IParentProfile {
    userId: number,
    idNumber: string,
    employer: string,
    occupation: string,
    monthlyIncome: number,
    workingHours: string,
    specialistSkillsHobbies: string,
    telephoneWork: string,
    telephoneHome: string,
    fax: string,
    cellNumber: string,
    postalAddress: string,
    residentialAddress: string,
    maritalStatus: string,

    registrationStage: number
}

export interface IOtherParent {
    id: number,
    mainParentId: number,
    firstName: string,
    lastName: string,
    idNumber: string,
    employer: string,
    occupation: string,
    monthlyIncome: number,
    workingHours: string,
    specialistSkillsHobbies: string,
    telephoneWork: string,
    telephoneHome: string,
    fax: string,
    cellNumber: string,
    postalAddress: string,
    residentialAddress: string,
    maritalStatus: string,
}


export interface IParentRegistrationRequest {
    userId: number,
    firstName: string,
    lastName: string,
    email: string
}

export interface IParentAll {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,

    registrationStage: number,

    createdAt: string,
}

