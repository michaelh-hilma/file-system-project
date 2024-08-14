const fs = require("fs/promises");
const path = require("path");
const JSONUtil = require("./JSONUtil");
const DATA_PATH = path.resolve(__dirname, "..", "data");
const USER_FOLDER_PATH = path.join(DATA_PATH, "userFolders");

/* 
  All util functions are asyncronous and return an object with 
	{
		status,
		err,
		data
	}
	where one and only one of err and data are null
*/
async function updateUsers(users, newUser) {
	let result = await fs
		.writeFile(path.join(DATA_PATH, "users.json"), JSON.stringify(users))
		.then((data) => ({
			status: 200,
			err: null,
			data: users,
		}))
		.catch((err) => ({
			status: 500,
			err: err,
			data: null,
		}));

	if (result.err) return result;

	const newFolderPath = path.join(USER_FOLDER_PATH, newUser.username);

	await fs
		.mkdir(newFolderPath)
		.then(() => {
			JSONUtil.initializeUserFolderJSON(newFolderPath);
		})
		.catch(
			(err) =>
				(result = {
					status: 500,
					err: err,
					data: null,
				})
		);

	return result;
}

function addFile(username, filePath, data) {
	console.log("IN ADD FILE");
}

function addFolder(username, folderPath, data) {
	console.log("IN ADD FOLDER");
}

function getFileInfo(username, filePath, filename) {
	const result = {
		status: 200,
		err: null,
		data: null,
	};

	// const statPromise = fs
	// 	.stat(getPath(username, filePath, filename))
	// 	.then((stats) => ({
	// 		name: filename,
	// 		path: username + filePath,
	// 		size: data.size,
	// 		creationDate: data.birthtime,
	// 	}));
	// const jsonPromise = fs
	// 	.readFile(getJSONPath(username, filePath))
	// 	.then((data) => ({
	// 		name: filename,
	// 		path: username + filePath,
	// 		size: data.size,
	// 		creationDate: data.birthtime,
	// 	}));
}

function getFileContent(username, filePath, filename) {
	console.log("IN getFileContent");
}

function copyFile(username, filePath, filename) {
	console.log("IN copyFile");
}

function renameFile(username, filePath, filename, newName) {
	console.log("IN renameFile");
}

function moveFile(username, filePath, filename, newPath) {
	console.log("IN moveFile");
}

function deleteFile(username, filePath, filename) {
	console.log("IN deleteFile");
}

function getFolderInfo(username, folderPath, filename) {
	console.log("IN getFolderInfo");
}

function renameFolder(username, folderPath, filename) {
	console.log("IN renameFolder");
}

function deleteFolder(username, folderPath, filename) {
	console.log("IN deleteFolder");
}

function makeNewUserFolder(username) {
	console.log("IN makeNewUserFolder");
}

function getPath(username, fpath, fname) {
	return path.join(USER_FOLDER_PATH, username, fpath, fname);
}

module.exports.updateUsers = updateUsers;
module.exports.getFileInfo = getFileInfo;
module.exports.getFileContent = getFileContent;
module.exports.copyFile = copyFile;
module.exports.renameFile = renameFile;
module.exports.moveFile = moveFile;
module.exports.deleteFile = deleteFile;
module.exports.getFolderInfo = getFolderInfo;
module.exports.renameFolder = renameFolder;
module.exports.deleteFolder = deleteFolder;
module.exports.addFile = addFile;
module.exports.addFolder = addFolder;
