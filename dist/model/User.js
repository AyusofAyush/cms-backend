"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const Users = (0, mongoose_1.model)("Users", userSchema);
userSchema.index({ email: 1 });
exports.default = Users;
//# sourceMappingURL=User.js.map