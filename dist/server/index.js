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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const user_1 = __importDefault(require("../routes/user"));
const post_1 = __importDefault(require("../routes/post"));
dotenv_1.default.config();
const dbUrl = process.env.DB_URL || '';
class Server {
    constructor() {
        this.port = 3000;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.fileUpload();
        this.connectDB();
        this.routes();
    }
    start(callback) {
        this.app.listen(this.port, callback);
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mongoose_1.default.connect(dbUrl, {
                    autoIndex: true,
                });
                console.log('Base de datos conectada');
            }
            catch (error) {
                console.log('Hay un error con la conexion de la DB');
                throw new Error('Hay error');
            }
        });
    }
    routes() {
        this.app.use('/users', user_1.default);
        this.app.use('/posts', post_1.default);
    }
    fileUpload() {
        this.app.use((0, express_fileupload_1.default)());
    }
}
exports.default = Server;
//# sourceMappingURL=index.js.map