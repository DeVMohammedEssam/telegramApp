const router = require("express").Router();
const {
  generateNumbers,
  getGeneratedNumbers,
  FilterSequence,
  sendMessage,
  getFilterCount,
  getAnalysis,
  getRangeCount,
} = require("../controllers/service.controller");
const { Api } = require("../services/gramjs");
router.post("/generate-numbers", generateNumbers);

router.get("/generated-numbers", getGeneratedNumbers);
router.post("/filter-sequence", FilterSequence);
router.post("/message", sendMessage);
router.get("/get-filter-count", getFilterCount);
router.get("/get-analysis", getAnalysis);
router.get("/sequence-count", getRangeCount);

module.exports = router;
