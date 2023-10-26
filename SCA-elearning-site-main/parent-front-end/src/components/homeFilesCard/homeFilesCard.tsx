//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./homeFilesCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import { IGetHomeFilesBySection, IGetHomeSectionLinks, IGetSignedGetUrl, IHomeFile, ILink, IResponse, ISignedGetUrl } from "../../interfaces";
import Connection, { GET_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    files: IHomeFile[],
    links: ILink[]
}

interface IProps {
    sectionName: string,
    token: string,
    linkType: number
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class HomeFilesCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            files: [],
            links: []
        }
    }


    //--------------------------
    //    COMPONENT DID MOUNT
    //--------------------------

    componentDidMount() {
        this.getFiles();
        this.getLinks();
    }


    //----------------------------
    //    GET FILES FOR SECTION
    //----------------------------

    getFiles = async () => {
        let data: IGetHomeFilesBySection = {
            section: this.props.sectionName
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_HOME_FILES_BY_SECTION, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ files: result.data });
            return;
        }

        this.setState({ files: [] });
    }


    //----------------------------
    //    SAVE HOME FILE
    //----------------------------

    saveHomeFile = async (file: IHomeFile) => {
        let data: IGetSignedGetUrl = {
            filePath: file.Home_File_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_HOME_FILE_URL, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve file");
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        Connection.saveFileS3(urlData.url, file.Home_File_Name);
    }


    //----------------------------------
    //      GET LINKS
    //----------------------------------

    getLinks = async () => {

        let data: IGetHomeSectionLinks = {
            linkType: this.props.linkType
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_HOME_SECTION_LINKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ links: [] });
            return;
        }

        this.setState({ links: result.data });

    }


    //----------------------------------
    //      OPEN LINK
    //----------------------------------

    openLink = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="home-files-container" className="center">
                <h3>{this.props.sectionName}</h3>
                <ul className="center flex-column">
                    {
                        //----   LIST FILES   ----
                        this.state.files.map(file => {
                            return (
                                <li><p onClick={() => this.saveHomeFile(file)}>{file.Home_File_Name}</p></li>
                            )
                        })
                    }

                    {
                        //----   LIST FILES   ----
                        this.state.links.map(link => {
                            return (
                                <li><p onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p></li>
                            )
                        })
                    }
                </ul>
                {
                    (this.state.files.length === 0 && this.state.links.length === 0) &&
                    <EmptyListNotification message={"No items found"} />
                }
            </div>
        );
    }
}

export default HomeFilesCard;
