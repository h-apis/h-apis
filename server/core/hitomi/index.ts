import * as hitomiService from './service';
import fse from 'fs-extra';
import path from 'path';
import HitomiDataManager from "./dataManager";

/**
 * 갤번을 입력하면 파일을 다운로드해준다.
 */
class HitomiCore {
    public directory: string;
    private dao: HitomiDataManager;

    constructor(directory: string) {
        this.directory = directory;
        this.dao = new HitomiDataManager();
    }

    async download(galleryNumber: number) {
        const {title, files, id} = await hitomiService.getGalleryMetaDataFromHitomi(galleryNumber);
        const escapedTitle = HitomiCore.escapeForDirectory(title);
        const imageUrlList = files.map((file) => hitomiService.getImageUrlFrom(galleryNumber, file));
        const targetDirectory = path.join(this.directory, escapedTitle);

        await fse.ensureDir(targetDirectory);
        await Promise.all(imageUrlList.map((url, index) =>
            hitomiService.downloadImage(url, path.join(targetDirectory, files[index].name))
        ));

        await this.dao.insert({
            rawTitle: title,
            title: escapedTitle,
            galleryNumber: parseInt(id),
        });
    }

    getDownloadedData() {
        return this.dao.getAll();
    }

    /**
     * 디렉토리명에 특수문자가 들어갈 수 없으므로, 전부 + 처리한다.
     * 추가로 공백은 _ 처리한다.
     * @private
     */
    private static escapeForDirectory(target: string) {
        return target
            .replace(/[ ]/g, '_')
            .replace(/[&\/\\#,+()$~%.'":*?<>{}|]/g, '+')
    }
}

export default HitomiCore;
