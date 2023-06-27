import jwt from 'jsonwebtoken';

export default class Token {
	private static seed: string = 'secreto';
	private static expired: string = '30d';

	constructor() {}

	static getJwtToken(payload: any) {
		return jwt.sign({ user: payload }, this.seed, {
			expiresIn: this.expired,
		});
	}

	static comparedToken(token: string) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, this.seed, (err, decoded) => {
				if (err) {
					reject(err);
				} else {
					resolve(decoded);
				}
			});
		});
	}
}
