const router = require("express").Router();
const {
  generateNumbers,
  getGeneratedNumbers,
} = require("../controllers/service.controller");
const { Api } = require("../services/gramjs");
router.post("/generate-numbers", generateNumbers);
//TODO:
//Response with data 
// noFrom: +201100720xxxx 
// noTo: +201100729xxxx 
// "staticPart": "201011",
// "from": "800000",
// "to": "900000",
// "count": 100000

router.get("/generated-numbers", getGeneratedNumbers);
module.exports = router;

//TODO:
// filter action Api
// Request DATA {noFrom,noTo}
// Response data
// +201100720xxxx noFrom
// +201100729xxxx noTo
// "staticPart": "201011",
// "from": "800000",
// "to": "900000",
// "count": 100000
