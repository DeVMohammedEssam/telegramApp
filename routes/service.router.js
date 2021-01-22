const router = require("express").Router();
const {
  generateNumbers,
  getGeneratedNumbers,
  FilterSequence,
  sendMessage,
} = require("../controllers/service.controller");
const { Api } = require("../services/gramjs");
router.post("/generate-numbers", generateNumbers);

router.get("/generated-numbers", getGeneratedNumbers);
router.post("/filter-sequence", FilterSequence);
router.post("/message", sendMessage);

module.exports = router;
