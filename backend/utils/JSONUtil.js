const fs = require("fs/promises");
const path = require("path");
const { generateID } = require("./util");
const INDEX_FILE_NAME = "index.json";

function initializeUserFolderJSON(userFolderPath, username) {
	fs.writeFile(
		path.join(userFolderPath, INDEX_FILE_NAME),
		JSON.stringify({
			id: generateID(),
			name: username,
			path: userFolderPath,
			creationDate: new Date().toISOString(),
			contains: {
				files: [],
				folders: [],
			},
		})
	);
}

function newFolderJSON(folderPath) {
	const parentFolderPath = path.dirname(folderPath);
	const newFolder = {
		id: generateID(),
		name: path.basename(folderPath),
		path: folderPath,
		creationDate: new Date().toISOString(),
		contains: {
			files: [],
			folders: [],
		},
	};
	fs.writeFile(
		path.join(folderPath, INDEX_FILE_NAME),
		JSON.stringify(newFolder)
	);
	const parentIndex = require(path.join(parentFolderPath, INDEX_FILE_NAME));
	parentIndex.contains.folders.push({
		name: newFolder.name,
		id: newFolder.id,
	});
	fs.writeFile(
		path.join(parentFolderPath, INDEX_FILE_NAME),
		JSON.stringify(parentIndex)
	);
}

function newFileJSON(folderPath, fileName) {
	const folderIndex = require(path.join(folderPath, INDEX_FILE_NAME));

	const newFile = {
		id: generateID(),
		name: fileName,
		path: folderPath,
		creationDate: new Date().toISOString(),
	};
	folderIndex.contains.files.push(newFile);
	fs.writeFile(
		path.join(folderPath, INDEX_FILE_NAME),
		JSON.stringify(folderIndex)
	);
}

module.exports = {
	initializeUserFolderJSON,
	newFolderJSON,
	newFileJSON,
};
