const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: {
    type: String,
    require: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
