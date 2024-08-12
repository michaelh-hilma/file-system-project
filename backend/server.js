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
	fileUtil.updateUsers(users);
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

app.all("/:username", authenticateUser);

app.route("/:username/:path/file-:filename").post((req, res) => {
	switch (req.body.type) {
		case "info":
			break;
		case "show":
			break;
		case "copy":
			break;
		default:
			break;
	}
});

app.listen(3000);
