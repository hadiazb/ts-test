"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../utils/file-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
postRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.send({
        ok: true,
        page,
        posts,
    });
}));
postRoutes.post('/', [auth_1.verifyToken], (req, res, next) => {
    const body = req.body;
    body.user = req.user._id;
    const images = fileSystem.imagesTempToPost(req.user._id);
    body.img = images;
    post_model_1.Post.create(body)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('user', '-password');
        res.json({
            ok: true,
            post: postDB,
        });
    }))
        .catch((err) => {
        res.send({
            err,
            ok: false,
        });
    });
});
postRoutes.post('/upload', [auth_1.verifyToken], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).send({
            ok: false,
            message: 'No se subio ningun archivo',
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).send({
            ok: false,
            message: 'No se subio ningun archivo -image',
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).send({
            ok: false,
            message: 'No se subio ningun archivo -image',
        });
    }
    yield fileSystem.saveImageTemp(file, req.user._id);
    res.send({
        ok: true,
        file: file.mimetype,
    });
}));
postRoutes.get('/image/:userid/:img', (req, res, next) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathImg = fileSystem.getImgUrl(userId, img);
    res.sendFile(pathImg);
});
exports.default = postRoutes;
//# sourceMappingURL=post.js.map