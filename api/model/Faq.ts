import { Document, model, Schema } from "mongoose";

export interface IFaq extends Document {
  type: string;
  title: string;
  description: string;
}

const FaqSchema: Schema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: {
    email: { type: String },
    createdOn: { type: Date, default: new Date() },
  },
  modifiedBy: {
    email: { type: String },
    modifiedOn: { type: Date, default: new Date() },
  },
});

const Faqs = model("Faqs", FaqSchema);

// FaqSchema.index({ _id: 1 });

export default Faqs;
