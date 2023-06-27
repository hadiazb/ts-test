import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
	name: {
		type: String,
		require: [true, 'Nombre obligatorio'],
	},
	avatar: {
		type: String,
		default: 'av-1-png',
	},
	email: {
		type: String,
		unique: true,
		require: [true, 'El correo es obligario'],
	},
	password: {
		type: String,
		require: [true, 'La contraseña es necesaria'],
	},
});

userSchema.method('comparedPassword', function (password: string = '') {
	if (bcrypt.compareSync(password, this.password)) {
		return true;
	}

	return false;
});

interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	avatar: string;

	comparedPassword(password: string): boolean;
}

export const User = model<IUser>('user', userSchema);
