import "./bankingDetails.css";

export const BankingDetails = () => {
    return (
        <div className="banking-details-container mb-3 mt-3 w-100 rounded shadow hor-center p-3">
            <h2 className="mb-3 banking-details-title">Banking Details</h2>
            <table className="w-100 banking-details-table">
                <tbody>

                    <tr>
                        <td className="banking-details-left">Account Name: </td>
                        <td className="banking-details-right">Swakopmund Christian Academy CC</td>
                    </tr>

                    <tr>
                        <td className="banking-details-left">Account Number: </td>
                        <td className="banking-details-right">569011272</td>
                    </tr>

                    <tr>
                        <td className="banking-details-left">Banking Institution: </td>
                        <td className="banking-details-right">Standard Bank Swakopmund</td>
                    </tr>

                    <tr>
                        <td className="banking-details-left">Branch Number: </td>
                        <td className="banking-details-right">082172</td>
                    </tr>

                    <tr>
                        <td className="banking-details-left">Reference:  </td>
                        <td className="banking-details-right">Learner's name and contact details (cell number)</td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
}







