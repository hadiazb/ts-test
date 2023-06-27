"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date,
    },
    message: {
        type: String,
    },
    img: [
        {
            type: String,
        },
    ],
    coords: {
        type: String,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        require: [true, 'Debe de existir ref a usuario'],
    },
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = (0, mongoose_1.model)('post', postSchema);
//# sourceMappingURL=post.model.js.map