// import express, { Request, NextFunction, Response } from 'express';

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

import Server from './server';

const server = new Server();

server.start(() => {
	console.log(`Running on ${server.port}`);
});
