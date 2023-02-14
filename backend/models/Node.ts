import mongoose, {model, Schema} from "mongoose";
import {IResource} from "./Resource";
import {ICourse} from "./Course";
import {IAssignment} from "./assignment";
import {IStatus} from "./Status";

export interface INode extends mongoose.Document {
  type: string;
  name: string;
  skills: Array<any>; // TODO: change this type later
  parent: Array<string>; 
  description: string;
  positionID: string;
  assignments: Array<IAssignment>;
  course: Array<ICourse>;
  resources: Array<IResource>;
  status: Array<IStatus>;
}

const nodeSchema = new Schema({
  type: String,
  name: String,
  skills: [],
  parent: [String],
  description: String,
  positionID: String,
  assignments: [],
  resources: [],
  status: [],
  course: { type: Schema.Types.ObjectId, ref: "Course" },
});

export const Node =
  mongoose.models.Node || mongoose.model<INode>("Node", nodeSchema);