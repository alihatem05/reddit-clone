import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    avatar:   { type: String, default: "" },
    karma:    { type: Number, default: 0 },

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }]
  },
  { timestamps: true }
);

UserSchema.statics.register = async function(username, email, password) {
    if (!username || !email || !password) {
        throw Error("All fields must be filled!")
    }

    if (!validator.isEmail(email)) {
        throw Error("Incorrect email structure!")
    }

    const exists = await this.findOne({email})
    if (exists) {
        throw Error('Email already exists!')
    } 

    const usernameExists = await this.findOne({ username });
    if (usernameExists) {
        throw Error("Username already taken!");
    }

    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({username, email, password: hash})

    return user;
}

UserSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled!")
    }

    const user = await this.findOne({email})
    if (!user) {
        throw Error('User does not exist!')
    } 

    const match = await bcrypt.compare(password, user.password)

    if (!match) { throw Error("Incorrect password!")}

    return user
}

export default mongoose.model("User", UserSchema);
