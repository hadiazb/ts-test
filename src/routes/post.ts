import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middlewares/auth';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../utils/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

postRoutes.get('/', async (req: any, res: Response, next: NextFunction) => {
	const page = Number(req.query.page) || 1;
	let skip = page - 1;
	skip = skip * 10;

	const posts = await Post.find()
		.sort({ _id: -1 })
		.skip(skip)
		.limit(10)
		.populate('user', '-password')
		.exec();

	res.send({
		ok: true,
		page,
		posts,
	});
});

postRoutes.post('/', [verifyToken], (req: any, res: Response, next: NextFunction) => {
	const body = req.body;
	body.user = req.user._id;

	const images = fileSystem.imagesTempToPost(req.user._id);

	body.img = images;

	Post.create(body)
		.then(async (postDB) => {
			await postDB.populate('user', '-password');

			res.json({
				ok: true,
				post: postDB,
			});
		})
		.catch((err) => {
			res.send({
				err,
				ok: false,
			});
		});
});

postRoutes.post('/upload', [verifyToken], async (req: any, res: Response, next: NextFunction) => {
	if (!req.files) {
		return res.status(400).send({
			ok: false,
			message: 'No se subio ningun archivo',
		});
	}

	const file: FileUpload = req.files.image;

	if (!file) {
		return res.status(400).send({
			ok: false,
			message: 'No se subio ningun archivo -image',
		});
	}

	if (!file.mimetype.includes('image')) {
		return res.status(400).send({
			ok: false,
			message: 'No se subio ningun archivo -image',
		});
	}

	await fileSystem.saveImageTemp(file, req.user._id);

	res.send({
		ok: true,
		file: file.mimetype,
	});
});

postRoutes.get('/image/:userid/:img', (req: any, res: Response, next: NextFunction) => {
	const userId = req.params.userid;
	const img = req.params.img;

	const pathImg = fileSystem.getImgUrl(userId, img);

	res.sendFile(pathImg);
});

export default postRoutes;
