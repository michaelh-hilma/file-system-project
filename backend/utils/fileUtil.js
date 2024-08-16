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
  try {
    await fs.access(USER_FOLDER_PATH);
  } catch (err) {
    await fs.mkdir(USER_FOLDER_PATH).catch(
      (err) =>
        (result = {
          status: 500,
          err: err,
          data: null,
        })
    );
  }

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
  const parentIndex = await JSONUtil.getIndex(username, filePath);
  if (parentIndex.contains.files.some((file) => file.name === filename))
    return {
      status: 400,
      err: new Error("File Already Exists"),
      data: null,
    };
  await fs
    .writeFile(path.join(USER_FOLDER_PATH, username, filePath, filename), data)
    .catch((err) => {
      result.status = 500;
      result.err = err;
      console.log(err);
    });
  if (result.err) return result;

  const fileSize = (
    await fs.stat(path.join(USER_FOLDER_PATH, username, filePath, filename))
  ).size;

  let fileData;
  try {
    fileData = await JSONUtil.newFileJSON(
      username,
      filePath,
      filename,
      fileSize
    );
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

  if (!result.err) result.data = fileData;

  return result;
}

async function addFolder(username, folderPath, foldername) {
  let result = {
    status: 200,
    err: null,
    data: null,
  };

  const parentIndex = await JSONUtil.getIndex(username, folderPath);
  if (parentIndex.contains.folders.some((folder) => folder.name === foldername))
    return {
      status: 400,
      err: new Error("Folder Already Exists"),
      data: null,
    };

  await fs
    .mkdir(path.join(USER_FOLDER_PATH, username, folderPath, foldername))
    .catch((err) => {
      result.status = 500;
      result.err = err;
    });

  if (result.err) return result;

  let folderData;
  try {
    folderData = await JSONUtil.newFolderJSON(username, folderPath, foldername);
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

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
  const result = {
    status: 200,
    err: null,
    data: null,
  };
  try {
    result.data = await fs.readFile(
      path.join(USER_FOLDER_PATH, username, filePath, filename),
      { encoding: "utf8" }
    );
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

  return result;
}

// async function getFileContent(username, filePath, filename) {
//   return {
//     status: 200,
//     err: null,
//     data: path.join(USER_FOLDER_PATH, username, filePath, filename),
//   };
// }

async function copyFile(username, filePath, filename) {
  let result = {
    status: 200,
    err: null,
    data: null,
  };

  let newFileName, fileSize;
  try {
    let index = filename.indexOf(".");
    if (index === -1) {
      newFileName = filename + "-copy";
    } else {
      newFileName = filename.slice(0, index) + "-copy" + filename.slice(index);
    }

    const parentIndex = await JSONUtil.getIndex(username, filePath);
    if (parentIndex.contains.files.some((file) => file.name === newFileName))
      return {
        status: 400,
        err: new Error("File with name of copy Already Exists"),
        data: null,
      };

    await fs.copyFile(
      path.join(USER_FOLDER_PATH, username, filePath, filename),
      path.join(USER_FOLDER_PATH, username, filePath, newFileName)
    );
    fileSize = (
      await fs.stat(path.join(USER_FOLDER_PATH, username, filePath, filename))
    ).size;
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

  if (result.err) return result;

  const fileData = await JSONUtil.newFileJSON(
    username,
    filePath,
    newFileName,
    fileSize
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
  const parentIndex = await JSONUtil.getIndex(username, filePath);
  if (parentIndex.contains.files.some((file) => file.name === newName))
    return {
      status: 400,
      err: new Error("There is already a file with that name"),
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
    await fs.access(path.join(USER_FOLDER_PATH, username, newPath));
  } catch (err) {
    return {
      status: 404,
      err: new Error("No such directory"),
      data: null,
    };
  }
  const parentIndex = await JSONUtil.getIndex(username, newPath);
  if (parentIndex.contains.files.some((file) => file.name === filename))
    return {
      status: 400,
      err: new Error("new Folder already contains item with that name"),
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
    await fs.unlink(path.join(USER_FOLDER_PATH, username, filePath, filename));
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

  if (result.err) return result;

  const deletedFile = await JSONUtil.deleteFileJSON(
    username,
    filePath,
    filename
  ).catch((err) => {
    result.status = 500;
    result.err = err;
  });

  if (!result.err) result.data = deletedFile;

  return result;
}

async function getFolderInfo(username, folderPath = "", folderName = null) {
  let result;
  if (!folderName) {
    try {
      return {
        status: 200,
        err: null,
        data: await require(getJSONPath(username)),
      };
    } catch (err) {
      return {
        status: 404,
        err: err,
        data: null,
      };
    }
  }
  try {
    result = {
      status: 200,
      err: null,
      data: await require(getJSONPath(
        username,
        path.join(folderPath, folderName)
      )),
    };
  } catch (err) {
    return {
      status: 404,
      err: err,
      data: null,
    };
  }
  return result;
}

async function renameFolder(username, folderPath, foldername, newName) {
  let result = {
    status: 200,
    err: null,
    data: null,
  };
  const parentIndex = await JSONUtil.getIndex(username, folderPath);
  if (parentIndex.contains.folders.some((folder) => folder.name === newName))
    return {
      status: 400,
      err: new Error("Folder with new name Already Exists"),
      data: null,
    };
  try {
    await fs.rename(
      path.join(USER_FOLDER_PATH, username, folderPath, foldername),
      path.join(USER_FOLDER_PATH, username, folderPath, newName)
    );
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

  if (result.err) return result;

  const folderData = await JSONUtil.renameFolderJSON(
    username,
    folderPath,
    foldername,
    newName
  ).catch((err) => {
    result.status = 500;
    result.err = err;
  });

  if (!result.err) result.data = folderData;

  return result;
}

async function deleteFolder(username, folderPath, folderName) {
  let result = {
    status: 200,
    err: null,
    data: null,
  };
  try {
    await fs.rm(path.join(USER_FOLDER_PATH, username, folderPath, folderName), {
      recursive: true,
      force: true,
    });
  } catch (err) {
    result.status = 500;
    result.err = err;
  }

  if (result.err) return result;

  const deletedFolder = await JSONUtil.deleteFolderJSON(
    username,
    folderPath,
    folderName
  ).catch((err) => {
    result.status = 500;
    result.err = err;
  });

  if (!result.err) result.data = deletedFolder;

  return result;
}

function getPath(username, fpath, fname) {
  return path.join(USER_FOLDER_PATH, username, fpath, fname);
}

function getJSONPath(username, fpath = null) {
  return fpath
    ? path.join(USER_FOLDER_PATH, username, fpath, JSONUtil.INDEX_FILE_NAME)
    : path.join(USER_FOLDER_PATH, username, JSONUtil.INDEX_FILE_NAME);
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
