// const { model, Schema } = require("mongoose");
import mongoose, { model, Schema } from "mongoose";
import {INode} from "./Node";

export interface ICourse extends mongoose.Document {
  name: string;
  description: string;
  teacherID: string;
  courseCode: string;
  courseLink: string;
  numOfStudents: number;
  nodes: Array<INode>;
}

const courseSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  teacherID: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  }, // change this to Teacher Type MongoObject
  courseCode: {
    type: String,
  },
  courseLink: {
    type: String,
  },
  numOfStudents: {
    type: Number,
  },
  nodes: [{ type: Schema.Types.ObjectId, ref: "Node" }],
});

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);