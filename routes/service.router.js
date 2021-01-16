const router = require("express").Router();
const {
  generateNumbers,
  getGeneratedNumbers,
} = require("../controllers/service.controller");
const { Api } = require("../services/gramjs");
router.post("/generate-numbers", generateNumbers);
router.get("/generated-numbers", getGeneratedNumbers);
module.exports = router;

//TODO:
// filter Api Return shape
// +201100720xxxx noFrom
// +201100729xxxx noTo
// "staticPart": "201011",
// "from": "800000",
// "to": "900000",
// "count": 100000
