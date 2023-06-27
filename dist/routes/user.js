"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const token_1 = __importDefault(require("../utils/token"));
const auth_1 = require("../middlewares/auth");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/', [auth_1.verifyToken], (req, res, next) => {
    const user = req.user;
    res.send({
        ok: true,
        user,
    });
});
userRoutes.post('/create', (req, res, next) => {
    const { email, password, name, avatar } = req.body;
    const user = {
        name,
        email,
        password: bcrypt_1.default.hashSync(password, 10),
        avatar,
    };
    user_model_1.User.create(user)
        .then((userDB) => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.send({
            ok: true,
            token: tokenUser,
        });
    })
        .catch((err) => {
        res.send({
            ok: false,
            err: err.message,
            message: err.message.includes('E11000 duplicate key')
                ? 'Email ya registrado'
                : 'Ha ocurrido un error con el registro',
        });
    });
});
userRoutes.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    user_model_1.User.findOne({ email })
        .then((userDB) => {
        if (!userDB) {
            return res.send({
                ok: false,
                message: 'email o contraseña incorrectas',
            });
        }
        if (!userDB.comparedPassword(password)) {
            return res.send({
                ok: false,
                message: 'email o contraseña incorrectas ***',
            });
        }
        if (userDB.comparedPassword(password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            res.send({
                ok: true,
                token: tokenUser,
            });
        }
    })
        .catch((err) => {
        res.send({
            ok: false,
            err,
        });
    });
});
userRoutes.put('/update', auth_1.verifyToken, (req, res, next) => {
    const { name, email, avatar } = req.body;
    user_model_1.User.findByIdAndUpdate(req.user._id, { name, email, avatar }, { new: true })
        .then((userDB) => {
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'no encontrado',
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.json({
            ok: true,
            token: tokenUser,
        });
    })
        .catch((err) => {
        res.json({
            ok: true,
            message: 'hay algo mal',
        });
    });
});
exports.default = userRoutes;
//# sourceMappingURL=user.js.map