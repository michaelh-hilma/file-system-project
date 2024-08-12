const express = require("express");
const app = express();
const util = require("./utils/util");
const fileUtil = require("./utils/fileUtil");

app.use(express.json());

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
	res.end(JSON.stringify({ username, id: users[userIndex].id }));
});

app.post("/signup", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).send("Missing Username or Password!");
	if (typeof username !== "string" || typeof password !== "string")
		return res.status(400).send("Username or Password not strings!");
	if (!/^[a-zA-Z0-9]*$/.test(username))
		return res
			.status(400)
			.send("Username cannot contain special characters");

	const users = require("./data/users.json");
	if (users.some((user) => user.username === username))
		return res.status(400).send("Username already exists");

	// validation done
	const newUser = {
		username,
		password,
		id: util.generateID(),
	};
	users.push(newUser);
	fileUtil.updateUsers(users, __dirname);
	res.json({ id: newUser.id, username: newUser.username });
	res.end();
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
		res.status(403).send("User not authorized");
		res.end();
	} else next();
}

app.all("/:username/*", authenticateUser);

app.route("/:username*/file-:filename")
	.post((req, res) => {
		const { username, filename } = req.params;
		const path = req.params[0];
		switch (req.body.type) {
			case "info":
				res.json(fileUtil.getFileInfo(username, path, filename));
				break;
			case "show":
				res.send(fileUtil.getFileContent(username, path, filename));
				break;
			case "copy":
				res.json(fileUtil.copyFile(username, path, filename));
				break;
			default:
				res.status(400).send(
					'Type should be specified in request body, and should be one of "info", "show", or "copy"'
				);
				break;
		}
		res.end();
	})
	.patch((req, res) => {
		const { username, filename } = req.params;
		const path = req.params[0];
		if (req.body.name) {
			fileUtil.renameFile(username, path, filename, req.body.name);
			res.end();
		} else if (req.body.path) {
			fileUtil.moveFile(username, path, filename, req.body.path);
			res.end();
		} else res.status(400).send("Missing name in body");
	})
	.delete((req, res) => {
		const { username, filename } = req.params;
		const path = req.params[0];
		fileUtil.deleteFile(username, path, filename);
		res.end();
	});

app.route("/:username*/folder-:foldername")
	.post((req, res) => {
		const { username, foldername } = req.params;
		const path = req.params[0];
		res.json(fileUtil.getFolderInfo(username, path, foldername));
		res.end();
	})
	.patch((req, res) => {
		const { username, foldername } = req.params;
		const path = req.params[0];
		if (req.body.name) {
			fileUtil.renameFolder(username, path, foldername, req.body.name);
			res.end();
		}
		res.status(400).send(
			"Name should be specified in body for rename operation, and path should be specified for move operation"
		);
	})
	.delete((req, res) => {
		const { username, foldername } = req.params;
		const path = req.params[0];
		fileUtil.deleteFolder(username, path, foldername);
		res.end();
	});

app.post("/:username", (req, res) => {
	res.json(fileUtil.getFolderInfo(req.params.username, null, null));
	res.end();
});

app.listen(3000);
