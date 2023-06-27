import { Schema, model, Document } from 'mongoose';

const postSchema = new Schema({
	created: {
		type: Date,
	},
	message: {
		type: String,
	},
	img: [
		{
			type: String,
		},
	],
	coords: {
		type: String,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		require: [true, 'Debe de existir ref a usuario'],
	},
});

postSchema.pre('save', function (next) {
	this.created = new Date();
	next();
});

interface IPost extends Document {
	created: Date;
	message: string;
	img: string[];
	coords: string;
	user: string;
}

export const Post = model<IPost>('post', postSchema);
