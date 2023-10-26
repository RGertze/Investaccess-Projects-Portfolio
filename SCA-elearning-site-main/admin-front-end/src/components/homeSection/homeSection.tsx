
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { POST_TYPE, GET_TYPE } from "../../connection";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import SuggestionBox from "../suggestionBox/suggestionBox";
import HomeFilesCard from "../homeFilesCard/homeFilesCard";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./homeSection.css";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddAllStudentCourses, IApproveCourseMaterial, IApproveLink, IChangePassword, ICourseMaterial, ICourseMaterialDetailed, IDeleteCourseMaterial, IDeleteLink, IGetAllMaterials, IGetAllStudents, IGetSignedGetUrl, ILinkToApprove, IResponse, ISetAdminResourcePassword, ISignedGetUrl, IStudentNotRegistered } from "../../interfaces";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Check from "@material-ui/icons/Check";
import AddCard from "../addCard/addFileCard";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    unapprovedLinks: ILinkToApprove[],
    linksMarkedForDeletion: ILinkToApprove[],
    materialsToApprove: ICourseMaterialDetailed[],
    materialsToDelete: ICourseMaterialDetailed[],
    studentsToRegister: IStudentNotRegistered[],

    changingLoginPassword: boolean,
    changingResourcePassword: boolean
}

interface IProps {
    token: string,
    userID: number
}


//----------------------------------
//      CONST VALUES
//----------------------------------

const CHANGE_PW_IN = [
    "New Password",
    "Confirm Password"
];



