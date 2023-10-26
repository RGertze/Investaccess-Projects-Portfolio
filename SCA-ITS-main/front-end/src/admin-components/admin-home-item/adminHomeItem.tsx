import { CSSProperties, useEffect, useState } from "react";
import CoursesPic from "../../assets/courses.png";
import NoFeesPic from "../../assets/noFees.png";
import OutstandingParentFeesPic from "../../assets/outstandingParentFees.png";
import ParentPic from "../../assets/parent.png";
import ProofOfDepositPic from "../../assets/proofOfDeposit.png";
import StaffPic from "../../assets/staff.png";
import StudentPic from "../../assets/student.png";
import TotalOutstandingFeesPic from "../../assets/totalOutstandingFees.png";
import { GlobalContext } from "../../contexts/globalContext";
import "./adminHomeItem.css";

export enum HOME_ITEM_TYPE {
    COURSES,
    NO_FEES,
    OUTSTANDING_PARENT_FEES,
    PARENTS,
    PROOF_OF_DEPOSITS,
    STAFF,
    STUDENTS,
    TOTAL_OUTSTANDING_FEES
}

interface IProps {
    title: string,
    value: string,
    width: number,
    type: HOME_ITEM_TYPE,
    flexDirection: any,

    onClick(): any
}

export const AdminHomeItem = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [pic, setPic] = useState("");

    useEffect(() => {
        initType();
    }, []);

    const initType = () => {
        switch (props.type) {
            case HOME_ITEM_TYPE.COURSES:
                setPic(CoursesPic);
                break;
            case HOME_ITEM_TYPE.NO_FEES:
                setPic(NoFeesPic);
                break;
            case HOME_ITEM_TYPE.OUTSTANDING_PARENT_FEES:
                setPic(OutstandingParentFeesPic);
                break;
            case HOME_ITEM_TYPE.PARENTS:
                setPic(ParentPic);
                break;
            case HOME_ITEM_TYPE.PROOF_OF_DEPOSITS:
                setPic(ProofOfDepositPic);
                break;
            case HOME_ITEM_TYPE.STAFF:
                setPic(StaffPic);
                break;
            case HOME_ITEM_TYPE.STUDENTS:
                setPic(StudentPic);
                break;
            case HOME_ITEM_TYPE.TOTAL_OUTSTANDING_FEES:
                setPic(TotalOutstandingFeesPic);
                break;
        }
    }

    return (
        <GlobalContext.Consumer>
            {
                context => (
                    <div onClick={props.onClick} className="admin-home-item hover rounded p-3" style={{ width: `${props.width}%`, flexDirection: props.flexDirection }}>
                        <h3 className="admin-home-item-title">{props.title}</h3>
                        <img className="admin-home-item-img" src={pic} width={131 * (window.innerWidth / 1920) * (context.isMobile ? 1.7 : 1)} height={131 * (window.innerWidth / 1920) * (context.isMobile ? 1.7 : 1)} alt="Awesome pic here" />
                        <h3>{props.value}</h3>
                    </div>
                )
            }
        </GlobalContext.Consumer>
    );
}