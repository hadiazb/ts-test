import express, { Request, NextFunction, Response } from 'express';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send({
		Hola: 'Esta es un prueba muy interesante de esta app',
	});
});

app.listen(process.env.PORT, () => {
	console.log(`Running on ${process.env.PORT}`);
});