//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class HomeSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            studentsToRegister: [],
            materialsToDelete: [],
            materialsToApprove: [],
            unapprovedLinks: [],
            linksMarkedForDeletion: [],

            changingResourcePassword: false,
            changingLoginPassword: false
        }
    }

    //----------------------------------
    //      COMP DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.getAllMaterialsUnapproved();
        this.getUnapprovedLinks();
        this.getLinksMarkedForDeletion();
        this.getAllMaterialsMarkedForDeletion();
        this.getAllStudentsNotRegistered();
    }


    //----------------------------------
    //      TOGGLE CHANGING PASSWORD
    //----------------------------------

    toggleChangingPassword = (pwType: number) => {
        if (pwType === 1) {
            let changingPassword = !this.state.changingResourcePassword;
            this.setState({ changingResourcePassword: changingPassword });
        } else {
            let changingPassword = !this.state.changingLoginPassword;
            this.setState({ changingLoginPassword: changingPassword });
        }
    }


    //----------------------------------
    //      CHANGE RESOURCE PASSWORD
    //----------------------------------

    changeResourcePassword = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let pw = inMap.get(CHANGE_PW_IN[0]);
        let confPw = inMap.get(CHANGE_PW_IN[1]);

        if (pw === "") {
            alert("enter a password");
            return false;
        }
        if (pw !== confPw) {
            alert("passwords do not match");
            return false;
        }

        let data: ISetAdminResourcePassword = {
            adminID: this.props.userID,
            password: pw
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.SET_ADMIN_RESOURCE_PASSWORD, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to set password: " + result.error);
            return false;
        }

        alert("successfully set password");
        return true;
    }


    //----------------------------------
    //      CHANGE LOGIN PASSWORD
    //----------------------------------

    changeLoginPassword = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let pw = inMap.get(CHANGE_PW_IN[0]);
        let confPw = inMap.get(CHANGE_PW_IN[1]);

        if (pw === "") {
            alert("enter a password");
            return false;
        }
        if (pw !== confPw) {
            alert("passwords do not match");
            return false;
        }

        let data: IChangePassword = {
            userID: this.props.userID,
            userType: 3,
            newPassword: pw
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.CHANGE_PASSWORD, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to change password: " + result.error);
            return false;
        }

        alert("successfully changed password");
        return true;
    }


    //--------------------------------------
    //      GET ALL MATERIALS UNAPPROVED
    //--------------------------------------

    getAllMaterialsUnapproved = async () => {
        let data: IGetAllMaterials = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_MATERIALS_UNAPPROVED, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ materialsToApprove: result.data });
            return;
        }

        this.setState({ materialsToApprove: [] });
    }


    //-----------------------------------------------
    //      GET ALL MATERIALS MARKED FOR DELETION
    //-----------------------------------------------

    getAllMaterialsMarkedForDeletion = async () => {
        let data: IGetAllMaterials = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_MATERIALS_MARKED_FOR_DELETION, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ materialsToDelete: result.data });
            return;
        }

        this.setState({ materialsToDelete: [] });
    }


    //-----------------------------------------------
    //      GET ALL MATERIALS MARKED FOR DELETION
    //-----------------------------------------------

    getAllStudentsNotRegistered = async () => {
        let data: IGetAllStudents = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_STUDENTS_NOT_REGISTERED, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ studentsToRegister: result.data });
            return;
        }

        this.setState({ studentsToRegister: [] });
    }


    //----------------------------------
    //      ADD ALL STUDENT COURSES
    //----------------------------------

    addAllStudentCourses = async (student: IStudentNotRegistered) => {
        let data: IAddAllStudentCourses = {
            studentID: student.Student_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_ALL_STUDENT_COURSES, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to add student courses");
            return;
        }
    }

    //----------------------------------
    //      APPROVE MATERIAL
    //----------------------------------

    approveMaterial = async (material: ICourseMaterial) => {
        let data: IApproveCourseMaterial = {
            materialPath: material.Course_Material_Path
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.APPROVE_MATERIAL, this.props.token, data, {});

        if (result.stat === "ok") {
            return;
        }

        alert("approval failed: " + result.error);
    }


    //----------------------------------
    //      REJECT MATERIAL
    //----------------------------------

    rejectMaterial = async (material: ICourseMaterial) => {
        let data: IDeleteCourseMaterial = {
            path: material.Course_Material_Path
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.REJECT_MATERIAL, this.props.token, data, {});

        if (result.stat == "ok") {
            return;
        }

        alert("rejection failed: " + result.error);
    }


    //----------------------------
    //    SAVE FILE
    //----------------------------

    saveFile = async (filePath: string, fileName: string) => {
        let data: IGetSignedGetUrl = {
            filePath: filePath
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve file");
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        Connection.saveFileS3(urlData.url, fileName);
    }


    //----------------------------------
    //      GET ALL UNAPPROVED LINKS
    //----------------------------------

    getUnapprovedLinks = async () => {

        let data = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_UNAPPROVED_LINKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ unapprovedLinks: [] });
            return;
        }

        this.setState({ unapprovedLinks: result.data });
    }


    //-------------------------------------------
    //      GET ALL LINKS MARKED FOR DELETION
    //-------------------------------------------

    getLinksMarkedForDeletion = async () => {

        let data = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_LINKS_MARKED_FOR_DELETION, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ linksMarkedForDeletion: [] });
            return;
        }

        this.setState({ linksMarkedForDeletion: result.data });
    }


    //----------------------------------
    //      OPEN LINK
    //----------------------------------

    openLink = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }


    //----------------------------------
    //      APPROVE LINK
    //----------------------------------

    approveLink = async (linkPath: string, linkTopicID: number) => {
        let data: IApproveLink = {
            linkPath: linkPath,
            linkType: 1,
            linkTopicID: linkTopicID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.APPROVE_LINK, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getUnapprovedLinks();
            return;
        }

        alert("approval failed: " + result.error);
    }


    //----------------------------------
    //      REJECT LINK
    //----------------------------------

    rejectLink = async (linkPath: string, linkTopicID: number) => {
        let data: IDeleteLink = {
            linkPath: linkPath,
            linkType: 1,
            linkTopicID: linkTopicID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_LINK, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getUnapprovedLinks();
            this.getLinksMarkedForDeletion();
            return;
        }

        alert("rejection failed: " + result.error);
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="home-section-container">

                {
                    //---------    HOME FILES SECTION    ---------

                    <div id="home-file-management-container" className="center">
                        <h3 style={{ gridColumn: "1/4", gridRow: 1, height: "20px", marginTop: "5px" }} className="center">Home section files:</h3>

                        <HomeFilesCard gridCol={1} token={this.props.token} sectionName={"Covid Info"} linkType={5} />
                        <HomeFilesCard gridCol={2} token={this.props.token} sectionName={"Announcements"} linkType={6} />
                        <HomeFilesCard gridCol={3} token={this.props.token} sectionName={"Rules & Regulations"} linkType={7} />

                    </div>
                }

                {
                    //---------    HOME BUTTONS SECTION    ---------

                    <div id="home-buttons-section" className="center home-section-item flex-column">
                        <div className="home-button" onClick={() => this.toggleChangingPassword(1)}><p>Change Resource Password</p></div>
                        <div className="home-button" onClick={() => this.toggleChangingPassword(2)}><p>Change Login Password</p></div>

                        {
                            //----   CHANGE ADMIN RESOURCE PASSWORD   ----   

                            this.state.changingResourcePassword &&
                            <AddCard title={"Change resource password"} cancel={() => this.toggleChangingPassword(1)} submit={this.changeResourcePassword} addFile={false} uploading={false} numberInputs={[]} stringInputs={CHANGE_PW_IN} calendarInputs={[]} checkboxInputs={[]} uploadProgress={0} />
                        }

                        {
                            //----   CHANGE ADMIN LOGIN PASSWORD   ----   

                            this.state.changingLoginPassword &&
                            <AddCard title={"Change login password"} cancel={() => this.toggleChangingPassword(2)} submit={this.changeLoginPassword} addFile={false} uploading={false} numberInputs={[]} stringInputs={CHANGE_PW_IN} calendarInputs={[]} checkboxInputs={[]} uploadProgress={0} />
                        }
                    </div>
                }

                {

                    //---------    MATERIAL APPROVAL    ---------

                    <div className="title-row2 center home-section-item" >
                        <div className="home-section-item-title flex-row">
                            <h3>Approve materials:</h3>
                        </div>

                        <div className="center" style={{ width: "95%" }}>
                            <div id="home-material-unapproved" className="center" style={{ height: "20px", borderBottom: "2px solid white" }}>
                                <h4 className="center vert-center">Course</h4>
                                <h4 className="center vert-center">Topic</h4>
                                <h4 className="center vert-center">Material</h4>
                            </div>
                        </div>

                        <div className="center" style={{ width: "100%", height: "90%" }}>
                            {
                                this.state.materialsToApprove.map((material) => {
                                    return (
                                        <div id="home-material-unapproved" className="course-material-unapproved center">
                                            <h3 className="center">{material.Course_Name}</h3>
                                            <h3 className="center">{material.Course_Topic_Name}</h3>
                                            <p className="center vert-center file-link" onClick={() => this.saveFile(material.Course_Material_Path, material.Course_Material_Name)}>{material.Course_Material_Name}</p>


                                            <DeleteForever style={{ transform: "scale(0.9)" }} className="home-file-delete-button center vert-center" onClick={async () => {
                                                await this.rejectMaterial(material);
                                                this.getAllMaterialsUnapproved();
                                            }} />
                                            <Check style={{ transform: "scale(0.9)" }} className="home-file-delete-button center vert-center" onClick={async () => {
                                                await this.approveMaterial(material);
                                                this.getAllMaterialsUnapproved();
                                            }} />
                                        </div>
                                    );
                                })
                            }

                            {
                                this.state.unapprovedLinks.map((link) => {
                                    return (
                                        <div id="home-material-unapproved" className="course-material-unapproved center">
                                            <h3 className="center">{link.Course_Name}</h3>
                                            <h3 className="center">{link.Course_Topic_Name}</h3>
                                            <p className="center vert-center file-link" onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p>

                                            <DeleteForever style={{ transform: "scale(0.9)" }} className="home-file-delete-button center vert-center" onClick={async () => {
                                                this.rejectLink(link.Link_Path, link.Link_Topic_ID);
                                            }} />
                                            <Check style={{ transform: "scale(0.9)" }} className="home-file-delete-button center vert-center" onClick={async () => {
                                                this.approveLink(link.Link_Path, link.Link_Topic_ID);
                                            }} />
                                        </div>
                                    );
                                })
                            }

                            {
                                //---------    NO RECORDS MESSAGE    ---------
                                (this.state.materialsToApprove.length === 0 && this.state.unapprovedLinks.length === 0) &&
                                <p style={{ color: "white", textAlign: "center" }}>No materials to approve</p>
                            }
                        </div>
                    </div>
                }

                {

                    //---------    MATERIAL DELETION    ---------

                    <div className="title-row2 center home-section-item">
                        <div className="home-section-item-title flex-row">
                            <h3>Delete materials:</h3>
                        </div>

                        <div className="center" style={{ width: "95%" }}>
                            <div id="home-material-to-delete" className="center" style={{ height: "20px", borderBottom: "2px solid white" }}>
                                <h4 className="center vert-center">course</h4>
                                <h4 className="center vert-center">Material</h4>
                            </div>
                        </div>

                        <div className="center" style={{ width: "95%" }}>
                            {
                                this.state.materialsToDelete.map((material) => {
                                    return (
                                        <div id="home-material-to-delete" className="course-material-unapproved center">
                                            <h3 className="center">{material.Course_Name}</h3>
                                            <h3 className="center file-link" onClick={() => this.saveFile(material.Course_Material_Path, material.Course_Material_Name)}>{material.Course_Material_Name}</h3>
                                            <div style={{ backgroundColor: "#EE4B2B" }} onClick={async () => {
                                                await this.rejectMaterial(material);
                                                this.getAllMaterialsMarkedForDeletion();
                                            }}><p>Delete</p></div>
                                        </div>
                                    );
                                })
                            }

                            {
                                this.state.linksMarkedForDeletion.map((link) => {
                                    return (
                                        <div id="home-material-to-delete" className="course-material-unapproved center">
                                            <h3 className="center">{link.Course_Name}</h3>
                                            <h3 className="center file-link" onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</h3>
                                            <div style={{ backgroundColor: "#EE4B2B" }} onClick={() => {
                                                this.rejectLink(link.Link_Path, link.Link_Topic_ID);
                                            }}><p>Delete</p></div>
                                        </div>
                                    );
                                })
                            }

                            {
                                //---------    NO RECORDS MESSAGE    ---------
                                (this.state.materialsToDelete.length === 0 && this.state.linksMarkedForDeletion.length === 0) &&
                                <p style={{ color: "white", textAlign: "center" }}>No materials to delete</p>
                            }
                        </div>
                    </div>
                }

                {

                    //---------    STUDENT COURSE REGISTRATION    ---------

                    <div className="title-row2 center home-section-item">
                        <div className="home-section-item-title flex-row">
                            <h3>Course registration:</h3>
                        </div>

                        <div className="center" style={{ width: "95%" }}>
                            <div id="home-student-to-register" className="center" style={{ height: "20px", borderBottom: "2px solid white" }}>
                                <h4 className="center vert-center" >Name</h4>
                                <h4 className="center vert-center">Grade</h4>
                            </div>
                        </div>

                        <div className="center" style={{ width: "95%" }}>
                            {
                                this.state.studentsToRegister.map((student) => {
                                    return (
                                        <div id="home-student-to-register" className="course-material-unapproved center">
                                            <h3 className="center">{student.Student_First_Name[0]} {student.Student_Surname_Name}</h3>
                                            <h3 className="center">{student.Student_Grade}</h3>
                                            <button className="center vert-center" style={{ width: "fit-content", height: "20px" }} onClick={async () => {
                                                await this.addAllStudentCourses(student);
                                                this.getAllStudentsNotRegistered();
                                            }}>Add all</button>
                                        </div>
                                    );
                                })
                            }

                            {
                                //---------    NO RECORDS MESSAGE    ---------
                                this.state.studentsToRegister.length === 0 &&
                                <p style={{ color: "white", textAlign: "center" }}>No students to register</p>
                            }
                        </div>
                    </div>
                }

            </div>
        );
    }
}

export default HomeSection;
