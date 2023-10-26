import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { IParentProfile } from '../../interfaces/parent_interfaces';
import { REG_REQ_TYPE } from '../../interfaces/registration_interfaces';
import { INPUT_TYPE } from '../../shared-components/add-edit-component-V2/AddEditComponentV2';
import { errorToast, successToast } from '../../shared-components/alert-components/toasts';
import EditableTable from '../../shared-components/editable-component/editableComponent';
import Loading from '../../shared-components/loading-component/loading';
import OtherParentsComponent from '../../shared-components/other-parents-component/otherParentsComponent';
import { RegistrationDocsAccordian } from '../../shared-components/registration-docs-accordian/registrationDocsAccordian';
import UserAccountPage from '../../shared-components/user-account-page/userAccountPage';
import "./parentAccountPage.css";

// async component imports


interface IProps {
    context: IGlobalContext
}

const ParentAccountPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [tabKey, initTabKey] = useState('profile');

    const [profile, setProfile] = useState<IParentProfile>({
        userId: 0,
        idNumber: "",
        employer: "",
        occupation: "",
        monthlyIncome: 0,
        workingHours: "",
        specialistSkillsHobbies: "",
        telephoneWork: "",
        telephoneHome: "",
        fax: "",
        cellNumber: "",
        postalAddress: "",
        residentialAddress: "",
        maritalStatus: "",
        registrationStage: 0
    });

    //----   COMPONENT DID MOUND   ----
    useEffect(() => {
        getParentProfile();
    }, []);

    //----   ON TAB CHANGE   ----
    useEffect(() => {
        if (tabKey === "profile")
            getParentProfile();
    }, [tabKey]);


    //---   GET PARENT PROFILE   ---
    const getParentProfile = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PARENT_PROFILE + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            return;
        }
        setProfile(result.data);
    }

    //---   UPDATE PARENT PROFILE   ---
    const updateParentProfile = async (data: IParentProfile): Promise<boolean> => {
        data.userId = profile.userId;

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_PROFILE, data, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Profile updated!", true, 2000);
        getParentProfile();

        return true;
    }

    return (
        <div className="full-size">
            <UserAccountPage
                context={props.context}
                children={
                    <Tabs >
                        <Tab className="registration-tab" eventKey="registration" title="Registration">
                            <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.PARENT} userIdOrStudentNumber={props.context.userId.toString()} editable={true} />
                        </Tab>
                        <Tab className="hor-center parent-profile-tab" eventKey="profile" title="Profile">
                            <EditableTable
                                title={`Profile Details`}
                                id={profile.userId}
                                data={
                                    [
                                        { key: "idNumber", name: "ID Number: ", value: profile.idNumber, type: INPUT_TYPE.TEXT },
                                        { key: "employer", name: "Employer: ", value: profile.employer, type: INPUT_TYPE.TEXT },
                                        { key: "occupation", name: "Occupation: ", value: profile.occupation, type: INPUT_TYPE.TEXT },
                                        { key: "monthlyIncome", name: "Annual Budget: ", value: profile.monthlyIncome, type: INPUT_TYPE.NUMBER },
                                        { key: "workingHours", name: "Working Hours: ", value: profile.workingHours, type: INPUT_TYPE.TEXT },
                                        { key: "specialistSkillsHobbies", name: "Specialist Skills/Hobbies: ", value: profile.specialistSkillsHobbies, type: INPUT_TYPE.TEXT },
                                        { key: "telephoneWork", name: "Telephone (Work): ", value: profile.telephoneWork, type: INPUT_TYPE.TEXT },
                                        { key: "telephoneHome", name: "Telephone (Home): ", value: profile.telephoneHome, type: INPUT_TYPE.TEXT },
                                        { key: "fax", name: "Fax: ", value: profile.fax, type: INPUT_TYPE.TEXT },
                                        { key: "cellNumber", name: "Cell Number: ", value: profile.cellNumber, type: INPUT_TYPE.TEXT },
                                        { key: "postalAddress", name: "Postal Address: ", value: profile.postalAddress, type: INPUT_TYPE.TEXT },
                                        { key: "residentialAddress", name: "Residential Address: ", value: profile.residentialAddress, type: INPUT_TYPE.TEXT },
                                        {
                                            key: "maritalStatus", name: "Marital Status: ", value: profile.maritalStatus, type: INPUT_TYPE.SELECT,
                                            selectValues: [
                                                { name: "Married", value: "Married" },
                                                { name: "Widowed", value: "Widowed" },
                                                { name: "Separated", value: "Separated" },
                                                { name: "Divorced", value: "Divorced" },
                                                { name: "Single", value: "Single" },
                                            ]
                                        },
                                    ]
                                }
                                loading={loading}
                                onEdit={async (data: any) => updateParentProfile(data)}
                            />
                        </Tab>
                        <Tab className="other-parents-tab" eventKey="other-parents" title="Other Parents/Guardians">
                            <OtherParentsComponent context={props.context} parentId={props.context.userId} />
                        </Tab>
                    </Tabs>
                }
            />
        </div>
    );
}

export default ParentAccountPage;