const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      length: 32,
      trim: true,
    },

    lastname: {
      type: String,
      length: 32,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true, //trim rmoves the space
      unique: true,
    },

    //TODO:come back here
    salt: String,

    encry_password: {
      type: String,
      required: true
    },

    userinfo: {
      type: String,
      trim: true,
    },

    role: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods = {

  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

userSchema
  .virtual("password") //signup
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

module.exports = mongoose.model("User", userSchema);
