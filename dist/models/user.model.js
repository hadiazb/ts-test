"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        require: [true, 'Nombre obligatorio'],
    },
    avatar: {
        type: String,
        default: 'av-1-png',
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es obligario'],
    },
    password: {
        type: String,
        require: [true, 'La contraseña es necesaria'],
    },
});
userSchema.method('comparedPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    return false;
});
exports.User = (0, mongoose_1.model)('user', userSchema);
//# sourceMappingURL=user.model.js.map