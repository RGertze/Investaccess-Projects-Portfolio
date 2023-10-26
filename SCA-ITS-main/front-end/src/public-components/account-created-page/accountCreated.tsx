import "./accountCreated.css";

interface IProps {
    email: string
}

let AccountCreatedPage = (props: IProps) => {
    return (
        <div className=" account-created-container">
            <div className="hor-center shadow rounded account-created-message">
                <div className="account-created-message-header">
                    <h1 className="p-2">
                        Registration Successful!
                    </h1>
                </div>
                <p className="p-2">An email has been sent to <h5>{props.email}</h5> for confirmation</p>
            </div>
        </div>
    );
}


export default AccountCreatedPage;