import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  gender: String,
});

const SignupModel = mongoose.model("Users", signupSchema);

export default SignupModel;
