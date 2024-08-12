const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateID(length = 20) {
	let id = "";
	while (length > 0) {
		id += chars.at(Math.floor(Math.random() * chars.length));
		length--;
	}
	return id;
}

module.exports.generateID = generateID;
