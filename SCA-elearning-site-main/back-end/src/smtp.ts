import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";

//##############################################
//      SETUP DOTENV
//##############################################

dotenv.config();    // load values from .env file

//##############################################
//##############################################

//##############################################
//      SETUP TRANSPORTER
//##############################################

var transporter: Mail;

//##############################################
//##############################################


//##############################################
//      INITIALIZE TRANSPORTER
//##############################################
export async function initSMTP() {

    //##############################################
    //      SET DETAILS
    //##############################################
    transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    //##############################################
    //      VERIFY DETAILS
    //##############################################
    transporter.verify((error) => {
        if (error) {
            console.log(error.message);
            //console.log(process.env.EMAIL_USERNAME);
            //console.log(process.env.EMAIL_PASSWORD);
        } else {
            console.log("Messages can be sent");
        }
    });
}
//##############################################
//##############################################


//##############################################
//      SEND MAIL
//##############################################

export async function sendMail(to: string[], subject: string, message: string) {
    transporter.sendMail({
        from: `<${process.env.EMAIL_USERNAME}>`,     //  SENDER ADDRESS
        to: to,                 //  RECIPIENT LIST
        subject: subject,       //  SUBJECT
        text: message          //   BODY
    }, (error) => {
        if (error) {
            console.log("Error occured while sending emails: " + error.message);
        }
    });
}

//##############################################
//##############################################
