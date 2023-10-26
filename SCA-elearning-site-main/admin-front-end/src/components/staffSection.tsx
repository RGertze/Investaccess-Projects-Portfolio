
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { GET_TYPE } from "../connection";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IGetPositionsShort, IGetStaffMembers, IPositionShort, IResponse, ISearchStaff, IStaffMember } from "../interfaces";


//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import StaffCard from "./staffCard";
import StaffAddCard from "./staffAddCard";
import PositionAddCard from "./PositionAddCard/positionAddCard";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    staffMembers: IStaffMember[],
    positions: IPositionShort[],

    nameIn: string,
    surnameIn: string,

    updatingStaff: boolean,
    staffToUpdate: IStaffMember,

    sortValue: number
}
interface IProps {
    token: string
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class StaffSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            staffMembers: [],
            positions: [],

            nameIn: "",
            surnameIn: "",

            updatingStaff: false,
            staffToUpdate: null,

            sortValue: 0
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.getStaff();
        this.getPositionsShort();
    }


    //---------------------------------------------
    //      HANDLE INPUT STATE CHANGE
    //---------------------------------------------

    changeUpdatingState = (isUpdating: boolean, staffToUpdate: IStaffMember) => {
        document.getElementById("content-container").scrollTop = 0;
        this.setState({ updatingStaff: isUpdating, staffToUpdate: staffToUpdate });
    }


    //---------------------------------------------
    //      GET SHORT VERSION OF ALL POSITIONS
    //---------------------------------------------

    getPositionsShort = async () => {
        let data: IGetPositionsShort = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_POSITIONS_SHORT, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ positions: result.data });
        }
    }


    //----------------------------------
    //      GET ALL STAFF MEMBERS
    //----------------------------------

    getStaff = async () => {
        let data: IGetStaffMembers = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STAFF_MEMBERS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ staffMembers: result.data });
        }
    }


    //----------------------------------
    //      SEARCH STAFF MEMBERS
    //----------------------------------

    searchStaff = async () => {
        let data: ISearchStaff = {
            name: this.state.nameIn,
            surname: this.state.surnameIn
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.SEARCH_STAFF, this.props.token, data);

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        this.setState({ staffMembers: result.data });
    }


    //----------------------------------
    //      SORT STAFF
    //----------------------------------

    sortStaff = async (opt: number) => {
        let sortedStaff: IStaffMember[] = this.state.staffMembers.slice();

        let resT = 1;   // asc order                                            
        let resF = -1;

        if (opt === 1) {
            resT = -1;  // desc order                                           
            resF = 1;
        }

        sortedStaff.sort((staffA, staffB) => {

            if (staffA.Staff_Surname > staffB.Staff_Surname)
                return resT;
            if (staffA.Staff_Surname < staffB.Staff_Surname)
                return resF;
            return 0;
        });

        this.setState({ sortValue: opt, staffMembers: sortedStaff });
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="staff-section-container">

                <PositionAddCard token={this.props.token} refreshPositions={this.getPositionsShort} />

                <StaffAddCard token={this.props.token} positions={this.state.positions} getUpdatedStaff={this.getStaff} isUpdating={this.state.updatingStaff} staffToUpdate={this.state.staffToUpdate} changeInputState={this.changeUpdatingState} />

                <div id="staff-section-search-container">
                    <label>Name:</label>
                    <input value={this.state.nameIn} type="text" onChange={(ev) => this.setState({ nameIn: ev.target.value })} />
                    <label>Surname:</label>
                    <input value={this.state.surnameIn} type="text" onChange={(ev) => this.setState({ surnameIn: ev.target.value })} />
                    <button onClick={this.searchStaff}>Search</button>
                </div>

                <div id="staff-section-sort-container">
                    <select value={this.state.sortValue} onChange={(ev) => this.sortStaff(parseInt(ev.target.value))}>
                        <option value={0}>A-Z</option>
                        <option value={1}>Z-A</option>
                    </select>
                </div>

                <div id="staff-section-table-headers">
                    <h3 style={{ gridColumn: 1 }}>ID</h3>
                    <h3 style={{ gridColumn: 2 }}>Name</h3>
                    <h3 style={{ gridColumn: 3 }}>Position</h3>
                    <h3 style={{ gridColumn: 4 }}>Cell</h3>
                </div>

                {
                    this.state.staffMembers.map((staffMember) => {
                        return (
                            <StaffCard key={staffMember.Staff_ID} token={this.props.token} staff={staffMember} refreshStaff={this.getStaff} updateStaff={this.changeUpdatingState} />
                        );
                    })
                }

            </div >
        );
    }
}

export default StaffSection;
