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

async function newFileJSON(folderPath, fileName) {
	const folderIndex = await require(path.join(
		USER_FOLDER_PATH,
		folderPath,
		INDEX_FILE_NAME
	));
	const newFile = {
		id: generateID(),
		name: fileName,
		path: folderPath,
		creationDate: new Date().toISOString(),
	};
	folderIndex.contains.files.push(newFile);
	fs.writeFile(
		path.join(USER_FOLDER_PATH, folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);
	return { id: newFile.id, name: newFile.name };
}

module.exports = {
	initializeUserFolderJSON,
	newFolderJSON,
	newFileJSON,
	INDEX_FILE_NAME,
	DATA_PATH,
	USER_FOLDER_PATH,
};
