
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

export interface IGetParentDetails {
    parentID: number
}

export interface IGetAllFiles { }

export interface IGetParentFinances {
    parentID: number
}

export interface IGetParentFinancialStatements {
    parentID: number
}

export interface ICheckTermsAndConditionsAccepted {
    parentID: number
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

export interface IAddSuggestion {
    message: string
}

export interface IAddDirectMessage {
    fromID: number,
    toID: number,
    message: string
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

export interface IAddTermsAndConditionsAccepted {
    parentID: number
}


//------    UPDATE INTERFACES   --------

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


//------    DELETE INTERFACES   --------



//----------------------------------------------
//      QRY RESULT INTERFACES
//---------------------------------------------- 


export interface INewsEvent {
    News_Events_Title: string,
    News_Events_Content: string,
    News_Events_Date_Added: Date,
    News_Events_Img_Path: string
}

export interface IChatUser {
    userID: number,
    userName: string
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
    Parent_ID_Number: string,
    Parent_Name: string,
    Parent_Surname: string,
    Parent_Email: string,
    Parent_Mobile: string,
    Parent_Address: string,
    Parent_Home_Language: string,
    Parent_Religion: string
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

export interface ITermsAndConditionsFile {
    File_Path: string,
    File_Name: string
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
