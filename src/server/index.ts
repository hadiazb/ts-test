import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

import userRoutes from '../routes/user';
import postRoutes from '../routes/post';

dotenv.config();

const dbUrl = process.env.DB_URL || '';

export default class Server {
	public app: express.Application;
	public port: number | string = 3000;

	constructor() {
		this.app = express();
		this.app.use(express.json());
		this.app.use(cors());
		this.fileUpload();
		this.connectDB();
		this.routes();
	}

	public start(callback: () => void) {
		this.app.listen(this.port, callback);
	}

	public async connectDB() {
		try {
			const resp = await mongoose.connect(dbUrl, {
				autoIndex: true,
			});

			console.log('Base de datos conectada');
		} catch (error) {
			console.log('Hay un error con la conexion de la DB');
			throw new Error('Hay error');
		}
	}

	public routes() {
		this.app.use('/users', userRoutes);
		this.app.use('/posts', postRoutes);
	}

	public fileUpload() {
		this.app.use(fileUpload());
	}
}
