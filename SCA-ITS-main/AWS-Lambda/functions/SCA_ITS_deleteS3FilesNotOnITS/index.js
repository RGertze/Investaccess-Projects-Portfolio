import axios from "axios";
import AWS from "aws-sdk";

const S3 = new AWS.S3();

const bucket = "sca-its";

export const handler = async (event) => {

    let response = {
        statusCode: 200,
        body: JSON.stringify('ok'),
    };


    let itsFiles = await getAllITSFiles();
    if (itsFiles === undefined) {
        response.statusCode = 500;
        response.body = JSON.stringify("Error retrieving ITS files. See console logs");
        return response;
    }
    if (itsFiles.length === 0) {
        response.statusCode = 200;
        response.body = JSON.stringify("No ITS files found");
        return response;
    }

    let s3Files = await getAllS3ObjectKeys();
    if (s3Files === undefined) {
        response.statusCode = 500;
        response.body = JSON.stringify("Error retrieving S3 files. See console logs");
        return response;
    }

    let filesToDelete = getFilesToDelete(s3Files, itsFiles);

    let success = await deleteFilesFromS3(filesToDelete);
    if (!success) {
        response.statusCode = 500;
        response.body = JSON.stringify("An error occured while deleting the files. See the logs");
        return response;
    }

    return response;
};

/**
 * Gets all files in ITS db
 * @returns array of files or undefined if an error occurs
 */
const getAllITSFiles = async () => {

    let config = {
        validateStatus: (status) => status < 300
    }

    let allFiles = [];

    try {
        let result = await axios.post(
            "https://its.elearning-swakopca.edu.na/api/files-to-delete/all-files",
            {
                token: "6ec6e84640767e7864fb370bbfc70204abe1852c078410c9e8059d8507d8e1b2"
            },
            config
        );

        allFiles = result.data.data;
        console.log(allFiles);

        return allFiles;
    } catch (error) {
        console.log(error);
        if (error.response) {
            console.log(error.response.data.errorMessage);
        }
        return undefined;
    }
}

/**
 * Retrieves all of the object keys in the its bucket in a map format for easy search
 * @returns map of all s3 object keys or undefined if an error occured
 */
const getAllS3ObjectKeys = async () => {
    try {
        let filesMap = {};

        let truncated = true;

        let params = {
            Bucket: bucket
        };

        while (truncated) {
            let result = await S3.listObjects(params).promise();
            result.Contents.forEach(obj => {
                filesMap[obj.Key] = { Key: obj.Key };
            });

            if (result.IsTruncated) {
                params['Marker'] = result.Contents[result.Contents.length - 1].Key;
            } else {
                truncated = false;
            }
        }

        return filesMap;
    } catch (error) {
        console.log(JSON.stringify(error));
        return undefined;
    }
}

/**
 * Compares the ITS and s3 files and determines which files are not 
 * stored in the ITS db and must be deleted. 
 * @param {Object} s3FilesMap -- map of s3 files 
 * @param {Array} itsFiles -- array of ITS files
 * @returns array of s3 objects to delete
 */
const getFilesToDelete = (s3FilesMap, itsFiles) => {

    let filesToDelete = [];

    itsFiles.forEach(f => {
        if (s3FilesMap[f.filePath] !== undefined) {
            s3FilesMap[f.filePath] = undefined;
        }
    });

    let keys = Object.keys(s3FilesMap);
    keys.forEach(key => {
        if (s3FilesMap[key] !== undefined)
            filesToDelete.push(s3FilesMap[key]);
    });

    return filesToDelete;
}

/**
 * Deletes files from S3 storage
 * @param {Array} filesToDelete -- array of objects containing the keys of files to delete
 * @returns true if the operation was successful, false if an error occured
 */
const deleteFilesFromS3 = async (filesToDelete) => {
    let deleted = null;
    let deletedMap = {};
    try {
        deleted = await S3.deleteObjects({
            Bucket: bucket,
            Delete: {
                Objects: filesToDelete
            }
        }).promise();

        if (deleted.Deleted) {
            deleted.Deleted.forEach(f => {
                deletedMap[f.Key] = true;
            });
        }

        // log undeleted files
        filesToDelete.forEach(f => {
            if (deletedMap[f.Key] === undefined)
                console.log("Failed to delete from s3: " + f.Key);
        });
        return true;
    } catch (error) {
        console.log(JSON.stringify(error));
        return false;
    }
}