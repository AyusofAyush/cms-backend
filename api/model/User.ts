import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = model("Users", userSchema);

userSchema.index({ email: 1 });

export default Users;
