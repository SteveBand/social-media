import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const LoginModel =
  mongoose.models.Users|| mongoose.model("Users", loginSchema);

export default LoginModel;
