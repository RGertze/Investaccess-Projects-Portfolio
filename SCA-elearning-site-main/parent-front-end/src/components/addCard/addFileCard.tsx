//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";
import ProgressBar from "../progressBar/progressBar";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./addFileCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------



//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IProps {
    title: string,
    stringInputs: string[],
    calendarInputs: string[],
    datetimeInputs?: string[],
    numberInputs: string[],
    checkboxInputs: string[],
    cancel: () => void,
    submit: (inMap: Map<string, string>, file: File) => Promise<boolean>,

    uploading: boolean,
    uploadProgress: number,

    addFile: boolean,

    defaultValues?: Map<string, string>
}

interface IState {
    inputMap: Map<string, string>,
    file: File
}



//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AddCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            inputMap: new Map(),
            file: null
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        for (let i = 0; i < this.props.checkboxInputs.length; i++) {
            this.handleInput(this.props.checkboxInputs[i], (0).toString());
        }
        for (let i = 0; i < this.props.stringInputs.length; i++) {
            this.handleInput(this.props.stringInputs[i], "");
        }

        //----   SET DEFAULT VALUES IF PRESENT   ----

        if (this.props.defaultValues) {
            this.props.defaultValues.forEach((value, key) => {
                this.handleInput(key, value);
            });
        }
    }


    //----------------------
    //    HANDLE INPUT
    //----------------------

    handleInput = (key: string, value: string) => {
        let inMap = this.state.inputMap;
        inMap.set(key, value);
        this.setState({ inputMap: inMap });
    }



    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="add-file-card-overlay">
                <div id="add-file-card-container" className="flex-column">

                    <h2>{this.props.title}</h2>

                    {

                        //----   STRING INPUTS   ----

                        this.props.stringInputs.map(strIn => {
                            return (
                                <div className="form-col add-file-card-str-input">
                                    <h4>{strIn}:</h4>
                                    <input type="text" value={this.state.inputMap.get(strIn)} onChange={ev => {
                                        this.handleInput(strIn, ev.target.value);
                                    }} />
                                </div>
                            )
                        })
                    }

                    {

                        //----   NUMBER INPUTS   ----

                        this.props.numberInputs.map(numIn => {
                            return (
                                <div className="form-col add-file-card-str-input">
                                    <h4>{numIn}:</h4>
                                    <input type="number" value={parseInt(this.state.inputMap.get(numIn))} onChange={ev => {
                                        this.handleInput(numIn, ev.target.value);
                                    }} />
                                </div>
                            )
                        })
                    }

                    {

                        //----   CALENDAR INPUTS   ----

                        this.props.calendarInputs.map(calIn => {
                            return (
                                <div className="form-col add-file-card-str-input">
                                    <h4>{calIn}:</h4>
                                    <input type="date" onChange={ev => {
                                        this.handleInput(calIn, ev.target.value);
                                    }} />
                                </div>
                            )
                        })
                    }

                    {

                        //----   DATETIME INPUTS   ----

                        (this.props.datetimeInputs !== undefined) &&
                        this.props.datetimeInputs.map(timeIn => {
                            return (
                                <div className="form-col add-file-card-str-input">
                                    <h4>{timeIn}:</h4>
                                    <input type="datetime-local" onChange={ev => {
                                        this.handleInput(timeIn, ev.target.value);
                                    }} />
                                </div>
                            )
                        })
                    }

                    {

                        //----   CHECKBOX INPUTS   ----

                        this.props.checkboxInputs.map(checkIn => {
                            return (
                                <div className="form-col add-file-card-str-input">
                                    <h4>{checkIn}:</h4>
                                    <input type="checkbox" value={1} onChange={ev => {
                                        this.handleInput(checkIn, ev.target.value);
                                    }} />
                                </div>
                            )
                        })
                    }

                    {
                        //----   FILE INPUT   ----
                        this.props.addFile &&
                        <input id="add-file-card-file-input" className="center" type="file" onChange={(ev) => this.setState({ file: ev.target.files[0] })} />
                    }

                    {
                        //----   PROGRESS BAR   ----

                        this.props.uploading &&
                        <ProgressBar now={this.props.uploadProgress} />
                    }

                    {
                        //----   BUTTONS   ----

                        <div id="add-file-card-buttons-container">

                            <div className="flex-row add-file-card-button" onClick={async () => {
                                let success = await this.props.submit(this.state.inputMap, this.state.file);
                                if (success) {
                                    this.props.cancel();
                                }
                            }}>
                                <h3 className="center">Submit</h3>
                            </div>
                            <div className="flex-row add-file-card-button" onClick={this.props.cancel}>
                                <h3 className="center">Cancel</h3>
                            </div>

                        </div>
                    }

                </div>
            </div>
        );
    }
}

export default AddCard;
