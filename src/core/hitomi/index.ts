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
        const targetDirectory = path.join(this.directory, this.escapeForDirectory(title));

        await fse.ensureDir(targetDirectory);
        await Promise.all(imageUrlList.map((url, index) =>
            hitomiService.downloadImage(url, path.join(targetDirectory, files[index].name))
        ));
    }

    /**
     * 디렉토리명에 특수문자가 들어갈 수 없으므로, 전부 + 처리한다.
     * 추가로 공백은 _ 처리한다.
     * @private
     */
    private escapeForDirectory(target: string) {
        return target
            .replace(/[ ]/g, '_')
            .replace(/[&\/\\#,+()$~%.'":*?<>{}|]/g,'+')
    }
}

export default HitomiCore;
