const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const Joi = require("joi");
const bcryptjs = require("bcryptjs");

class User {
  static collection() {
    return database.collection("users");
  }
  static async findUsers() {
    return this.collection().find().toArray();
  }
  static async findUserById(_id) {
    return this.collection().findOne({ _id: new ObjectId(String(_id)) });
  }
  static async findUserByUsername(username) {
    return this.collection().findOne({
      username: { $regex: new RegExp(username, "i") },
    });
  }

  static async findUserByName(name) {
    return this.collection()
      .find({
        name: { $regex: new RegExp(name, "i") },
      })
      .toArray();
  }

  static async findUserByEmail(email) {
    return this.collection().findOne({ email });
  }
  static async registerUser({ name, username, email, password }) {
    // Validasi input menggunakan Joi
    const schema = Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const validation = schema.validate({ name, username, email, password });
    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }

    const hashedPassword = await bcryptjs.hashSync(password);

    return this.collection().insertOne({
      name,
      username,
      email,
      password: hashedPassword,
    });
  }
}

module.exports = User;
