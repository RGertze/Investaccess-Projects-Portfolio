export interface ICourseCategory {
    id: number,
    name: string,
    description: string,
    parentCategoryId: number,
    parentCategoryName: string
}

export interface ICourseType {
    id: number,
    name: string,
}

export interface ICourse {
    id: string,
    name: string,
    grade: number,
    isPromotional: number,

    categoryId: number,
    categoryName: string,

    typeId: number,
    typeName: string,
}

export interface ICourseStaff {
    courseId: string,
    staffId: number,
    email: string,
    firstName: string,
    lastName: string
}

export interface ICourseStudent {
    courseId: string,
    studentNumber: string,
    firstName: string,
    lastName: string
}