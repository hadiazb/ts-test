import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
	constructor() {}

	public saveImageTemp(file: FileUpload, userId: string) {
		return new Promise((resolve, reject) => {
			const path = this.createFileUser(userId);
			const nameFile = this.generateUniqueName(file.name);

			file.mv(`${path}/${nameFile}`, (err: any) => {
				if (err) {
					reject(err);
				} else {
					resolve(`${path}/${nameFile}`);
				}
			});
		});
	}

	private createFileUser(userId: string) {
		const pathUser = path.resolve(__dirname, '../uploads', userId);
		const pathUserTemp = pathUser + '/temp';

		const exist = fs.existsSync(pathUser);

		if (!exist) {
			fs.mkdirSync(pathUser);
			fs.mkdirSync(pathUserTemp);
		}

		return pathUserTemp;
	}

	private generateUniqueName(originalName: string) {
		const arrName = originalName.split('.');
		const extension = arrName[arrName.length - 1];

		const idUnique = uniqid();

		return `${idUnique}.${extension}`;
	}

	public imagesTempToPost(userId: string) {
		const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
		const pathPost = path.resolve(__dirname, '../uploads', userId, 'posts');

		if (!fs.existsSync(pathTemp)) {
			return [];
		}

		if (!fs.existsSync(pathPost)) {
			fs.mkdirSync(pathPost);
		}

		const imagesTemp = this.getImagesInTemp(userId);

		imagesTemp.forEach((img) => {
			fs.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`);
		});

		return imagesTemp;
	}

	private getImagesInTemp(userId: string) {
		const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

		return fs.readdirSync(pathTemp) || [];
	}

	public getImgUrl(userId: string, img: string) {
		const pathImg = path.resolve(__dirname, '../uploads', userId, 'posts', img);

		const exist = fs.existsSync(pathImg);

		if (!exist) {
			return path.resolve(__dirname, '../assets/400x250.jpg');
		}

		return pathImg;
	}
}
