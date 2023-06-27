"use strict";
// import express, { Request, NextFunction, Response } from 'express';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dotenv from 'dotenv';
// dotenv.config();
// const app = express();
// app.get('/', (req: Request, res: Response, next: NextFunction) => {
// 	res.send({
// 		Hola: 'Buenos dias mis amores',
// 	});
// });
// app.listen(process.env.PORT, () => {
// 	console.log(`Running on ${process.env.PORT}`);
// });
const server_1 = __importDefault(require("./server"));
const server = new server_1.default();
server.start(() => {
    console.log(`Running on ${server.port}`);
});
//# sourceMappingURL=index.js.map