import "./accountCreated.css";

interface IProps {
    email: string
}

let AccountCreatedPage = (props: IProps) => {
    return (
        <div className="account-created-container">
            <div className="hor-center shadow rounded mb-5 account-created-message">
                <div className="account-created-message-header">
                    <h1>
                        Welcome to Ipulse!
                    </h1>
                </div>
                <p>An email has been sent to <h5>{props.email}</h5> for confirmation</p>
            </div>
        </div>
    );
}


export default AccountCreatedPage;