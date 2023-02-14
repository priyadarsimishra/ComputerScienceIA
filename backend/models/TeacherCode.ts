import mongoose, { Schema } from "mongoose";

export interface ITeacherCode extends mongoose.Document {
  code: string
}

const teacherCodeSchema: mongoose.Schema = new Schema({
  code: String,
});

export const TeacherCode =
  mongoose.models.TeacherCode || mongoose.model<ITeacherCode>("TeacherCode", teacherCodeSchema);
