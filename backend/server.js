const express = require("express");
const app = express();
const util = require("./utils/util");
const fileUtil = require("./utils/fileUtil");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// check login and signup

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Missing Username or Password!");

  const users = require("./data/users.json");
  const userIndex = users.findIndex((user) => user.username === username);
  if (userIndex === -1) return res.status(400).send("User isn't registered");
  if (users[userIndex].password !== password)
    return res.status(400).send("Incorrect Password");

  // login successful
  res.status(200).json({ username, id: users[userIndex].id }).end();
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Missing Username or Password!");
  if (typeof username !== "string" || typeof password !== "string")
    return res.status(400).send("Username or Password not strings!");
  if (!/^[a-zA-Z0-9]*$/.test(username))
    return res.status(400).send("Username cannot contain special characters");

  const users = require("./data/users.json") || [];
  if (users.some((user) => user.username === username))
    return res.status(400).send("Username already exists");

  // validation done
  const newUser = {
    username,
    password,
    id: util.generateID(),
  };
  users.push(newUser);

  const response = await fileUtil.updateUsers(users, newUser);
  if (response.err) {
    res.status(response.status).send(response.err.message).end();
  } else {
    res.json({ id: newUser.id, username: newUser.username }).end();
  }
});

// check if user is authenticated
function authenticateUser(req, res, next) {
  const users = require("./data/users.json");
  if (
    !users.some(
      (user) =>
        user.id === req.headers.authorization &&
        user.username === req.params.username
    )
  ) {
    res
      .status(403)
      .send(
        "User not authorized. Send user ID in Authorization field of request"
      )
      .end();
  } else next();
}

app.all("/:username/*", authenticateUser);

app
  .route("/:username*/file-:filename")
  .post(async (req, res) => {
    const { username, filename } = req.params;
    const path = req.params[0];
    let response;
    switch (req.body.type) {
      case "info":
        response = await fileUtil.getFileInfo(username, path, filename);

        if (response.err)
          return res.status(response.status).send(response.err.message).end();

        res.json(response.data).end();
        break;
      case "show":
        response = await fileUtil.getFileContent(username, path, filename);

        if (response.err)
          return res.status(response.status).send(response.err.message).end();
        res.send(response.data).end();
        break;
      case "copy":
        response = await fileUtil.copyFile(username, path, filename);
        if (response.err) {
          res.status(response.status).send(response.err.message).end();
        } else {
          res.send(response.data).end();
        }
        break;
    }
    //res.end();
  })
  .patch(async (req, res) => {
    const { username, filename } = req.params;
    const path = req.params[0];
    let response;
    if (req.body.name) {
      response = await fileUtil.renameFile(
        username,
        path,
        filename,
        req.body.name
      );

      if (response.err)
        return res.status(response.status).send(response.err.message).end();
      res.send(response.data).end();
    } else if (req.body.path) {
      response = await fileUtil.moveFile(
        username,
        path,
        filename,
        req.body.path
      );

      if (response.err)
        return res.status(response.status).send(response.err.message).end();
      return res.send(response.data).end();
    } else res.status(400).send("Missing name in body");
  })
  .delete(async (req, res) => {
    const { username, filename } = req.params;
    const path = req.params[0];
    const response = await fileUtil.deleteFile(username, path, filename);

    if (response.err)
      return res.status(response.status).send(response.err.message).end();
    res.send(response.data).end();
  });

app
  .route("/:username*/folder-:foldername")
  .post(async (req, res) => {
    const { username, foldername } = req.params;
    const path = req.params[0];
    const response = await fileUtil.getFolderInfo(username, path, foldername);

    if (response.err)
      return res.status(response.status).send(response.err.message).end();
    res.send(response.data).end();
  })
  .patch(async (req, res) => {
    const { username, foldername } = req.params;
    const path = req.params[0];
    if (req.body.name) {
      const response = await fileUtil.renameFolder(
        username,
        path,
        foldername,
        req.body.name
      );

      if (response.err)
        return res.status(response.status).send(response.err.message).end();
      return res.send(response.data).end();
    }
    res
      .status(400)
      .send(
        "Name should be specified in body for rename operation, and path should be specified for move operation"
      );
  })
  .delete(async (req, res) => {
    const { username, foldername } = req.params;
    const path = req.params[0];
    const response = await fileUtil.deleteFolder(username, path, foldername);

    if (response.err)
      return res.status(response.status).send(response.err.message).end();
    res.send(response.data).end();
  });

app.post("/:username*/folder", async (req, res) => {
  const { username } = req.params;
  const path = req.params[0];

  const response = await fileUtil.addFolder(
    username,
    path,
    req.body.name,
    req.body.data
  );
  if (response.err) {
    res.status(response.status).send(response.err.message).end();
  } else {
    res.json(response.data).end();
  }
});
app.post("/:username*/file", async (req, res) => {
  const { username } = req.params;
  const path = req.params[0];
  const response = await fileUtil.addFile(
    username,
    path,
    req.body.name,
    req.body.data
  );
  if (response.err) {
    res.status(response.status).send(response.err.message).end();
  } else {
    res.json(response.data).end();
  }
});

app.post("/:username", authenticateUser, async (req, res) => {
  const response = await fileUtil.getFolderInfo(req.params.username);
  if (response.err) {
    res.status(response.status).send(response.err.message).end();
  } else {
    res.status(200).json(response.data).end();
  }
});

app.listen(3000);
