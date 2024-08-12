const express = require("express");
const app = express();

// check login and signup

app.post("/login", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password || username.trim() === "")
		return res.status(400).send("Missing Username or Password!");

	const users = require("./data/users.json");
	const userIndex = users.findIndex((user) => user.username === username);
	if (userIndex === -1) return res.status(400).send("User isn't registered");
	if (users[userIndex].password !== password)
		return res.status(400).send("Incorrect Password");

	// login successful
	res.end();
});

// check if user is authenticated
app.all("/:username", (req, res, next) => {
	next();
});

app.route("/:path/file-:filename").post((req, res) => {
	switch (req.body.type) {
		case value:
			break;

		default:
			break;
	}
});

app.listen(3000);
