import mongoose, { Schema } from "mongoose";
import { ICourse } from "./Course";

export interface ITeacher extends mongoose.Document {
  id: string;
  type: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  school: string;
  courses: Array<ICourse>;
}

const teacherSchema: mongoose.Schema = new Schema({
  type: String,
  username: String,
  email: String,
  password: String,
  profilePic: String,
  school: String,
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  createdAt: {
    type: Number,
    default: Date.now() / 1000, // the divided by a 1000 converts milliseconds to seconds
  },
});

export const Teacher =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", teacherSchema);
