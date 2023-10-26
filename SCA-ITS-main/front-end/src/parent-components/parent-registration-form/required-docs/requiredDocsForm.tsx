import { AccountBalance } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, REG_REQ_TYPE } from "../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import { BankingDetails } from "../../../shared-components/banking-details/bankingDetails";
import Loading from "../../../shared-components/loading-component/loading";
import { PopupComponent } from "../../../shared-components/popup-component/popupComponent";
import { RegistrationDocsAccordian } from "../../../shared-components/registration-docs-accordian/registrationDocsAccordian";
import "./requiredDocsForm.css";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentRequiredDocsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [showBankingDetails, setShowBankingDetails] = useState(false);


    return (
        <div className="m-3">

            <div onClick={() => setShowBankingDetails(true)} className='vert-flex hover p-2 banking-details-popup'>
                <p>Banking Details</p>
                <AccountBalance />
            </div>

            {
                showBankingDetails &&
                <PopupComponent onHide={() => setShowBankingDetails(false)} component={<BankingDetails />} size={'lg'} />
            }

            <h2>Upload Required Documents</h2>
            <p>For each of the categories below, upload a document as proof.</p>

            {
                props.registrationStatus.requiredDocsRejectionMessage !== null && props.registrationStatus.requiredDocsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.requiredDocsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.PARENT} userIdOrStudentNumber={props.parent.userId.toString()} editable={true} />

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                    </>
                }
                {
                    <>
                        <Button style={{ marginLeft: "10px" }} onClick={async () => {
                            setLoading(true);
                            if (await props.editRegistrationStatus({}))
                                successToast("success", true, 2000);
                            setLoading(false);
                        }} variant={"success"}>
                            Save
                        </Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

        </div>
    );
}