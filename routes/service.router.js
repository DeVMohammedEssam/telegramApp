const router = require("express").Router();
module.exports = (io) => {
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
  router.post("/filter-sequence", FilterSequence(io));
  router.post("/message", sendMessage);
  router.get("/get-filter-count", getFilterCount);
  router.get("/get-analysis", getAnalysis);
  router.get("/sequence-count", getRangeCount);

  return router;
};
