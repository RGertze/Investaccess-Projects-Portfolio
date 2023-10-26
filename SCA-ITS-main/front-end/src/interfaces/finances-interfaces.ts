export enum STATEMENT_TYPE {
    FEE = 1,
    DEPOSIT = 2,
    DISCOUNT = 3,
    REFUND = 4,
    REGISTRATION = 5,
    TUITION = 6
}

export enum PROOF_OF_DEPOSIT_STATUS {
    PENDING = 1,
    APPROVED = 2,
    REJECTED = 3
}

export interface IStatementItem {
    id: number,
    statementId: number,
    date: string,
    reference: string,
    description: string,
    debitAmount: number,
    creditAmount: number,
}

export interface IFinancialStatement {
    currentBalance: number,
    items: IStatementItem[]
}

export interface IProofOfDeposit {
    id: number,
    parentId: number,
    filePath: string,
    fileName: string,
    amount: number,
    status: number,
    rejectionMessage: string,
}

export interface IFeeForGrade {
    grade: number,
    amount: number
}

export interface IParentBalance {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,

    currentBalance: number
}