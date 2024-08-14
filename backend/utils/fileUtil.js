const fs = require("fs/promises");
const path = require("path");
const JSONUtil = require("./JSONUtil");
const { DATA_PATH, USER_FOLDER_PATH } = require("./JSONUtil");

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
			JSONUtil.initializeUserFolderJSON(newUser.username);
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

async function addFile(username, filePath, filename, data) {
	let result = {
		status: 200,
		err: null,
		data: null,
	};

	await fs
		.writeFile(
			path.join(USER_FOLDER_PATH, username, filePath, filename),
			data
		)
		.catch((err) => {
			result.status = 500;
			result.err = err;
		});

	if (result.err) return result;

	const fileData = await JSONUtil.newFileJSON(
		username,
		filePath,
		filename
	).catch((err) => {
		result.status = 500;
		result.err = err;
	});

	if (!result.err) result.data = fileData;

	return result;
}

async function addFolder(username, folderPath, foldername) {
	let result = {
		status: 200,
		err: null,
		data: null,
	};

	await fs
		.mkdir(path.join(USER_FOLDER_PATH, username, folderPath, foldername))
		.catch((err) => {
			result.status = 500;
			result.err = err;
		});

	if (result.err) return result;

	const folderData = await JSONUtil.newFolderJSON(
		path.join(username, folderPath),
		foldername
	).catch((err) => {
		result.status = 500;
		result.err = err;
	});

	if (!result.err) result.data = folderData;

	return result;
}

async function getFileInfo(username, filePath, filename) {
	const result = {
		status: 200,
		err: null,
		data: null,
	};

	const stats = await fs
		.stat(getPath(username, filePath, filename))
		.then((data) => ({
			name: filename,
			path: username + filePath,
			size: data.size,
			creationDate: data.birthtime,
		}))
		.catch((err) => {
			result.status = 500;
			result.err = err;
		});
	const jsonStats = await require(getJSONPath(username, filePath));

	stats.id = jsonStats.contains.files.find(
		(file) => file.name === stats.name
	).id;
	if (!stats.id) {
		result.status = 404;
		result.err = { message: "Something went wrong looking for info" };
	} else {
		result.data = stats;
	}
	return result;
}

async function getFileContent(username, filePath, filename) {
	console.log("IN getFileContent");
}

async function copyFile(username, filePath, filename) {
	let result = {
		status: 200,
		err: null,
		data: null,
	};
	try {
		await fs.copyFile(
			path.join(USER_FOLDER_PATH, username, filePath, filename),
			path.join(USER_FOLDER_PATH, username, filePath, filename + "-copy")
		);
	} catch (err) {
		result.status = 500;
		result.err = err;
	}

	if (result.err) return result;

	const fileData = await JSONUtil.newFileJSON(
		username,
		filePath,
		filename + "-copy"
	).catch((err) => {
		result.status = 500;
		result.err = err;
	});

	if (!result.err) result.data = fileData;

	return result;
}

async function renameFile(username, filePath, filename, newName) {
	let result = {
		status: 200,
		err: null,
		data: null,
	};
	try {
		await fs.rename(
			path.join(USER_FOLDER_PATH, username, filePath, filename),
			path.join(USER_FOLDER_PATH, username, filePath, newName)
		);
	} catch (err) {
		result.status = 500;
		result.err = err;
	}

	if (result.err) return result;

	const fileData = await JSONUtil.renameFileJSON(
		username,
		filePath,
		filename,
		newName
	).catch((err) => {
		result.status = 500;
		result.err = err;
	});

	if (!result.err) result.data = fileData;

	return result;
}

async function moveFile(username, filePath, filename, newPath) {
	let result = {
		status: 200,
		err: null,
		data: null,
	};
	try {
		await fs.rename(
			path.join(USER_FOLDER_PATH, username, filePath, filename),
			path.join(USER_FOLDER_PATH, username, newPath, filename)
		);
	} catch (err) {
		result.status = 500;
		result.err = err;
	}

	if (result.err) return result;

	const fileData = await JSONUtil.moveFileJSON(
		username,
		filePath,
		filename,
		newPath
	).catch((err) => {
		result.status = 500;
		result.err = err;
	});

	if (!result.err) result.data = fileData;

	return result;
}

async function deleteFile(username, filePath, filename) {
	let result = {
		status: 200,
		err: null,
		data: null,
	};
	try {
		await fs.unlink(
			path.join(USER_FOLDER_PATH, username, filePath, filename)
		);
	} catch (err) {
		result.status = 500;
		result.err = err;
	}

	if (result.err) return result;

	const deltedFile = await JSONUtil.deleteFileJSON(
		username,
		filePath,
		filename
	).catch((err) => {
		result.status = 500;
		result.err = err;
	});

	if (!result.err) result.data = deltedFile;

	return result;
}

async function getFolderInfo(username, folderPath, folderName) {
	const result = {
		status: 200,
		err: null,
		data: await require(getJSONPath(
			username,
			path.join(folderPath, folderName)
		)),
	};

	return result;
}

async function renameFolder(username, folderPath, filename) {
	console.log("IN renameFolder");
}

async function deleteFolder(username, folderPath, filename) {
	console.log("IN deleteFolder");
}

function getPath(username, fpath, fname) {
	return path.join(USER_FOLDER_PATH, username, fpath, fname);
}

function getJSONPath(username, fpath) {
	return path.join(
		USER_FOLDER_PATH,
		username,
		fpath,
		JSONUtil.INDEX_FILE_NAME
	);
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
