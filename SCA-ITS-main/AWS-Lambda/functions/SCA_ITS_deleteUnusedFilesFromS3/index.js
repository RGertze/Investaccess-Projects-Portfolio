import axios from "axios";
import AWS from "aws-sdk";

const S3 = new AWS.S3();

const bucket = "sca-its";

export const handler = async (event) => {

    let response = {
        statusCode: 200,
        body: JSON.stringify('ok'),
    };

    let config = {
        validateStatus: (status) => status < 300
    }

    let filesToDelete = [];

    // get files to delete
    try {
        let result = await axios.post(
            "https://its.elearning-swakopca.edu.na/api/files-to-delete/get",
            {
                token: "6ec6e84640767e7864fb370bbfc70204abe1852c078410c9e8059d8507d8e1b2"
            },
            config
        );

        filesToDelete = result.data.data;
        console.log(filesToDelete);
    } catch (error) {
        console.log(error);

        if (error.response) {
            response.statusCode = error.response.status ?? 500;

            if (error.response.data.errorMessage)
                response.body = JSON.stringify(error.response.data.errorMessage);
        } else {
            response.statusCode = 500;
            response.body = JSON.stringify('ok');
        }

        return response;
    }


    // if files to delete is empty, return
    if (filesToDelete.length === 0) {
        response.body = JSON.stringify("No files to delete");
        return response;
    }


    // map files to delete to objects understandable by S3
    filesToDelete = filesToDelete.map(file => { return { Key: file.filePath } });
    console.log(filesToDelete);


    let deleted = null;
    let deletedMap = {};

    // delete files from S3
    try {
        deleted = await S3.deleteObjects({
            Bucket: bucket,
            Delete: {
                Objects: filesToDelete
            }
        }).promise();

        if (deleted.Deleted) {
            // add deleted files to a map
            deleted.Deleted.forEach(f => {
                deletedMap[f.Key] = true;
            });
            console.log(deletedMap);
        }
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify(error);
        return response;
    }

    // check which files were deleted from S3 and should be deleted from ITS DB
    let filesToDeleteFromDb = [];
    filesToDelete.forEach(file => {
        if (deletedMap[file.Key]) {
            filesToDeleteFromDb.push({ filePath: file.Key });
        }
    });

    // delete files from ITS db
    try {
        let result = await axios.post(
            "https://its.elearning-swakopca.edu.na/api/files-to-delete/delete",
            {
                token: "6ec6e84640767e7864fb370bbfc70204abe1852c078410c9e8059d8507d8e1b2",
                filesToDelete: filesToDeleteFromDb
            },
            config
        );
    } catch (error) {
        console.log(error);

        if (error.response) {
            response.statusCode = error.response.status ?? 500;

            if (error.response.data.errorMessage)
                response.body = JSON.stringify(error.response.data.errorMessage);
        } else {
            response.statusCode = 500;
            response.body = JSON.stringify('ok');
        }

        return response;
    }

    return response;
};