import mongoose, {Schema} from "mongoose";
import {ICourse} from "./Course";

export interface IStudent extends mongoose.Document {
  id: string;
  type: string;
  authType: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  grade: number;
  school: string;
  courses: Array<ICourse>;
}

const studentSchema: mongoose.Schema = new Schema({
  type: String,
  authType: String,
  username: String,
  email: String,
  password: String,
  profilePic: String,
  grade: Number,
  school: String,
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  createdAt: {
    type: Number,
    default: Date.now()/1000 // the divided by a 1000 converts milliseconds to seconds
  }
});

export const Student =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);
