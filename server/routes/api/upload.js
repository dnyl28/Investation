var router = require("express").Router();
const path = require("path");

var fs = require("fs");
var multer = require("../../utilities/multer");
var cpUpload = multer.fields([{ name: "file", maxCount: 1 }]);

router.post("/", cpUpload, function (req, res, next) {
	return res.json({ url: `uploads/${req.files["file"][0].filename}` });
});

router.post("/delete", function (req, res, next) {
	if (req.body.url) {
		fs.unlink(path.join(process.cwd(), "server/public", req.body.url), function (err) {
			if (err) {
				return res.sendStatus(204);
			}
			// if no error, file has been deleted successfully
			return res.json({ status: 200, event: "File deleted Successfully" });
		});
	} else {
		if (!event) return res.sendStatus(204);
	}
	// unlink the files
});

module.exports = router;
