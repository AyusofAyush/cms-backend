"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FaqSchema = new mongoose_1.Schema({
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
const Faqs = (0, mongoose_1.model)("Faqs", FaqSchema);
// FaqSchema.index({ _id: 1 });
exports.default = Faqs;
//# sourceMappingURL=Faq.js.map