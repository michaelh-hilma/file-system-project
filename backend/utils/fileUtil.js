const fs = require("fs");

function updateUsers(users) {
	console.log("users:", users);
}

// if path is undefined, the folder is the root folder

function getFileInfo(username, path, filename) {
	console.log("IN getFileInfo");
}

function getFileContent(username, path, filename) {
	console.log("IN getFileContent");
}

function copyFile(username, path, filename) {
	console.log("IN copyFile");
}

function renameFile(username, path, filename, newName) {
	console.log("IN renameFile");
}

function moveFile(username, path, filename, newPath) {
	console.log("IN moveFile");
}

function deleteFile(username, path, filename) {
	console.log("IN deleteFile");
}

function getFolderInfo(username, path, filename) {
	console.log("IN getFolderInfo");
}

function renameFolder(username, path, filename) {
	console.log("IN renameFolder");
}

function deleteFolder(username, path, filename) {
	console.log("IN deleteFolder");
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
