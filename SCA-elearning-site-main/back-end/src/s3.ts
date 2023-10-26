//###############################
//      DEPENDENCY IMPORTS
//###############################

import { S3 } from "aws-sdk";
import dotenv from "dotenv";
import { v4 } from "uuid";
import cron from "node-cron";

//###############################
//      DB IMPORTS
//###############################

import DB_Connection, { QueryBuilder, QUERY_PROCS } from "./database";
import { IDeleteSingleFileToDelete, IFileToDelete, IGetFilesToDelete } from "./interfaces";

//##############################################
//      SETUP DOTENV
//##############################################

dotenv.config();    // load values from .env file

//##############################################
//##############################################


//##############################################
//      SETUP DB
//##############################################

const dbConnection = new DB_Connection();

//##############################################
//##############################################


//###############################
//      S3 OBJECT SETUP
//###############################

const s3 = new S3({
    region: process.env.S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: "v4"
});


//###############################
//      INTERFACE DEFINITIONS
//###############################

interface IS3Params {
    Bucket: string,
    Key: string,
    Expires: number
}


//###############################
//      CLASS DEFINITION
//###############################

class S3Storage {

    //###################################
    //      GENERATE UNIQUE FILE NAME
    //###################################

    public static generateUniqueFileName = (fileName: string): string => {
        return `${v4()}-${fileName}`;
    }


    //###############################
    //      SIGNED GET URL
    //###############################

    public static getSignedGetUrl = async (fileName: string): Promise<string> => {
        const params: IS3Params = {
            Bucket: process.env.S3_NAME,
            Key: fileName,
            Expires: 60
        }

        let getUrl = await s3.getSignedUrlPromise('getObject', params);
        return getUrl;
    }

    //###############################
    //      SIGNED POST URL
    //###############################

    public static getSignedPostUrl = async (fileName: string): Promise<string> => {
        const params: IS3Params = {
            Bucket: process.env.S3_NAME,
            Key: fileName,
            Expires: 300
        }

        let postUrl = await s3.getSignedUrlPromise('putObject', params);
        return postUrl;
    }
}

export default S3Storage;

//###############################################
//###############################################


//#################################################
//      CRON JOB SETUP TO DELETE FILES FROM S3
//#################################################

export const s3DeleteTask = cron.schedule("1 1 4 * * *", async () => {  // -->  EXECUTE AT 4:01:01 EVERYDAY
    let data: IGetFilesToDelete = {}

    //#########        RETRIEVE FILES TO DELETE FROM DB        ############

    dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.GET_FILES_TO_DELETE, data), (error, result) => {
        if (error) {
            console.log(error.sqlMessage);
            return;
        }

        if (result[0].length === 0) {
            console.log("no files to delete");
            return;
        }

        let filesToDelete: IFileToDelete[] = result[0];

        //#########        CREATE A LIST OF OBJECTS TO DELETE        ############

        let objectIdentifiers: S3.ObjectIdentifierList = [];

        filesToDelete.forEach((file) => {
            objectIdentifiers.push({ Key: file.File_Path });
        });

        //#########        CREATE DELETE REQUEST OBJECT        ############

        let params: S3.DeleteObjectsRequest = {
            Bucket: process.env.S3_NAME,
            Delete: {
                Objects: objectIdentifiers,
                Quiet: false                // return info about deleted objects
            }
        }

        //#########        PERFORM DELETE OPERATION        ############

        s3.deleteObjects(params, (err, resData) => {
            if (err) {
                console.log(err.message);
                return;
            }

            //#########        CHECK IF ALL FILES WERE DELETED        ############

            if (resData.Deleted.length !== filesToDelete.length) {  // --> ERROR OCCURRED ON SOME OR ALL FILES

                resData.Errors.forEach((s3Err) => {
                    console.log(s3Err.Key + ": " + s3Err.Message);
                });

                //#########        REMOVE SUCCESSFULLY DELETED FILES FROM DB        ############

                resData.Deleted.forEach((delObject) => {
                    let delData: IDeleteSingleFileToDelete = {
                        filePath: delObject.Key
                    }

                    dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_SINGLE_FILE_TO_DELETE, delData), (delErr, delRes) => {
                        if (delErr) {
                            console.log(delErr.sqlMessage);
                            return;
                        }

                        if (delRes[0][0].RESULT !== "ok") {
                            console.log(delRes[0][0].RESULT);
                            return;
                        }

                        console.log("successfully deleted " + delObject.Key);
                    });
                });

                return;
            }


            //#########        DELETE ALL FILE PATHS FROM DB IF NO ERRORS OCCURED        ############

            dbConnection.query(QueryBuilder.buildQry(QUERY_PROCS.DELETE_FILES_TO_DELETE, {}), (dbErr) => {
                if (dbErr) {
                    console.log(dbErr.sqlMessage);
                    return;
                }
                console.log("all files successfully deleted");
            });

        });
    });
});

//#################################################
//#################################################
