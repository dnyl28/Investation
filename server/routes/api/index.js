let router = require("express").Router();

router.use("/user", require("./user"));
router.use("/upload", require("./upload"));
router.use("/post", require("./post"));
router.use("/poll", require("./poll"));
router.use("/chat", require("./chat"));

module.exports = router;
