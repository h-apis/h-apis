import * as hitomiService from './service';
import fse from 'fs-extra';
import path from 'path';

/**
 * 갤번을 입력하면 파일을 다운로드해준다.
 */
class HitomiCore {
    public directory: string;

    constructor(directory: string) {
        this.directory = directory;
    }

    async download(galleryNumber: number) {
        const {title, files} = await hitomiService.getGalleryMetaDataFromHitomi(galleryNumber);
        const imageUrlList = files.map((file) => hitomiService.getImageUrlFrom(galleryNumber, file));
        const targetDirectory = path.join(this.directory, title);

        await fse.ensureDir(targetDirectory);
        await Promise.all(imageUrlList.map((url, index) => {
            hitomiService.downloadImage(url, path.join(targetDirectory, files[index].name));
        }));
    }
}

export default HitomiCore;
