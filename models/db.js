const mongoose = require("mongoose");

const configure = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("connected to db");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  configure,
};
