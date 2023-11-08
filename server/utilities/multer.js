const multer = require("multer");
const path = require("path");
const filePath = path.join(process.cwd(), "public", "uploads");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), "server/public", "uploads"));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
	},
});

function fileFilter(req, file, cb) {
	// The function should call `cb` with a boolean
	// to indicate if the file should be accepted

	// To reject this file pass `false`, like so:
	//   cb(null, false);

	// To accept the file pass `true`, like so:
	cb(null, true);

	// You can always pass an error if something goes wrong:
	//   cb(new Error("I don't have a clue!"));
}

module.exports = multer({ storage: storage, fileFilter });
