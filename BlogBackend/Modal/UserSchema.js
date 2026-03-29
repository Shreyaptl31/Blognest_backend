const mongoose = require("mongoose");
const { Schema } = require("../db");
const bcrypt = require("bcrypt");

const commonSchema = {
  type: String,
  trim: true,
};

const userSchema = new Schema({
  name: { ...commonSchema },
  lname: { ...commonSchema },
  email: { ...commonSchema },
  password: { ...commonSchema },
  blog: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

// password brcrypt
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
