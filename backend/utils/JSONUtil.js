const fs = require("fs/promises");
const path = require("path");
const { generateID } = require("./util");
const INDEX_FILE_NAME = "index.json";
const DATA_PATH = path.resolve(__dirname, "..", "data");
const USER_FOLDER_PATH = path.join(DATA_PATH, "userFolders");

function initializeUserFolderJSON(username) {
	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, INDEX_FILE_NAME),
		JSON.stringify({
			id: generateID(),
			name: username,
			path: "/",
			creationDate: new Date().toISOString(),
			contains: {
				files: [],
				folders: [],
			},
		})
	);
}

async function newFolderJSON(folderPath, folderName) {
	const newFolder = {
		id: generateID(),
		name: folderName,
		path: folderPath,
		creationDate: new Date().toISOString(),
		contains: {
			files: [],
			folders: [],
		},
	};
	await fs
		.writeFile(
			path.join(
				USER_FOLDER_PATH,
				folderPath,
				folderName,
				INDEX_FILE_NAME
			),
			JSON.stringify(newFolder)
		)
		.catch((err) => console.log("WAAAAA", err.message));

	const parentIndex = require(path.join(
		USER_FOLDER_PATH,
		folderPath,
		INDEX_FILE_NAME
	));

	parentIndex.contains.folders.push({
		name: newFolder.name,
		id: newFolder.id,
	});
	await fs
		.writeFile(
			path.join(USER_FOLDER_PATH, folderPath, INDEX_FILE_NAME),
			JSON.stringify(parentIndex)
		)
		.catch((err) => console.log("WEEEEE", err.message));

	return newFolder;
}

async function newFileJSON(username, folderPath, fileName) {
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		folderPath,
		INDEX_FILE_NAME
	));
	console.log("folderIndex:", folderIndex);
	const newFile = {
		id: generateID(),
		name: fileName,
		path: "/" + username + folderPath,
		creationDate: new Date().toISOString(),
	};
	folderIndex.contains.files.push(newFile);
	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);
	return { id: newFile.id, name: newFile.name };
}

async function deleteFileJSON(username, folderPath, fileName) {
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		folderPath,
		INDEX_FILE_NAME
	));
	console.log("folderIndex:", folderIndex.contains.files);
	const newFiles = folderIndex.contains.files.filter(
		(file) => file.name !== fileName
	);
	const removedItem = folderIndex.contains.files.filter(
		(file) => file.name === fileName
	)[0];
	folderIndex.contains.files = newFiles;
	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);
	return { id: removedItem.id, name: removedItem.name };
}

async function deleteFolderJSON(username, folderPath, folderName) {
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		folderPath,
		INDEX_FILE_NAME
	));
	const newIndex = folderIndex.contains.folders.filter(
		(folder) => folder.name !== folderName
	);
	const removedItem = folderIndex.contains.folders.filter(
		(folder) => folder.name === folderName
	)[0];
	fs.writeFile(
		path.join(USER_FOLDER_PATH, folderPath, INDEX_FILE_NAME),
		JSON.stringify(newIndex)
	);
	return removedItem;
}

async function renameFileJSON(username, folderPath, filename, newName) {
	console.log(
		"username, folderPath, filename, newName:",
		username,
		folderPath,
		filename,
		newName
	);
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		folderPath,
		INDEX_FILE_NAME
	));
	folderIndex.contains.files.forEach((file) => {
		if (file.name === filename) file.name = newName;
	});
	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);
	return folderIndex.contains.files.find((file) => file.name === newName);
}

async function moveFileJSON(username, folderPath, filename, newPath) {
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		folderPath,
		INDEX_FILE_NAME
	));
	const fileToMove = folderIndex.contains.files.find(
		(file) => file.name === filename
	);
	console.log("fileToMove:", fileToMove);
	const updatedFiles = folderIndex.contains.files.filter(
		(file) => file.name !== filename
	);
	console.log("updatedFiles:", updatedFiles);
	folderIndex.contains.files = updatedFiles;
	console.log("folderIndex.contains.files:", folderIndex.contains.files);
	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);

	const newFolderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		newPath,
		INDEX_FILE_NAME
	));

	fileToMove.path = newPath;
	newFolderIndex.contains.files.push(fileToMove);

	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, newPath, INDEX_FILE_NAME),
		JSON.stringify(newFolderIndex)
	);

	return fileToMove;
}

async function renameFolderJSON(username, folderPath, folderName, newName) {
	console.log(
		"username, folderPath, folderName, newName:",
		username,
		folderPath,
		folderName,
		newName
	);
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		username,
		folderPath,
		newName,
		INDEX_FILE_NAME
	));
	folderIndex.name = newName;
	folderIndex.path = path.join(path.dirname(folderIndex.path), newName);
	folderIndex.contains.files.forEach((file) => {
		file.path = path.join(path.dirname(file.path), newName);
	});
	fs.writeFile(
		path.join(USER_FOLDER_PATH, username, folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);
	return folderIndex;
}

module.exports = {
	initializeUserFolderJSON,
	newFolderJSON,
	newFileJSON,
	deleteFileJSON,
	deleteFolderJSON,
	renameFileJSON,
	moveFileJSON,
	renameFolderJSON,
	INDEX_FILE_NAME,
	DATA_PATH,
	USER_FOLDER_PATH,
};
