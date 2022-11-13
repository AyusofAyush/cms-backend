"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HelpSchema = new mongoose_1.Schema({
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
const Helps = (0, mongoose_1.model)("Helps", HelpSchema);
// HelpSchema.index({ _id: 1 });
exports.default = Helps;
//# sourceMappingURL=Help.js.map