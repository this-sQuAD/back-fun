import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

  },
  {
    versionKey: false
  }
);

const users = mongoose.model('users', userSchema);

export default users;