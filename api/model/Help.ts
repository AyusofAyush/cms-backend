import { Document, model, Schema } from "mongoose";

export interface IHelp extends Document {
  type: string;
  title: string;
  description: string;
}

const HelpSchema: Schema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String },
  altText: { type: String },
  paragraph: { type: String },
  createdBy: {
    email: { type: String },
    createdOn: { type: Date, default: new Date() },
  },
  modifiedBy: {
    email: { type: String },
    modifiedOn: { type: Date, default: new Date() },
  },
});

const Helps = model("Helps", HelpSchema);

// HelpSchema.index({ _id: 1 });

export default Helps;
