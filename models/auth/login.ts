import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const LoginModel = mongoose.model("users", loginSchema);

export default LoginModel;
