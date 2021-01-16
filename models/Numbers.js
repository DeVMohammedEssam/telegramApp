const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//TODO:
// filter Api Return shape
// +201100720xxxx noFrom
// +201100729xxxx noTo
// "staticPart": "201011",
// "from": "800000",
// "to": "900000",
// "count": 100000

const numberSchema = new Schema({
  numberFrom: {
    type: String,
    required: true,
    trim: true,
  },
  numberTo: {
    type: String,
    required: true,
    trim: true,
  },
  staticPart: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

const GeneratedNumber = mongoose.model("GeneratedNumber", numberSchema);

module.exports = GeneratedNumber;
