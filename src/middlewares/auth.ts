import { NextFunction, Request, Response } from 'express';
import Token from '../utils/token';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
	const token = req.get('x-token') || '';

	Token.comparedToken(token)
		.then((decoded: any) => {
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
