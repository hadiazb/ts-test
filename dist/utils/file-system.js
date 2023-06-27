"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveImageTemp(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.createFileUser(userId);
            const nameFile = this.generateUniqueName(file.name);
            file.mv(`${path}/${nameFile}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(`${path}/${nameFile}`);
                }
            });
        });
    }
    createFileUser(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generateUniqueName(originalName) {
        const arrName = originalName.split('.');
        const extension = arrName[arrName.length - 1];
        const idUnique = (0, uniqid_1.default)();
        return `${idUnique}.${extension}`;
    }
    imagesTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesInTemp(userId);
        imagesTemp.forEach((img) => {
            fs_1.default.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`);
        });
        return imagesTemp;
    }
    getImagesInTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getImgUrl(userId, img) {
        const pathImg = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const exist = fs_1.default.existsSync(pathImg);
        if (!exist) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathImg;
    }
}
exports.default = FileSystem;
//# sourceMappingURL=file-system.js.map