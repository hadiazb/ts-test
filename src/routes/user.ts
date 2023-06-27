import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import { User } from '../models/user.model';
import Token from '../utils/token';
import { verifyToken } from '../middlewares/auth';

const userRoutes = Router();

userRoutes.get('/', [verifyToken], (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;

	res.send({
		ok: true,
		user,
	});
});

userRoutes.post('/create', (req: Request, res: Response, next: NextFunction) => {
	const { email, password, name, avatar } = req.body;
	const user = {
		name,
		email,
		password: bcrypt.hashSync(password, 10),
		avatar,
	};

	User.create(user)
		.then((userDB) => {
			const tokenUser = Token.getJwtToken({
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

userRoutes.post('/login', (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	User.findOne({ email })
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
				const tokenUser = Token.getJwtToken({
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

userRoutes.put('/update', verifyToken, (req: any, res: Response, next: NextFunction) => {
	const { name, email, avatar } = req.body;

	User.findByIdAndUpdate(req.user._id, { name, email, avatar }, { new: true })
		.then((userDB) => {
			if (!userDB) {
				return res.json({
					ok: false,
					message: 'no encontrado',
				});
			}

			const tokenUser = Token.getJwtToken({
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

export default userRoutes;
