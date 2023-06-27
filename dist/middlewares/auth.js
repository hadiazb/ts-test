"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const token_1 = __importDefault(require("../utils/token"));
const verifyToken = (req, res, next) => {
    const token = req.get('x-token') || '';
    token_1.default.comparedToken(token)
        .then((decoded) => {
        req.user = decoded.user;
        next();
    })
        .catch((err) => {
        res.json({
            ok: false,
            message: 'token no correct',
        });
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map