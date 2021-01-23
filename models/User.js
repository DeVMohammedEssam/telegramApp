const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  telegramId: {
    type: Number,
    required: true,
  },
  wasOnline: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

userSchema.statics.filterByLastOnlineTime = async (timestamp = 0) => {
  const timeStampNumber = parseInt(timestamp);
  let users;
  if (timeStampNumber > 0) {
    const filterTimeMs =
      new Date().getMilliseconds() + parseInt(timestamp) * 1000;
    users = await User.find({ wasOnline: { $lte: filterTimeMs } });
  } else {
    users = await User.find({});
  }

  return users;
};

userSchema.statics.getTimeFilterCount = async (timestamp = 0) => {
  const timeStampNumber = parseInt(timestamp);
  let count = 0;
  if (timeStampNumber > 0) {
    const filterTimeMs =
      new Date().getMilliseconds() + parseInt(timestamp) * 1000;
    count = await User.count({ wasOnline: { $lte: filterTimeMs } });
  } else {
    count = await User.count();
  }
  return count;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
